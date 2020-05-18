const getters = {
  getUserName: state => state.user.username,
  addRouters: state => state.permission.addRouters,
  routeState: state => state.permission.routeState,
}

export default getters
