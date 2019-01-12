import createService from './service/index'

export default vue => {
  const fetch = vue.$_createFetch({
    headers: {
      'Authorization': ''
    },
    error: ({ statusCode = 500, message = '未知错误' }) => {
      if (message.indexOf('timeout') > -1) {
        message = '请求超时'
      }
      if (parseInt(statusCode) === 403) {
        // sessionStorage.clear()
        // history.go(0)
        // return
      }
    }
  })
  const urls = {
    cloudUrl: CLOUD_URL
  }
  return createService(fetch, urls)
}
