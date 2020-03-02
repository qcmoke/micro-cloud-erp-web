import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { basicToken, loginApiUrl } from '@/settings'
import store from '@/store/index'
import router from '@/router'
import { getToken, getRefreshToken, getExpireTime } from '@/utils/auth'
import { tansParams } from '@/utils/request-util'
import { getMin, getMillisecond } from '@/utils/date-util'

// 请求超时时间，10s
const requestTimeOut = 10 * 1000
const success = 200
// 更换令牌的时间区间，剩余300000毫秒->300秒->5分钟的时候刷新令牌
const checkRegion = 5 * 60 * 1000
// 提示信息显示时长
const messageDuration = 5 * 1000

// 触发弹框开关，防止重复触发弹框
let flag = true

// 系统全局请求对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: requestTimeOut,
  responseType: 'json', // 这里默认值也设置为axios的默认值，表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json'(axios的默认值), 'text', 'stream'
  validateStatus(status) {
    return status === success
  }
})

service.interceptors.request.use(
  config => {
    let _config = config

    // 防止认证服务器请求成功，但是资源服务器宕机了，导致再登录时token变成了acceesToken而不是BasicToken,从而弹出spring security认证弹框
    if (_config.url === loginApiUrl) {
      _config.headers['Authorization'] = basicToken
      return _config
    }

    try {
      const expireTime = getExpireTime()
      if (expireTime) {
        const left = getMillisecond(expireTime)
        console.log('token距离过期时间还剩 min = ' + getMin(expireTime))
        const refreshToken = getRefreshToken()
        if (left < checkRegion && refreshToken) {
          console.log(
            '刷新令牌... token距离过期时间还剩 min: ' + getMin(expireTime)
          )
          _config = queryRefreshToken(_config, refreshToken)
          console.log('完成令牌刷新')
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
service.interceptors.response.use(
  config => {
    return config
  },
  error => {
    const response = error.response
    if (response) {
      const data = response.data
      const status = response.status
      const errorMessage =
        data === null
          ? '系统内部异常，请联系网站管理员'
          : data.message
            ? data.message
            : data.error_description
      switch (status) {
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
          // 触发弹框开关，防止重复触发弹框
          if (flag) {
            // 设置flag为false，防止其他响应重复触发弹框
            flag = false
            MessageBox.alert('登录已过期，请重新登录', '温馨提示', {
              confirmButtonText: '确定',
              showClose: false,
              callback: action => {
                router.push('/login')
                // 重置flag
                flag = true
              }
            })
          }
          break
        default:
          console.log(errorMessage)
          Message({
            message: errorMessage,
            type: 'error',
            duration: messageDuration
          })
          break
      }
    }
    return Promise.reject(error)
  }
)

async function queryRefreshToken(config, refreshToken) {
  const result = await service.post(
    loginApiUrl,
    {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        Authorization: basicToken
      }
    }
  )
  if (result.status === success) {
    const data = result.data
    store.commit('account/setAccessToken', data.access_token)
    store.commit('account/setRefreshToken', data.refresh_token)
    const current = new Date()
    const expireTime = current.setTime(
      current.getTime() + 1000 * data.expires_in
    )
    store.commit('account/setExpireTime', expireTime)
    config.headers['Authorization'] = 'bearer ' + getToken()
  }
  return config
}

export default service
