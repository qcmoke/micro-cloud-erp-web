import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { basicToken, loginApi } from '@/settings'
import store from '@/store/index'
import router from '@/router'
import { getToken, getRefreshToken, getExpireTime } from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 请求超时时间，10s
const requestTimeOut = 10 * 1000
const success = 200
// 更换令牌的时间区间
const checkRegion = 5 * 60 * 1000
// 提示信息显示时长
const messageDuration = 5 * 1000

// 触发弹框开关，防止重复触发弹框
let flag = true

// 系统全局请求对象
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: requestTimeOut,
  responseType: 'json', // 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json'(默认), 'text', 'stream'
  validateStatus(status) {
    return status === success
  }
})

// // 获取Arraybuffer的请求对象
const arraybufferService = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: requestTimeOut,
  responseType: 'arraybuffer',
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
                console.log('重置flag')
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

const request = {
  getImage(url, params) {
    return arraybufferService({
      url: url,
      method: 'get',
      params
    })
  },
  getImage2(url, params) {
    return arraybufferService.get(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ]
    })
  },
  refresh(url, params) {
    params['grant_type'] = 'refresh_token'
    return service.post(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        Authorization: basicToken
      }
    })
  },
  login(url, params) {
    params['grant_type'] = 'password'
    return service.post(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        Authorization: basicToken
      }
    })
  },
  post(url, params) {
    return service.post(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  put(url, params) {
    return service.put(url, params, {
      transformRequest: [
        params => {
          return tansParams(params)
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  get(url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.get(`${url}${_params}`)
  },
  delete(url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.delete(`${url}${_params}`)
  },
  download(url, params, filename) {
    NProgress.start()
    return service
      .post(url, params, {
        transformRequest: [
          params => {
            return tansParams(params)
          }
        ],
        responseType: 'blob'
      })
      .then(r => {
        const content = r.data
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a')
          elink.download = filename
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, filename)
        }
        NProgress.done()
      })
      .catch(r => {
        console.error(r)
        NProgress.done()
        Message({
          message: '下载失败',
          type: 'error',
          duration: messageDuration
        })
      })
  },
  upload(url, params) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

function tansParams(params) {
  let result = ''
  Object.keys(params).forEach(key => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result +=
        encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result
}

async function queryRefreshToken(config, refreshToken) {
  const result = await request.refresh(loginApi, {
    refresh_token: refreshToken
  })
  if (result.status === success) {
    saveData(result.data)
    config.headers['Authorization'] = 'bearer ' + getToken()
  }
  return config
}

function saveData(data) {
  store.commit('account/setAccessToken', data.access_token)
  store.commit('account/setRefreshToken', data.refresh_token)
  const current = new Date()
  const expireTime = current.setTime(
    current.getTime() + 1000 * data.expires_in
  )
  store.commit('account/setExpireTime', expireTime)
}

export default request
