import axios from '@/utils/request'
import qs from 'qs'

/**
 * 添加工程用途
 */
export const insertEngineeringUse = (data) => {
  return axios({
    url: '/web/epc/engineering/use',
    method: 'post',
    data:data
  })
}
/**
 * 修改工程用途
 */
export const updateEngineeringUse = (data) => {
  return axios({
    url: '/web/epc/engineering/use',
    data:data,
    method: 'put',
  })
}
/**
 * 批量删除工程用途
 */
export const batchDeleteEngineeringUse = (data) => {
  return axios({
    url: '/web/epc/engineering/use/batchDelete',
    method: 'post',
    data:data
  })
}
/**
 * 查询工程用途字典列表(全量)
 */
export const queryEngineeringUseList = () => {
  return axios({
    url: '/web/epc/engineering/use/getDictList',
    method: 'get',
  })
}
/**
 * 查询工程用途分页列表(分页)
 */
export const queryEngineeringUsePage = (data) => {
  return axios({
    url: '/web/epc/engineering/use/getPageList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 删除工程用途根据id
 */
export const deleteEngineeringUseByid = (data) => {
  return axios({
    url: '/web/epc/engineering/use/'+data.id,
    method: 'delete',
  })
}
