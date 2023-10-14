//axios请求拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
const http = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  timeout: 5000
})

// 创建一个 Cancel Token 对象
const cancelSource = axios.CancelToken.source()
//请求拦截器
http.interceptors.request.use((config) => {
  config.cancelToken = cancelSource.token
  return config
})

//返回拦截器
http.interceptors.response.use(
  (response) => {
    return response.data
  },
  //失败回调
  (error) => {
    ElMessage({
      type: 'error',
      message: error.message
    })
    return Promise.reject(error)
  }
)

export { http, cancelSource }
