import request from '@/utils/request'
import { basicToken, loginApiUrl, socialLoginUrl } from '@/settings'
import qs from 'qs'

export function getImageApi(randomId) {
  return request({
    url: `/auth/resource/captcha?key=${randomId}`,
    method: 'get',
    responseType: 'arraybuffer'
  })
}

export function loginApi(params) {
  params['grant_type'] = 'password'
  return request({
    url: loginApiUrl,
    method: 'post',
    data: qs.stringify(params),
    headers: {
      Authorization: basicToken
    }
  })
}

export function getUserDetailInfoApi() {
  return request({
    url: '/auth/resource/user/detail',
    method: 'get'
  })
}

export function signLoginApi(params) {
  return request({
    url: '/auth/resource/social/sign/login',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function bindLoginApi(params) {
  return request({
    url: '/auth/resource/social/bind/login',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function socialLoginApi(oauthType, resolveSocialLogin) {
  const page = {
    width: window.screen.width * 0.5,
    height: window.screen.height * 0.5
  }
  window.open(
    `${socialLoginUrl}/${oauthType}/login`,
    'newWindow',
    `resizable=yes, height=${page.height}, width=${page.width}, top=10%, left=10%, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no`
  )
  window.addEventListener('message', resolveSocialLogin, false)
}
