import axios from '@/utils/request'
import qs from 'qs'

/**
 * 新增方案/项目
 */
export const insertFaxm = (data) => {
  return axios({
    url: '/web/epc/project/manage',
    method: 'post',
    data:data
  })
}
/**
 * 修改方案/项目
 */
export const updateFaxm = (data) => {
  return axios({
    url: '/web/epc/project/manage',
    data:data,
    method: 'put',
  })
}
/**
 * 根据工程id查询项目拆分树
 */
export const queryFaxmByGcid = (data) => {
  return axios({
    url: '/web/epc/project/manage/getTree/'+data.id,
    method: 'get',
  })
}

/**
 * 删除方案/项目根据id
 */
export const deleteFaxmByid = (data) => {
  return axios({
    url: '/web/epc/project/manage/'+data.id,
    method: 'delete',
  })
}
/**
 * 根据工程id查询可用项目列表
 */
export const queryFaxmList = () => {
  return axios({
    url: '/web/epc/project/manage/getList',
    method: 'get',
  })
}
