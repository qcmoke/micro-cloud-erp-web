import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { basicToken, loginApi } from '@/settings'
import store from '@/store/index'
import router from '@/router'
import { getToken, getRefreshToken, getExpireTime } from '@/utils/auth'

// 请求超时时间，10s
const requestTimeOut = 10 * 1000
const success = 200
// 更换令牌的时间区间
const checkRegion = 5 * 60 * 1000
// 提示信息显示时长
const messageDuration = 5 * 1000

// 系统全局请求对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: requestTimeOut,
  responseType: 'json',
  validateStatus(status) {
    return status === success
  }
})

// 系统令牌刷新请求对象
const refreshService = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: requestTimeOut,
  responseType: 'json',
  validateStatus(status) {
    return status === success
  }
})

service.interceptors.request.use(
  config => {
    let _config = config

    // 防止认证服务器请求成功，但是资源服务器宕机了，导致再登录时token变成了acceesToken而不是BasicToken,从而弹出spring security认证弹框
    if (_config.url === loginApi) {
      _config.headers['Authorization'] = basicToken
      return _config
    }

    try {
      const expireTime = getExpireTime()
      if (expireTime) {
        const left = expireTime - new Date().getTime()
        const refreshToken = getRefreshToken()
        if (left < checkRegion && refreshToken) {
          _config = queryRefreshToken(_config, refreshToken)
        } else {
          const accessToken = getToken()
          if (accessToken) {
            _config.headers['Authorization'] = 'bearer ' + accessToken
          }
        }
      }
    } catch (e) {
      console.error(e)
    }
    return _config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use((config) => {
  return config
}, (error) => {
  if (error.response) {
    const errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
    switch (error.response.status) {
      case 404:
        Message({
          message: '很抱歉，资源未找到',
          type: 'error',
          duration: messageDuration
        })
        break
      case 403:
        Message({
          message: '很抱歉，您暂无该操作权限',
          type: 'error',
          duration: messageDuration
        })
        break
      case 401:
        Message({
          message: '很抱歉，认证已失效，请重新登录',
          type: 'error',
          duration: messageDuration
        })
        break
      default:
        if (errorMessage === 'refresh token无效') {
          MessageBox.alert('登录已过期，请重新登录', '温馨提示', {
            confirmButtonText: '确定',
            showClose: false,
            callback: action => {
              router.push('/login')
            }
          })
        } else {
          Message({
            message: errorMessage,
            type: 'error',
            duration: messageDuration
          })
        }
        break
    }
  }
  return Promise.reject(error)
})

async function queryRefreshToken(config, refreshToken) {
  const result = await refresh(loginApi, {
    refresh_token: refreshToken
  })
  if (result.status === success) {
    const data = result.data
    store.commit('account/setAccessToken', data.access_token)
    store.commit('account/setRefreshToken', data.refresh_token)
    const current = new Date()
    const expireTime = current.setTime(current.getTime() + 1000 * data.expires_in)
    store.commit('account/setExpireTime', expireTime)
    config.headers['Authorization'] = 'bearer ' + getToken()
  }
  return config
}

function refresh(url, params) {
  params['grant_type'] = 'refresh_token'
  return refreshService.post(url, params, {
    transformRequest: [(params) => {
      return tansParams(params)
    }],
    headers: {
      'Authorization': basicToken
    }
  })
}

function tansParams(params) {
  let result = ''
  Object.keys(params).forEach((key) => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result
}

export default service
