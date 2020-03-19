import request from '@/utils/request'
import qs from 'qs'

export function pageApi(params) {
  return request.get('/wms/stockItem/page', {
    params: params
  })
}

export function checkPassApi(params) {
  return request({
    url: '/wms/stockItem/checkPass',
    method: 'put',
    params
  })
}
export function checkFailApi(params) {
  return request({
    url: '/wms/stockItem/checkFail',
    method: 'put',
    params
  })
}

export function addItemToStockApi(arr) {
  return request({
    url: `/wms/materialStock/addItemToStock/${arr.join()}`,
    method: 'put'
  })
}

/**
 * 库存
 */

export function pageStockApi(params) {
  return request.get('/wms/stock/page', {
    params: params
  })
}

export function updateStockApi(params) {
  return request({
    url: '/wms/stock',
    method: 'put',
    data: qs.stringify(params)
  })
}
