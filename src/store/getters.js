const getters = {
  getUserName: state => state.user.username,
  addRouters: state => state.permission.addRouters,
  routerList: state => state.permission.routerList,
  permissionMarkList: state => state.permission.permissionMarkList,
  routeState: state => state.permission.routeState,
}

export default getters
