import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Data.vue'
import AddGood from '../components/goods/AddGood.vue'
import EditGood from '../components/goods/EditGood.vue'
import Orders from '../components/order/Order.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: AddGood },
      { path: '/goods/edit', component: EditGood },
      { path: '/orders', component: Orders },
    ],
  },
]

const router = new VueRouter({
  routes,
})

// 为路由对象，添加导航守卫 beforeEach
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页面，直接放行
  if (to.path === '/login') {
    return next()
  } else {
    // 从 sessionStorage 中获取到，保存的 token 值
    const tokenStr = window.sessionStorage.getItem('token')
    // 没有 token ，强制跳转到登录界面
    if (!tokenStr) return next('/login')
    next()
  }
})

export default router
