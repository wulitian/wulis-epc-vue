//基础路由
export const baseRouterMap = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login'),
  },
  {
    path: '/Exception404',
    name: 'Exception404',
    component: () => import('@/components/404'),
    meta: { title: '404'}
  },
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
