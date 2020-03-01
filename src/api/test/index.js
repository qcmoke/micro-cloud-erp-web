import request from '@/utils/request2'
import qs from 'qs'

// eslint-disable-next-line no-unused-vars
function tansParams(params) {
  let result = ''
  Object.keys(params).forEach((key) => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result
}

/**
  *  get请求没有Content-Type，使用url地址参数的方式
  */
// get不支持设置body，这种方式不行
export function jsonBodyGetApi(data) {
  return request({
    url: '/ums/test/urlGetApi',
    method: 'get',
    data
  })
}

export function urlGetApi(data) {
  return request({
    url: '/ums/test/urlGetApi',
    method: 'get',
    params: data
  })
}

// key为data,值为data的json格式
export function jsonGetApi(data) {
  return request({
    url: '/ums/test/urlGetApi',
    method: 'get',
    params: { data }
  })
}

/**
 * post请求
 *
 * post请求常见的数据格式（content-type）
 *    Content-Type: application/json ： 请求体中的数据会以json字符串的形式发送到后端
 *    Content-Type: application/x-www-form-urlencoded：请求体中的数据会以普通表单形式（键值对）发送到后端
 *    Content-Type: multipart/form-data： 它会将请求体的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，也可以上传文件。
 *
 *
 * jQuery.ajax的post提交默认的请求头的Content-Type: application/x-www-form-urlencoded,
 * 而axios.post提交的请求头是Content-Type: application/json
 *
 *
 */

// post使用Content-Type: application/json形式的传参（默认）
export function jsonPostAPi(data) {
  return request({
    url: '/ums/test/jsonPostAPi',
    method: 'post',
    data
  })
}

// post使用url地址参数形式的传参（k1=v1&k2=v2的形式存在url地址上）
export function urlPostApi(data) {
  return request({
    url: '/ums/test/urlPostApi',
    method: 'post',
    params: data
  })
}

// post使用Content-Type: application/x-www-form-urlencoded形式的传参（可以将请求参数转化为k1=v1&k2=v2的形式，但又不会存在url上，比较友好）
export function formPostApi(data) {
  return request({
    url: '/ums/test/formPostApi',
    method: 'post',
    data: qs.stringify(data), // 使用qs库或者使用自己定义转化方法tansParams(data)
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
/*
Qs
  axios 自带qs,不需要额外安装，如果没有，通过命令npm install qs进行安装
  qs.stringify()是将对象 序列化成URL的形式
  qs.parse()是将URL解析成对象的形式

注意qs和JSON的stringify的区别
  var a = {name:'hehe',age:10};
  qs.stringify(a)  // 得到'name=hehe&age=10'
  JSON.stringify(a) // 得到'{"name":"hehe","age":10}'

*/

// post使用Content-Type: multipart/form-data形式的传参
export function formDataPostApi(formData) {
  return request({
    url: '/ums/test/formDataPostApi',
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

