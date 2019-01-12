import {vue,vueRouter} from "vea"
vue.use(vueRouter);
const router = new vueRouter({
  routes: [
    {
      path:"/",
      component:()=>import("../pages/Home")
    }
  ]
});

router.beforeEach((to, from, next) => {
  next()
});

export default router
