import request from '@/utils/request'
// eslint-disable-next-line no-unused-vars
import qs from 'qs'

/**
 * 销售管理
 */
export function pageSaleOrderMasterApi(params) {
  return request.get('/oms/saleOrderMaster/page', {
    params: params
  })
}

export function getallCustomersApi() {
  return request({
    url: '/oms/customer/list',
    method: 'get'
  })
}

export function getallProductsApi() {
  return request({
    url: '/oms/product/list',
    method: 'get'
  })
}

export function createOrUpdateSaleOrderApi(params) {
  return request({
    url: '/oms/saleOrderMaster/createOrUpdateSaleOrder',
    method: 'post',
    data: params
  })
}

export function applyForDeliveryApi(params) {
  return request({
    url: `/oms/saleOrderMaster/applyForDeliver`,
    method: 'put',
    data: params
  })
}

export function batchDeleteSaleOrderMasterApi(ids) {
  return request({
    url: `/oms/saleOrderMaster/${ids}`,
    method: 'delete'
  })
}

export function updateUserDeliveryApi(params) {
  return request({
    url: '/oms/saleOrderMaster/updateUserDelivery',
    method: 'put',
    data: params
  })
}

/**
 * 产品管理
 */
export function pageProductApi(params) {
  return request.get('/oms/product', {
    params: params
  })
}

export function batchDeleteProductApi(ids) {
  return request({
    url: `/oms/product/${ids}`,
    method: 'delete'
  })
}

export function addProductApi(params) {
  return request({
    url: '/oms/product',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function updateProductApi(params) {
  return request({
    url: '/oms/product',
    method: 'put',
    data: qs.stringify(params)
  })
}

/**
 * 客户管理
 */
export function pageCustomerApi(params) {
  return request.get('/oms/customer', {
    params: params
  })
}

export function batchDeleteCustomerApi(ids) {
  return request({
    url: `/oms/customer/${ids}`,
    method: 'delete'
  })
}

export function addCustomerApi(params) {
  return request({
    url: '/oms/customer',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function updateCustomerApi(params) {
  return request({
    url: '/oms/customer',
    method: 'put',
    data: qs.stringify(params)
  })
}

/**
 * 退单管理
 */
export function pageSaleRefundApi(params) {
  return request.get('/oms/saleRefund', {
    params: params
  })
}

export function batchDeleteSaleRefundApi(ids) {
  return request({
    url: `/oms/saleRefund/${ids}`,
    method: 'delete'
  })
}

export function addSaleRefundApi(params) {
  return request({
    url: '/oms/saleRefund',
    method: 'post',
    data: params
  })
}

export function updateSaleRefundApi(params) {
  return request({
    url: '/oms/saleRefund',
    method: 'put',
    data: qs.stringify(params)
  })
}
