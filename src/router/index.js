import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
import { getCurrentUserRoutersApi } from '@/api/ums'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

/**
 * 静态路由
 */
const constRouter = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/login',
    name: '登录页',
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  }
]

/**
 * 静态测试菜单路由(不依赖后端菜单路由)
 */
const constTestMenuRouter = [
  {
    path: '/other/test',
    name: '测试页面',
    component: 'Layout',
    meta: { title: '测试页面', icon: 'el-icon-loading', breadcrumb: true },
    alwaysShow: true,
    hidden: false,
    children: [
      {
        'path': '/other/two',
        'name': '二级菜单',
        'component': 'other/test/two/Index',
        'meta': {
          'title': '二级菜单',
          icon: 'el-icon-takeaway-box',
          'breadcrumb': true
        },
        'hidden': false,
        'alwaysShow': true,
        'children': [
          {
            'path': '/other/three',
            'name': '三级菜单',
            'component': 'other/test/two/three/Index',
            'meta': {
              'title': '三级菜单',
              'icon': '',
              'breadcrumb': true
            },
            'hidden': false,
            'alwaysShow': false
          }
        ]
      },
      {
        'path': '/other/markdown',
        'name': 'MarkDown',
        'component': 'other/test/markdown',
        'meta': {
          'title': 'MarkDown',
          'icon': '',
          'breadcrumb': true
        },
        'hidden': false,
        'alwaysShow': false
      },
      {
        'path': '/other/tinymce',
        'name': '富文本编辑器',
        'component': 'other/test/tinymce',
        'meta': {
          'title': '富文本编辑器',
          'icon': '',
          'breadcrumb': true
        },
        'hidden': false,
        'alwaysShow': false
      },
      {
        path: '/other/test/requestTest',
        component: 'other/test/requestTest',
        name: 'requestTest测试页面',
        meta: { title: 'requestTest测试页面', icon: '', breadcrumb: true },
        hidden: false,
        alwaysShow: false
      }
    ]
  }
]

/**
 * 实例化路由表并初始化静态路由
 */
const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constRouter
})

/**
 * 路由白名单，不需要登录也能访问的页面
 */
const whiteList = ['/login']

/**
 * 动态路由
 */
let asyncRouter

// 导航守卫
// 实现路由拦截并将“当前用户动态菜单路由”和“静态测试菜单路由”添加到“动态路由”中
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (whiteList.indexOf(to.path) !== -1) {
    // console.log('进入的是路由白名单，放行')
    next()
    return
  }
  const accessToken = store.state.account.accessToken
  const user = store.state.account.user
  // 缓存中有token和用户信息才允许进入
  if (!accessToken.length || !user) {
    if (to.path === '/login') {
      // 如果whiteList已经包含/login，那么即使进入/login，那么也不会执行到这一行
      // console.log('没有token和user info，但进入的是登录页，直接放行')
      next()
    } else {
      // console.log('没有token和user info，强制进入登录页')
      next('/login')
    }
    return
  }
  if (asyncRouter) {
    // console.log('内存中已经存在路由表，放行')
    next()
    return
  }
  // 当前用户动态菜单路由
  const userRouter = store.state.account.userRoutes
  console.log('从缓存中获取路由表')
  if (userRouter) {
    // console.log('缓存中已经存在路由表，放行')
    asyncRouter = userRouter
    go(to, next)
    return
  }
  getCurrentUserRoutersApi().then(res => {
    // console.log('缓存不存在路由表，从后端获取路由表')
    const permissions = res.data.data.permissions
    store.commit('account/setPermissions', permissions)
    asyncRouter = res.data.data.routes
    // 添加静态测试菜单
    constTestMenuRouter.forEach(it => {
      asyncRouter.push(it)
    })
    // 在动态路由的最后添加404路由
    asyncRouter.push({
      path: '*',
      name: '404',
      component: 'error-page/404',
      hidden: false,
      alwaysShow: false
    })
    store.commit('account/setRoutes', asyncRouter)
    // console.log('从后端获取userRouter完毕，设置asyncRouter缓存完毕，放行')
    go(to, next)
  })
})

router.afterEach(() => {
  NProgress.done()
})

// 将“动态路由”挂载到路由表,并放行
function go(to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  router.addRoutes(asyncRouter)
  // next()
  next({ ...to, replace: true }) //  hack方法,确保addRoutes已完成
}

/**
 *根据后端路由的component路径实例化路由组件
 */
function filterAsyncRouter(routes) {
  return routes.filter(route => {
    const component = route.component
    if (component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = view(component)
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
  })
}
function view(path) {
  return function(resolve) {
    import(`@/views/${path}.vue`).then(mod => {
      resolve(mod)
    })
  }
}

export default router
