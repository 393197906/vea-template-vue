// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import {vue as Vue}  from 'vea'
import App from './App.vue'
import store from './store'
import router from './router'
import common from './common'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './element-variables.scss'
import './main.css'
import VueDND from 'awe-dnd'

Vue.use(ElementUI)
Vue.use(common)
Vue.use(VueDND)

new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
})
