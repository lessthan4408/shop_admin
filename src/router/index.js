import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = () => import('@/views/login')
const layout = () => import('../views/layout.vue')
const index = () => import('../views/layout/index')
const menu = () => import('../views/layout/menu')
const role = () => import('../views/layout/role')
const user = () => import('../views/layout/user')
const category = () => import('../views/layout/category')
const specs = () => import('../views/layout/specs')
const goods = () => import('../views/layout/goods')
const member = () => import('../views/layout/member')
const banner = () => import('../views/layout/banner')
const seckill = () => import('../views/layout/seckill')

const router = new Router({
  // linkActiveClass: 'active',
  routes: [
    {
      path: '/login',
      component: login
    },
    {
      path: '/',
      component: layout,
      children: [
        {
          path: 'index',
          component: index
        },
        {
          path: 'menu',
          component: menu
        },
        {
          path: 'role',
          component: role
        },
        {
          path: 'user',
          component: user
        },
        {
          path: 'category',
          component: category
        },
        {
          path: 'specs',
          component: specs
        },
        {
          path: 'goods',
          component: goods
        },
        {
          path: 'member',
          component: member
        },
        {
          path: 'banner',
          component: banner
        },
        {
          path: 'seckill',
          component: seckill
        },
        {
          path: '*',
          redirect: '/index'
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('userinfo')) {//已登录
    if (to.path == '/login') {
      next(false)
    } else {
      next()
    }
  } else {//未登录
    if (to.path == '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router;

