//基础路由
export const baseRouterMap = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login'),
  },
  {
    path: '/',
    name: 'main',
    component: () => import('@/components/Main'),
    redirect: '/main/Workplace',
    meta: { title: '首页' },
    children:[
      {
        path: '/main/Workplace',
        name: 'Workplace',
        component: () => import('@/components/Workplace'),
        meta: { title: '工作区' },
      }
    ]
  }
]
//异步路由
export const asyncRouterMap = [

  {
    path: '/',
    name: 'main',
    component: () => import('@/components/Main'),
    redirect: '/main/workplace',
    meta: { title: '首页' },
    children:[
      {
        path: '/main/Workplace',
        name: 'Workplace',
        component: () => import('@/components/Workplace'),
        meta: { title: '工作区' },
      }
    ]
  }
]
