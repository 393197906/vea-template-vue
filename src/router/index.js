import { vue, vueRouter as Router } from 'vea'
vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('../pages/Home')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
