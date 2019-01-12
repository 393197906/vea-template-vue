import {routerConfig} from './router/index'
import service from '@/service/service'
import * as util from '@/util/util'
import * as ACCESS from './util/access'
import echarts from 'echarts'

export default {
  install: (Vue, options) => {
    Vue.prototype.$service = service // 挂载服务
    Vue.prototype.$echarts = echarts
    Vue.prototype.$routerConfig = routerConfig // 挂载路由配置
    Vue.prototype.$checkActionAccess = util.checkActionAccess // 挂载检查路由权限方法
    Vue.prototype.$ACCESS = ACCESS // 挂载权限表
    // 返回顶部
    Vue.prototype.$goTop = () => {
      const main = document.querySelector('.el-main')
      main.scrollTop = 0
    }
    // 转移字符实体
    Vue.prototype.$substr = util.toHtmlEntity
    // 判断元素是否在数组内
    Vue.prototype.$inArray = util.inArray
    Vue.filter('substr', util.toHtmlEntity)
    // //字符串截取
    Vue.filter('sublen', util.sublen)
    // 日期格式化
    Vue.filter('formatTime', util.formatTime)
    Vue.prototype.$formatTime = util.formatTime
    // 格式化货币
    Vue.filter('formatCurrency', util.formatCurrency)
    Vue.filter('formatNub', util.formatNub)
    Vue.prototype.$formatNub = util.formatNub
    Vue.prototype.$formatCurrency = util.formatCurrency
  }
}
