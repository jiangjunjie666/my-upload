//vue-router
// import Vue from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      //重定向至主页
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('../views/home/index.vue'),
      name: 'home',
      redirect: '/home/imageUp',
      meta: {
        title: '首页'
      },
      children: [
        {
          path: '/home/imageUp',
          component: () => import('../views//home/imageUp/index.vue'),
          name: 'imageUp',
          meta: {
            title: '图片上传'
          }
        },
        {
          path: '/home/dragUp',
          component: () => import('../views/home/dragUp/index.vue'),
          name: 'dragUp',
          meta: {
            title: '拖拽上传'
          }
        },
        {
          path: '/home/fileUp',
          component: () => import('@/views/home/fileUp/index.vue'),
          name: 'fileUp',
          meta: {
            title: '文件上传'
          }
        }
      ]
    }
  ]
})

export default router
