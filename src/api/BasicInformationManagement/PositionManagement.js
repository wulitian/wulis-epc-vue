import axios from '@/utils/request'
import qs from 'qs'

/**
 * 删除职位信息(根据id)
 */
export const deletePositionById = (data) => {
  return axios({
    url: '/web/bim/position/deletePosition',
    method: 'delete',
    data:data
  })
}
/**
 * 新增职位信息
 */
export const insertPosition = (data) => {
  return axios({
    url: '/web/bim/position/insertPosition',
    method: 'post',
    data:data
  })
}
/**
 * 查询职位信息(通过id)
 */
export const queryPositionByid = (data) => {
  return axios({
    url: '/web/bim/position/queryPosition?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 查询职位信息列表(全量)
 */
export const queryPositionList = () => {
  return axios({
    url: '/web/bim/position/queryPositionList',
    method: 'get',
  })
}
/**
 * 查询职位信息列表(分页)
 */
export const queryPositionPage = (data) => {
  return axios({
    url: '/web/bim/position/queryPositionPage?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 修改职位信息
 */
export const updatePosition = (data) => {
  return axios({
    url: '/web/bim/position/updatePosition',
    data:data,
    method: 'put',
  })
}
