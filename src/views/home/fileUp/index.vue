<template>
  <div class="container">
    <input type="file" ref="fileInputRef" style="display: none" @change="handleFileClick" />
    <p>不可选中重复的文件</p>
    <el-button type="primary" @click="handleBtnClick">可选择多个文件</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="文件名" width="400" />
      <el-table-column prop="size" label="文件大小" width="400" />
      <!-- 控制显示 -->
      <el-table-column label="文件状态" width="400">
        <template #default="scope1">
          <span v-if="scope1.row.status == '准备上传'">{{ scope1.row.status }}</span>
          <el-progress :percentage="percentage" stroke-width="8" :width="100" :duration="1" v-if="scope1.row.status == '正在上传'" />
          <span v-if="scope1.row.status == '上传成功'" style="color: #67c23a">{{ scope1.row.status }}</span>
          <span v-if="scope1.row.status == '上传失败'" style="color: red">{{ scope1.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template #default="scope3">
          <el-button size="small" type="danger" @click="handleDelete(scope3.$index, scope3.row)" :disabled="scope3.row.status == '正在上传'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="success" style="margin-top: 20px" @click="handleUpload" :disabled="tableData.length == 0">一键上传</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { reqUploadFile } from '@/api/data.js'
import { ElMessage } from 'element-plus'
//存放文件的数组
const fileList = ref([])
//存放table的数据
const tableData = ref([])
//input框的ref
const fileInputRef = ref(null)
//进度条
const percentage = ref(0)
//正在上传的文件的index
const fileIndex = ref(0)
//触发文件选择事件
const handleBtnClick = () => {
  fileInputRef.value.click()
}

//触发文件选择框
const handleFileClick = (e) => {
  // console.log(e)
  let selectedFile = e.target.files[0]
  //将数据整合起来放进数组中
  tableData.value.push({
    id: tableData.value.length,
    name: selectedFile.name,
    //判断文件大小，大于0.1mb使用mb，否则使用kb
    size: selectedFile.size > 1024 * 1024 ? (selectedFile.size / 1024 / 1024).toFixed(2) + 'mb' : (selectedFile.size / 1024).toFixed(2) + 'kb',
    status: '准备上传'
  })
  fileList.value.push(selectedFile)
}
//删除选中的文件
const handleDelete = (index, row) => {
  console.log(index)
  //根据index和id进行对比，删除其中的元素
  tableData.value.splice(index, 1)
  fileList.value.splice(index, 1)
}
//一键上传文件
const handleUpload = () => {
  fileIndex.value = 0
  //先遍历所有的循环找到没有上传的文件的index
  tableData.value.forEach((item) => {
    if (item.status == '上传成功' || item.status == '上传失败') fileIndex.value++
  })
  if (tableData.value.length == fileIndex.value) {
    return
  }
  //遍历数组
  tableData.value[fileIndex.value].status = '正在上传'
  //开启一个定时器
  let timer = setInterval(() => {
    //进度条增加
    percentage.value++
    if (percentage.value == 100) {
      uploadFile(fileList.value[fileIndex.value]).then((res) => {
        if (res) {
          tableData.value[fileIndex.value].status = '上传成功'
        } else {
          //返回的是一个promise
          tableData.value[fileIndex.value].status = '上传失败'
        }
      })
      percentage.value = 0
      let timer2 = setTimeout(() => {
        //递归调用
        handleUpload()
        clearTimeout(timer2)
      }, 500)
      clearInterval(timer)
    }
  }, 50)
}
//上传文件的函数
const uploadFile = async (value) => {
  // 创建一个FormData对象来包装文件
  const formData = new FormData()
  formData.append('file', value)
  try {
    const res = await reqUploadFile(formData) // 等待 Promise 解析
    console.log(res)
    // 根据 Promise 解析的结果来判断上传是否成功
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '上传成功'
      })
      return true
    } else {
      ElMessage({
        type: 'error',
        message: res.msg
      })
      return false
    }
  } catch (error) {
    console.error('上传文件时发生错误:', error)
    return false
  }
}
</script>

<style lang="scss" scoped>
p {
  font-size: 14px;
  color: red;
  margin: 10px 0;
}
</style>
