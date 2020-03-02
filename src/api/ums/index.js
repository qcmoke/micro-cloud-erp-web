import request from '@/utils/request'
import qs from 'qs'

export function getCurrentUserRoutersApi() {
  return request({
    url: '/ums/menu/getCurrentUserRouters',
    method: 'get'
  })
}

export function loginSuccessCallbackApi() {
  return request({
    url: '/ums/user/success',
    method: 'get'
  })
}

export function modifyProfileApi(params) {
  return request({
    url: '/ums/user/profile',
    method: 'put',
    data: qs.stringify(params, { skipNulls: true })
  })
}

export function getDeptListApi() {
  return request({
    url: '/ums/dept',
    method: 'get'
  })
}

export function modifyAvatarApi(params) {
  return request({
    url: '/ums/user/avatar',
    method: 'put',
    data: qs.stringify(params)
  })
}

export function checkOldPasswordApi(params) {
  return request({
    url: '/system/user/password/check',
    method: 'get',
    params
  })
}

export function modifyPasswordApi(params) {
  return request({
    url: '/ums/user/password',
    method: 'put',
    data: qs.stringify(params)
  })
}

export function getloginLogForMeApi() {
  return request({
    url: '/ums/log/login/me',
    method: 'get'
  })
}
