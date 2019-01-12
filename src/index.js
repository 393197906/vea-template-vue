import {vue}  from 'vea'
import App from './App.vue'
import store from './store'
import router from './router'
import service from "./service.js"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

vue.prototype.$service = service(vue);
vue.use(ElementUI);
new vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
});
