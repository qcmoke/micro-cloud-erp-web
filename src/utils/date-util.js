/**
 * 剩余毫秒
 * @param {Number} timeDate 时间戳
 */
export function getMillisecond(timeDate) {
  return parseInt(timeDate - new Date().getTime())
}

/**
 * 剩余秒
 * @param {Number} timeDate 时间戳
 */
export function getSecond(timeDate) {
  return parseInt((timeDate - new Date().getTime()) / 1000)
}

/**
 * 剩余分
 * @param {Number} timeDate 时间戳
 */
export function getLeftMin(timeDate) {
  return parseInt((timeDate - new Date().getTime()) / (1000 * 60))
}
