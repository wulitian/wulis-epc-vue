import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除菜单(根据id)
 */
export const deleteMenuByid = (data) => {
  return axios({
    url: '/web/permission/menu/deleteMenu',
    method: 'delete',
    data:data
  })
}
/**
 * 新增菜单
 */
export const insertMenu = (data) => {
  return axios({
    url: '/web/permission/menu/insertMenu',
    method: 'post',
    data:data
  })
}
/**
 * 查询菜单(通过id)
 */
export const queryMenuByid = (data) => {
  return axios({
    url: '/web/permission/menu/queryMenu?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询菜单列表(树形)
 */
export const queryMenuTree = (data) => {
  return axios({
    url: '/web/permission/menu/queryMenuTree?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 根据角色id查询当前选中按钮id集合
 */
export const getMenuIdsByRoleId = (data) => {
  return axios({
    url: '/web/permission/menu/getMenuIdsByRoleId/'+data.id,
    method: 'get',
  })
}
/**
 * 修改菜单
 */
export const updateMenu = (data) => {
  return axios({
    url: '/web/permission/menu/updateMenu',
    data:data,
    method: 'put',
  })
}
