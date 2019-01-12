/**
 * 检查路由权限
 * @param route
 * @returns {boolean}
 */
export function checkRouterAccess (route) {
  if (isSuperAdmin()) {
    return true
  }
  const {meta: {access}} = route
  if (access === undefined) {
    return true
  }
  const roles = getUserAccess()
  return checkAccess(access, roles)
}

/**
 * 检查操作权限
 * @param role
 * @returns {boolean}
 */
export function checkActionAccess (role) {
  // return true;
  if (isSuperAdmin()) {
    return true
  }
  if (role === undefined) {
    return true
  }
  const roles = getUserAccess()
  return checkAccess(role, roles)
}

/**
 * 检查权限
 * @param role
 * @param roles
 * @returns {boolean}
 */
export function checkAccess (role, roles = []) {
  return !!roles.find(item => item.check_node === role)
}

/**
 * 获取用户信息
 * @returns {any | {}}
 */
export function getUserInfo () {
  return JSON.parse(sessionStorage.getItem('user_info')) || {}
}

/**
 * 获取用户权限节点
 * @returns {*}
 */
export function getUserAccess () {
  const userInfo = getUserInfo()
  const {node = []} = userInfo
  return node
}

/**
 * 是否超级管理员
 * @returns {boolean}
 */
export function isSuperAdmin () {
  const userInfo = getUserInfo()
  const {create_type = 0} = userInfo
  return !!create_type
}

/**
 * 判断登陆
 * @returns {boolean}
 */
export function isLogin () {
  return !!sessionStorage.getItem('user_info')
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 * @param num
 * @returns {string}
 */
export function formatCurrency (num) {
  if (num === undefined) return
  num = num.toString().replace(/\$|\,/g, '')
  if (isNaN(num)) { num = '0' }
  const sign = (num == (num = Math.abs(num)))
  num = Math.floor(num * 100 + 0.50000000001)
  let cents = num % 100
  num = Math.floor(num / 100).toString()
  if (cents < 10) { cents = '0' + cents }
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
    num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3))
  }
  return (((sign) ? '' : '-') + num + '.' + cents)
}

/**
 * 格式化日期
 * @param value
 * @param format
 * @returns {string}
 */
export function formatTime (value, format = 'yyyy-MM-dd h:m:s') {
  if (!value) return ''
  const d = new Date(parseInt(value) * 1000)
  const date = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    'S+': d.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return format
}

/**
 * 字符串截取
 * @param value
 * @param length
 * @returns {string}
 */
export const sublen = (value, length = 8) => {
  if (!value) return ''
  return value.length > length ? `${value.substr(0, length)}...` : value
}

/**
 * 转换字符串实体
 * @param html
 * @returns {*}
 */
export const toHtmlEntity = (html) => {
  return html
    .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
}

/**
 * 判断元素是否在数组内
 * @param val
 * @param arr {Array}
 * @returns {*}
 */
export const inArray = (val, arr) => {
  for (var i = 0; i < arr.length; i++) {
    if (val === arr[i]) {
      return i
    }
  }
  return -1
}

/**
 * form 手机号验证
 */
// 验证手机号0531-5555555   15069118804
export const isMobile = (rule, value, callback) => {
  var RegExp = /^((0\d{2,3}-\d{7,8})|(1[357894]\d{9}))$/
  if (!RegExp.test(value)) {
    callback(new Error('手机号格式不正确'))
  } else {
    callback()
  }
}

/**
 * 编辑信息 涉及省市区 级联选择器 省id请求市，市id请求 区县数据  参考  编辑供应商页面
 * @ cityArr [省id, 市id]
 * @ That this 对象
 * @ key 当前页面 省市区数据字段
 */
export const getCityData = async (cityArr, That, key) => {
  const retust = await Promise.all([
    That.$service.zone.options_city(cityArr[cityArr.length - 2]),
    That.$service.zone.options_district(cityArr[cityArr.length - 1])
  ])
  retust.map(item => {
    if (item.err) return
  })

  const [cityList, districtList] = retust
  let {data: {data}} = cityList
  let {data: {data: data_}} = districtList
  That[key].map(async item => {
    if (item.code === cityArr[cityArr.length - 2]) {
      data.map(item_ => {
        if (item_.code === cityArr[cityArr.length - 1]) {
          item_['children'] = data_
        }
      })
      item['children'] = data
    }
  })
}
/**
 * 不四舍五入保留n位小数
 * @param val
 * @param len 默认保留两位小数
 * @returns {string}
 */
export function formatNub (val, len = 4) {
  return Math.floor(val * Math.pow(10, len)) / Math.pow(10, len)
}

/**
 * 浮点数相减 解决精度问题
 * @param val
 * @param len 默认保留两位小数
 * @returns {string}
 */
export function subtract (val1, val2) {
  let len1, len2
  try {
    len1 = val1.toString().split('.')[1].length
  } catch (e) {
    len1 = 0
  }
  try {
    len2 = val2.toString().split('.')[1].length
  } catch (e) {
    len2 = 0
  }
  const m = Math.pow(10, Math.max(len1, len2))
  const n = len1 >= len2 ? len1 : len2
  return ((val1 * m - val2 * m) / m).toFixed(n)
}
