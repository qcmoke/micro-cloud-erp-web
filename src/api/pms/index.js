import request from '@/utils/request'
import qs from 'qs'

export function pageApi(params) {
  return request.get('/pms/material', {
    params: params
  })
}

export function addApi(params) {
  return request({
    url: '/pms/material',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function deleteApi(ids) {
  return request({
    url: `/pms/material/${ids}`,
    method: 'delete'
  })
}

export function updateApi(params) {
  return request({
    url: '/pms/material',
    method: 'put',
    data: qs.stringify(params)
  })
}
