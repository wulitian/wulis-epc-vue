import {getNav} from "@/api/login";
import store from '@/store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// 根级菜单
const rootRouter = {
  name: 'main',
  path: '/',
  component: 'components/BlankLayout',
  redirect: '/main',
  meta: {
    title: '首页'
  },
  children: []
}
/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    getNav().then(res => {
        const { data } = res
        let newDataAll = []
        for (let i = 0; i < data.length; i++) {
          if(data[i].menuType==0){
            let newData = {}
            newData.name = data[i].componentName;
            newData.path = data[i].route;
            newData.redirect = data[i].redirect;
            newData.parentId = data[i].parentId;
            newData.id = data[i].id;
            newData.component = data[i].component;
            newData.show = data[i].enable;
            var meta = {};
            meta.title = data[i].menuName;
            meta.target = data[i].target;
            meta.icon = data[i].icon
            meta.show = data[i].enable == '0'?false:true;
            meta.hideChildren = data[i].enable == '0'?false:true;
            meta.hiddenHeaderContent = data[i].hiddenHeaderContent == '0'?false:true;
            meta.keepAlive = data[i].keepAlive == '0'?false:true;
            newData.meta = meta;
            newDataAll.push(newData)
          }
        }
        const menuNav = []
        const childrenNav = []
        // 后端数据, 根级树数组,  根级 PID
        listToTree(newDataAll, childrenNav, "0");
        rootRouter.children = childrenNav
        menuNav.push(rootRouter)
        const routers = generator(menuNav)
        let routerAll = {}
        routerAll.routers = routers;
        routerAll.routerList = newDataAll;
        resolve(routerAll)
    }).catch(err => {
      // Vue.ls.remove(ACCESS_TOKEN)
      // this.$router.push("/login")
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
      reject(err)
    })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, show, hideChildren, hiddenHeaderContent, target, icon ,keepAlive} = item.meta || {}
    const currentRouter = {
      path: item.path ,
      name: item.name || '',
      component:()=> import(`@/${item.component}`),
      meta: { title: title, icon: icon || undefined, hiddenHeaderContent: hiddenHeaderContent, target: target, permission: item.name ,keepAlive: keepAlive}
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {

  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
