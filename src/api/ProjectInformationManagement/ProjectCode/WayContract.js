import axios from '@/utils/request'
import qs from 'qs'

/**
 * 添加承揽方式
 */
export const insertEngineeringUndertake = (data) => {
  return axios({
    url: '/web/epc/engineering/undertake',
    method: 'post',
    data:data
  })
}
/**
 * 修改承揽方式
 */
export const updateEngineeringUndertake = (data) => {
  return axios({
    url: '/web/epc/engineering/undertake',
    data:data,
    method: 'put',
  })
}
/**
 * 批量删除承揽方式
 */
export const batchDeleteEngineeringUndertake = (data) => {
  return axios({
    url: '/web/epc/engineering/undertake/batchDelete',
    method: 'post',
    data:data
  })
}
/**
 * 查询承揽方式字典列表(全量)
 */
export const queryEngineeringUndertakeList = () => {
  return axios({
    url: '/web/epc/engineering/undertake/getDictList',
    method: 'get',
  })
}
/**
 * 查询承揽方式分页列表(分页)
 */
export const queryEngineeringUndertakePage = (data) => {
  return axios({
    url: '/web/epc/engineering/undertake/getPageList?'+qs.stringify(data),
    method: 'get',
  })
}
/**
 * 删除承揽方式根据id
 */
export const deleteEngineeringUndertakeByid = (data) => {
  return axios({
    url: '/web/epc/engineering/undertake/'+data.id,
    method: 'delete',
  })
}
