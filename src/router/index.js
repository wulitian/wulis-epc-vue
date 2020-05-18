import Vue from 'vue'
import Router from 'vue-router'
import { baseRouterMap } from '@/config/baseRouterSettings'
/*默认路由设置
routes: [
{
    path: string, //路径
    ccomponent: Component; //页面组件
    name: string; // 命名路由-路由名称
    components: { [name: string]: Component }; // 命名视图组件
    redirect: string | Location | Function; // 重定向
    props: boolean | string | Function; // 路由组件传递参数
    alias: string | Array<string>; // 路由别名
    children: Array<RouteConfig>; // 嵌套子路由
    beforeEnter?: (to: Route, from: Route, next: Function) => void; // 路由单独钩子
    meta: any; // 自定义标签属性，比如：是否需要登录
    icon: any; // 图标
    // 2.6.0+
    caseSensitive: boolean; // 匹配规则是否大小写敏感？(默认值：false)
    pathToRegexpOptions: Object; // 编译正则的选项
}
base
  打包路径，默认为/，可以修改
  应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"。
mode
  hash: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器。
  history: 依赖 HTML5 History API 和服务器配置。查看 HTML5 History 模式。
  abstract: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。
scrollBehavior
  页面滚动位置{ y: 0 }滚到顶部
*/
// hack router push callback(防止路由跳转相同路有报错)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)
export default new Router({
  routes: baseRouterMap,
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  base: '/'
})
