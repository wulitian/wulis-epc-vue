import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
//创建axios实例
const service = axios.create({
  // api的base_url
  baseURL: process.env.API_ROOT,
  // 设置请求超时时间30s
  timeout: 30000
})
axios.defaults.withCredentials = true
//错误处理
const err = (error) => {
  console.log(error)
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && ! data.result ) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}
//请求拦截器
service.interceptors.request.use((config) => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] ='Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
  },
  err
)

//响应拦截器
service.interceptors.response.use((response) => {
  return response.data
  },
  err
)

export default service
