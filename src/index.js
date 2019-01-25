import { vue as Vue } from 'vea'
import VueMeta from 'vue-meta'
import App from './App.vue'
import router from './router'
Vue.use(VueMeta)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
