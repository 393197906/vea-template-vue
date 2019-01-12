import axios from 'axios'
import qs from 'qs'
import doErr from './doerr'
import {getUserInfo} from '@/util/util'

export const getToken = () => {
  const user_info = getUserInfo()
  return user_info.token || ''
}

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const fetch = (url, data, method, load) => {
  load = load === undefined
  let promise
  if (load) {
    NProgress.start()
  }
  let option = {
    method,
    url,
    headers: {
      'Authorization': getToken()
    },
    validateStatus: function (status) {
      return true
    }
  }
  if (method === 'post') {
    option = {...option, data: qs.stringify(data)}
  } else if (method === 'get') {
    option = {...option, params: {...data}}
  } else if (method === 'delete') {
    option = {...option, data: qs.stringify(data)}
  } else if (method === 'put') {
    option = {...option, data: qs.stringify(data)}
  } else if (method === 'upload') {
    promise = axios.post(url, data, {
      validateStatus: function (status) {
        return true
      },
      headers: {
        'Authorization': getToken(),
        'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
      }
    })
  }

  promise = promise || axios(option)
  return promise.then(({data, status, statusText}) => {
    // if (status >= 400) {
    //   throw {statusCode: status, message: statusText}
    // }
    return data
  }).then(data => {
    const {status, code, message, msg} = data
    if (parseInt(status) !== 200 && parseInt(code) !== 200) {
      throw {statusCode: status, message: message || msg}
    }
    NProgress.done()
    return data
  }).then(data => ({data})).catch(err => {
    NProgress.done()
    doErr(err)
    return {err}
  })
}

export const get = (url, data = {}, load) => fetch(url, data, 'get', load)
export const post = (url, data = {}, load) => fetch(url, data, 'post', load)
export const del = (url, data = {}, load) => fetch(url, data, 'delete', load)
export const put = (url, data = {}, load) => fetch(url, data, 'put', load)
export const upload = (url, data = {}, load) => fetch(url, data, 'upload', load)
