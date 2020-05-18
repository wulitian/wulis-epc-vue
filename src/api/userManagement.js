import axios from '@/utils/request'
import qs from 'qs'

/**
 * 用户查询
 */
export const select = (data) => {
  return axios({
    url: '/web/personnel/user/info/queryUserPage?'+qs.stringify(data),
    method: 'get',
  })
}

