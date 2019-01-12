/**
 * axios全局配置，包括验证校验及错误处理
 */
import Vue from 'vue'
import axios from 'axios'
// import store from '../store'
import router from '../router'

const service = axios.create({
  timeout: 5000
})

// baseURL
axios.defaults.baseURL = 'http://devcloud.91youxian.net/v2/'
axios.defaults.responseType = 'json'
// http request 拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
service.interceptors.request.use(
  config => {
    // const dogo_token = get_local_user_token();
    const token = JSON.parse(sessionStorage.getItem('user_info')).token
    // const dogo_token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJhdWQiOiIiLCJpYXQiOjE1MjE1OTg3MzAsImV4cCI6MTUyNDE5MDczMCwibmJmIjoxMzU3MDAwMDAwLCJqdGkiOiIxNzc0QzE2MDhEREFDMTE0Q0RFRDQ3RUUyNDgxNDBCNyIsImlkIjoyODYsIm9wZW5faWQiOiJBRTgxQjUxRkZEM0YwMUZCQ0IyQ0EzNzdBRjUxNkQ1MSIsInVzZXJfbmFtZSI6bnVsbCwicGhvbmUiOiIxNTg2NjY4ODczMiIsInNob3BfaW5mbyI6eyJpZCI6MTEwLCJ1c2VyX2lkIjoyODYsInNob3BfbmFtZSI6ImNlaGkiLCJzaXRlX2lkIjpudWxsLCJzaG9wX29wZW5faWQiOiIyODYiLCJzdGF0dXMiOjIwLCJibG9ja19pZCI6MTAsInN5c19tYXJrIjoieWljaGVuZ2Nsb3VkIiwiZGJfbnVtYmVyIjoiIiwiY3JlYXRlZF9hdCI6IjIwMTgtMDMtMTkgMDk6MDk6NDEiLCJ1cGRhdGVkX2F0IjoiMDAwMC0wMC0wMCAwMDowMDowMCJ9LCJlbWFpbCI6bnVsbCwic3RhdHVzIjoyMCwic3lzX21hcmsiOiJ5aWNoZW5nY2xvdWQifQ.sAAzsZ1AlciYuw4994_RAICCVlnX2-azahbf7vAvVnI";
    const dogo_token = token
    // if (store.state.user.token) {
    //   config.headers.Authorization = `token ${store.state.user.token}`
    // }
    if (dogo_token) {
      config.headers.Authorization = dogo_token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push('error/401')
          break
        case 403:
          router.push('error/403')
          break
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }
)
Vue.prototype.$axios = service
export default service
