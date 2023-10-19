<template>
  <div class="container">
    <div class="top">My upload</div>
    <div class="heart">
      <div class="left">
        <ul>
          <li :class="{ active: activeIndex == 1 }" @click="changeUp('/home/imageUp', 1)">
            <el-icon size="20"><PictureFilled /></el-icon>
            <p>图片上传</p>
          </li>
          <li :class="{ active: activeIndex == 2 }" @click="changeUp('/home/fileUp', 2)">
            <el-icon size="20"><FolderAdd /></el-icon>
            <p>多文件上传</p>
          </li>
          <li :class="{ active: activeIndex == 3 }" @click="changeUp('/home/dragUp', 3)">
            <el-icon size="20"><UploadFilled /></el-icon>
            <p>拖拽上传</p>
          </li>
          <li :class="{ active: activeIndex == 4 }" @click="changeUp('/home/BigFileUp', 4)">
            <el-icon size="20"><Folder /></el-icon>
            <p>大文件上传</p>
          </li>
          <li :class="{ active: activeIndex == 5 }" @click="changeUp('/home/tailorUp', 5)">
            <el-icon size="20"><Aim /></el-icon>
            <p>图片裁剪上传</p>
          </li>
        </ul>
      </div>
      <div class="layout">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
//引入路由
import { useRouter } from 'vue-router'

const $router = useRouter()
let activeIndex = ref(1)

//二级路由跳转函数
const changeUp = (path, index) => {
  //路由跳转
  $router.push(path)
  activeIndex.value = index
}
</script>

<style lang="scss" scoped>
.container {
  .top {
    width: 100vw;
    height: 100px;
    background-color: rgb(61, 221, 154);
    text-align: center;
    font-size: 30px;
    color: #fff;
    line-height: 100px;
  }
  .heart {
    width: 100vw;
    //高度减去100px
    height: calc(100vh - 100px);
    display: flex;
    .left {
      width: 350px;
      height: 100%;
      background-color: #fffcfc;
      border-right: 1px solid #ccc;
      // padding-left: 20px;
      ul {
        li {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          padding-left: 20px;
          p {
            margin-left: 10px;
            font-size: 16px;
            line-height: 40px;
          }
        }
        //给li加个active
        .active {
          color: rgb(61, 221, 154);
        }
        //加hover
        li:hover {
          cursor: pointer;
          background-color: rgb(146, 236, 199);
          opacity: 0.8;
          color: black;
        }
      }
    }
    .layout {
      width: calc(100% - 350px);
      height: 100%;
      padding: 20px;
    }
  }
}
</style>
