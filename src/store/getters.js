const getters = {
  getUserName: state => state.user.username,
  addRouters: state => state.permission.addRouters,
  routerList: state => state.permission.routerList,
  routeState: state => state.permission.routeState,
}

export default getters
