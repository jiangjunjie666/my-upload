<template>
  <div>
    <input type="file" @change="fileChange" />
    <div class="btn">
      <el-button type="primary" @click="uploadBtn">点击上传</el-button>
      <el-button type="primary">停止上传</el-button>
    </div>
    <div class="progress">
      <el-progress :text-inside="true" :stroke-width="24" :percentage="percentage" status="success" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { http } from '@/api/http.js'
import SparkMD5 from 'spark-md5'
import { ElMessage } from 'element-plus'
//存放切片文件
const fileList = ref([])
const fileMd5 = ref('')
const file = ref([])
let percentage = ref(0)
const fileChange = (e) => {
  console.log(e.target.files[0])
  //分片
  file.value = e.target.files[0]
  percentage.value = 0
}
//切片函数
const uploadBtn = () => {
  //切片
  for (let i = 0; i < file.value.size; i += 1024 * 1024) {
    fileList.value.push(file.value.slice(i, i + 1024 * 1024))
  }
  console.log(fileList.value)
  const hash = new SparkMD5.ArrayBuffer() // 构建hash值对象
  const fileReader = new FileReader()
  fileReader.onload = () => {
    hash.append(fileReader.result)
    fileMd5.value = hash.end()
    upload(0)
  }
  fileReader.readAsArrayBuffer(file.value)
}

const upload = async (index) => {
  if (index == fileList.value.length) {
    mergeUpload()
    return
  }
  const formData = new FormData()
  formData.append('chunk', fileList.value[index])
  formData.append('index', index)
  formData.append('name', fileMd5.value + '@' + index) // 名字
  formData.append('filename', fileMd5.value) // 文件名
  let res = await http.post('/api/upload_chunk1', formData)
  console.log(res)
  if (res.code == 300) {
    //证明已经存在部分文件
    percentage.value = ((res.index / fileList.value.length) * 100).toFixed(2)
    upload(res.index + 1)
  } else if (res.code == 200) {
    percentage.value = (((index + 1) / fileList.value.length) * 100).toFixed(2)
    upload(index + 1)
  } else {
    upload(index)
  }
}

const mergeUpload = async () => {
  //合并请求
  let res = await http.post('/api/merge_chunk', {
    filename: fileMd5.value,
    extname: file.value.type.split('/').pop()
  })
  if ((res.code = 200)) {
    file.value = null
    fileList.value = []
    fileMd5.value = ''
    ElMessage({
      type: 'success',
      message: '上传成功'
    })
  }
}
</script>

<style lang="scss" scoped>
.btn {
  margin: 10px 0;
}
.progress {
  width: 300px;
}
</style>
