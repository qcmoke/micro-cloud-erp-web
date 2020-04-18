module.exports = {
  title: 'MC-ERP',
  // Spring Boot Admin控制台地址
  springBootAdminUrl: 'http://129.204.185.161:9080',
  // zipkin 控制台地址
  zipkinUrl: 'http://39.106.195.202:9411',
  // 获取令牌时，请求头信息(Basic Base64.encode(client_id:client_secret))
  basicToken: 'Basic d2ViQXBwOjEyMzQ1Ng==',
  // 社交登录后台地址
  socialLoginUrl: 'http://localhost:9070/auth/resource/social/render',
  // 认证api路径
  loginApiUrl: '/auth/oauth/token'
}
