//请求接口
import { http } from './http'

const API = {
  //请求上传图片
  uploadImg: '/api/imageUpload',
  uploadFile: '/api/fileUpload'
}

//上传图片
export const reqUploadImg = (data) => http.post(API.uploadImg, data)
//上传文件
export const reqUploadFile = (data) => http.post(API.uploadFile, data)
