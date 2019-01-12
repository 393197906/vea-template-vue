import { Message } from 'element-ui'

export default ({statusCode, message}) => {
  if ((statusCode === 403 && message.trim() === 'token已失效') || (parseInt(statusCode) === 400 && message.trim() === '无效的Authorization')) { // token 失效
    sessionStorage.removeItem('user_info')
    history.go(0)
    return
  }
  Message.error(message)
}
