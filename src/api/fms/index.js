import request from '@/utils/request'
export function statisticsApi(year) {
  return request.get(`/fms/bill/statistics/${year}`)
}

/**
 * 财务账单
 */
export function pageBillApi(params) {
  return request.get('/fms/bill/page', {
    params: params
  })
}

/**
 * 账户管理
 */
export function pageAccountApi(params) {
  return request.get('/fms/account/page', {
    params: params
  })
}

export function batchDeleteAccountApi(ids) {
  return request({
    url: `/fms/account/${ids}`,
    method: 'delete'
  })
}

export function saveOrUpdateAccountApi(params) {
  return request({
    url: '/fms/account/saveOrUpdate',
    method: 'post',
    data: params
  })
}
