import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Login = () => import(/* webpackChunkName: "login-home-webcome" */ '../components/login.vue')
const Home = () => import(/* webpackChunkName: "login-home-webcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login-home-webcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
const Users = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/power/Roles.vue')

// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
const Cate = () => import(/* webpackChunkName: "cate-params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "cate-params" */ '../components/goods/Params.vue')

// import Goods from '../components/goods/Data.vue'
// import AddGood from '../components/goods/AddGood.vue'
// import EditGood from '../components/goods/EditGood.vue'
const Goods = () => import(/* webpackChunkName: "goods-add-edit" */ '../components/goods/Data.vue')
const AddGood = () => import(/* webpackChunkName: "goods-add-edit" */ '../components/goods/AddGood.vue')
const EditGood = () => import(/* webpackChunkName: "goods-add-edit" */ '../components/goods/EditGood.vue')

// import Orders from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'
const Orders = () => import(/* webpackChunkName: "orders-report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "orders-report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome, meta: { title: '系统首页' } },
      {
        path: '/users',
        component: Users,
        meta: { title: '用户管理/用户列表' },
      },
      {
        path: '/rights',
        component: Rights,
        meta: { title: '权限管理/权限列表' },
      },
      {
        path: '/roles',
        component: Roles,
        meta: { title: '权限管理/角色列表' },
      },
      {
        path: '/categories',
        component: Cate,
        meta: { title: '商品管理/商品分类' },
      },
      {
        path: '/params',
        component: Params,
        meta: { title: '商品管理/分类参数' },
      },
      {
        path: '/goods',
        component: Goods,
        meta: { title: '商品管理/商品列表' },
      },
      {
        path: '/goods/add',
        component: AddGood,
        meta: { title: '商品管理/添加商品' },
      },
      {
        path: '/goods/edit',
        component: EditGood,
        meta: { title: '商品管理/编辑商品' },
      },
      {
        path: '/orders',
        component: Orders,
        meta: { title: '订单管理/订单列表' },
      },
      {
        path: '/reports',
        component: Report,
        meta: { title: '数据统计/数据报表' },
      },
    ],
    meta: { title: '系统首页' },
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
