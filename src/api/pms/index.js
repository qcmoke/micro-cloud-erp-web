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

export function addMaterialToStockApi(masterId) {
  return request({
    url: `/pms/purchaseOrderMaster/addMaterialToStock/${masterId}`,
    method: 'put'
  })
}

export function getAllSuppliersApi() {
  return request({
    url: '/pms/supplier/list',
    method: 'get'
  })
}
