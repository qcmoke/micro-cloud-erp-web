import request from '@/utils/request'
import qs from 'qs'

export function pageMaterialApi(params) {
  return request.get('/pms/material', {
    params: params
  })
}

export function getAllMaterialsBySupplierIdApi(supplierId) {
  return request.get(`/pms/material/getAll/${supplierId}`)
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
  return request({
    url: `/pms/purchaseOrderMaster/${ids}`,
    method: 'delete'
  })
}

export function toApplyCheckPurchaseOrderMasterApi(masterId) {
  return request({
    url: `/pms/purchaseOrderMaster/toApplyCheck/${masterId}`,
    method: 'put'
  })
}

export function checkFailPurchaseOrderMasterApi(masterId) {
  return request({
    url: `/pms/purchaseOrderMaster/checkFail/${masterId}`,
    method: 'put'
  })
}

export function checkPassPurchaseOrderMasterApi(masterId) {
  return request({
    url: `/pms/purchaseOrderMaster/checkPass/${masterId}`,
    method: 'put'
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

export function saveOrUpdateSupplierApi(params) {
  return request({
    url: '/pms/supplier/saveOrUpdate',
    method: 'post',
    data: params
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

export function batchDeleteMaterialRefundApi(ids) {
  return request({
    url: `/pms/materialRefund/${ids}`,
    method: 'delete'
  })
}
