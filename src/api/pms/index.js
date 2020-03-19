import request from '@/utils/request'
import qs from 'qs'

export function pageMaterialApi(params) {
  return request.get('/pms/material', {
    params: params
  })
}

export function getAllMaterialsApi() {
  return request.get('/pms/material/getAll')
}

export function addeMaterialApi(params) {
  return request({
    url: '/pms/material',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function batchDeleteMaterialApi(ids) {
  return request({
    url: `/pms/material/${ids}`,
    method: 'delete'
  })
}

export function updateMaterialApi(params) {
  return request({
    url: '/pms/material',
    method: 'put',
    data: qs.stringify(params)
  })
}

export function pagePurchaseOrderMasterApi(params) {
  return request.get('/pms/purchaseOrderMaster', {
    params: params
  })
}

export function pagePurchaseOrderMasterForAddStockApi(params) {
  return request.get('/pms/purchaseOrderMaster/pageForAddStock', {
    params: params
  })
}

export function createOrUpdatePurchaseOrderApi(params) {
  return request({
    url: '/pms/purchaseOrderMaster/createOrUpdatePurchaseOrder',
    method: 'post',
    data: params
  })
}

export function batchDeletePurchaseOrderMasterApi(ids) {
  console.log(ids)

  return request({
    url: `/pms/purchaseOrderMaster/${ids}`,
    method: 'delete'
  })
}

export function updatePurchaseOrderMasterApi(params) {
  return request({
    url: '/pms/purchaseOrderMaster/updateStatus',
    method: 'put',
    data: qs.stringify(params)
  })
}

export function transferToStockApi(masterId) {
  return request({
    url: `/pms/purchaseOrderMaster/transferToStock/${masterId}`,
    method: 'put'
  })
}

export function getAllSuppliersApi() {
  return request({
    url: '/pms/supplier/list',
    method: 'get'
  })
}

/** 供应商管理 */
export function pageSupplierApi(params) {
  return request.get('/pms/supplier', {
    params: params
  })
}

export function batchDeleteSupplierApi(ids) {
  return request({
    url: `/pms/supplier/${ids}`,
    method: 'delete'
  })
}

export function addeSupplierApi(params) {
  return request({
    url: '/pms/supplier',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function updateSupplierApi(params) {
  return request({
    url: '/pms/supplier',
    method: 'put',
    data: qs.stringify(params)
  })
}

/** 退单管理 */
export function createRefuseApi(params) {
  return request({
    url: '/pms/materialRefund',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function pageMaterialRefundApi(params) {
  return request.get('/pms/materialRefund', {
    params: params
  })
}

export function toShipApi(params) {
  return request({
    url: '/pms/materialRefund/toShip',
    method: 'put',
    params
  })
}
export function checkPassApi(params) {
  return request({
    url: '/pms/materialRefund/checkPass',
    method: 'put',
    params
  })
}
export function checkFailApi(params) {
  return request({
    url: '/pms/materialRefund/checkFail',
    method: 'put',
    params
  })
}
