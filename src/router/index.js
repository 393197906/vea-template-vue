import { vue, vueRouter as Router } from 'vea'

vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('../pages/Home')
    },
    {
      path: '/test',
      component: () => import('../pages/Test')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
