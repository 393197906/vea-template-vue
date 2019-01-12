import {vue as Vue}  from 'vea'
import App from './App.vue'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
});
