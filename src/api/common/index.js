import service from '@/utils/request'
import { Message } from 'element-ui'
import { basicToken } from '@/settings'
import { tansParams } from '@/utils/request-util'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function getImage(url, params) {
  return service({
    url: url,
    method: 'get',
    params,
    responseType: 'arraybuffer'
  })
}

export function refresh(url, params) {
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
}

export function login(url, params) {
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
}
export function post(url, params) {
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
}

export function put(url, params) {
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
}

export function get(url, params) {
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
}

export function del(url, params) {
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
}
export function download(url, params, filename) {
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
        duration: 5 * 1000
      })
    })
}

export function upload(url, params) {
  return service.post(url, params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const request = {
  post,
  get,
  put,
  del,
  download,
  upload,
  login,
  getImage
}

export default request
