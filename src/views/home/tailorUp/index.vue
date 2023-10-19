<template>
  <div class="container">
    <div class="box" v-if="act == 1">
      <div class="add">
        <input type="file" ref="fileInputRef" style="display: none" @change="handleFileChange" />
        <el-icon size="100" color="#ccc" @click="openFileInput"><Plus /></el-icon>
      </div>
    </div>
    <!-- 显示待裁剪的图片 -->
    <div class="photo-container" v-if="act == 2">
      <div class="photo-and-crop">
        <img :src="base64Img" alt="" class="photo" />
        <div ref="cropBox" class="crop-box" @click="dragOpen" @mousemove="dragging"></div>
      </div>
    </div>
  </div>
  <el-button type="primary" style="margin: 50px" @click="drawImage">裁剪图片</el-button>
  <div class="IMG"></div>
</template>

<script setup>
import { ref } from 'vue'
import { http } from '@/api/http'
const act = ref(1)
const fileInputRef = ref(null)
const base64Img = ref('')
const cropBox = ref(null)
const offsetX = ref(0)
const offsetY = ref(0)
//控制是否可以移动
const drag = ref(false)
//裁剪后的图片
const cropImg = ref('')
//触发选择文件
const openFileInput = () => {
  fileInputRef.value.click()
}

const handleFileChange = (e) => {
  act.value = 2
  let file = e.target.files[0]
  console.log(e.target.files[0])
  // 将图片转为base64显示loading状态
  const reader = new FileReader()
  reader.onload = (e) => {
    base64Img.value = e.target.result
  }
  reader.readAsDataURL(file) //调用生成base64
}
//控制选择裁剪
const dragOpen = () => {
  drag.value = !drag.value
}
//处理裁剪框
const dragging = (e) => {
  //需要计算出图片框的距离
  // console.log(e.clientX, e.clientY)
  if (drag.value) {
    if (e.clientX > 445 && e.clientX < 694) {
      cropBox.value.style.left = e.clientX - 370 + 'px'
      offsetX.value = e.clientX - 370
      offsetY.value = e.clientY - 120
    }
    if (e.clientY > 195 && e.clientY < 444) {
      cropBox.value.style.top = e.clientY - 120 + 'px'
      offsetX.value = e.clientX - 370
      offsetY.value = e.clientY - 120
    }
    console.log(offsetX.value, offsetY.value)
  }
}
//使用canvas绘制图片
const drawImage = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200
  const ctx = canvas.getContext('2d')
  // 绘制图片
  const image = new Image()
  image.src = base64Img.value
  image.onload = () => {
    // 绘制图片
    ctx.drawImage(image, offsetX.value, offsetY.value, 150, 150, 0, 0, 200, 200)
    document.querySelector('.IMG').appendChild(canvas)
  }
  canvas.toBlob((blob) => {
    console.log(blob)
    // 转成blob
    const file = new File([blob], 'avatar.jpg', { type: 'image/jepg' })
    console.log(file)
    //发送请求
    upload(file)
  }, 'image/jepg')
}

const upload = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  let res = await http.post('/api/imageUpload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  console.log(res)
}
</script>

<style lang="scss" scoped>
.box {
  width: 350px;
  height: 350px;
  border: 2px dashed rgb(175, 171, 171);
  border-radius: 2em;
  display: flex;
  justify-content: center;
  align-items: center;

  .add:hover {
    cursor: pointer;
  }
}
.photo-container {
  position: relative;
  display: inline-block;

  .photo-and-crop {
    position: relative;
    .photo {
      border: 1px solid #ccc;
      z-index: -1;
      width: 400px;
      height: 400px;
    }

    .crop-box {
      z-index: 1;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
      border: 2px solid white;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
