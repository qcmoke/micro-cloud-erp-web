<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="rules"
      class="login-form"
      autocomplete="off"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ $t("login.title") }}
        </h3>
        <lang-select class="set-language" />
      </div>
      <span v-if="login.type === 'up'">
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            prefix-icon="el-icon-user"
            name="username"
            type="text"
            autocomplete="off"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            prefix-icon="el-icon-key"
            type="password"
            :placeholder="$t('login.password')"
            name="password"
            autocomplete="off"
            :show-password="true"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="code" class="code-input">
          <el-input
            ref="code"
            v-model="loginForm.code"
            prefix-icon="el-icon-lock"
            :placeholder="$t('login.code')"
            name="code"
            type="text"
            autocomplete="off"
            style="width: 70%"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <img
          :src="imageCode"
          alt="codeImage"
          class="code-image"
          @click="getCodeImage"
        >
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;margin-bottom:14px;"
          @click.native.prevent="handleLogin"
        >
          {{ $t("login.logIn") }}
        </el-button>
      </span>
      <span v-if="login.type === 'social'">
        {{ $t("login.chooseToSignIn") }}
        <div>
          <template v-for="(l, index) in logo">
            <div :key="index" class="logo-wrapper">
              <img
                :src="resolveLogo(l.img)"
                alt=""
                :class="{ radius: l.radius }"
                @click="socialLogin(l.name)"
              >
            </div>
          </template>
        </div>
      </span>
      <span v-if="login.type === 'bind'" style="margin-top: -1rem">
        <el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('common.bindLogin')" name="bindLogin">
            <el-form-item prop="bindUsername">
              <el-input
                ref="bindUsername"
                v-model="loginForm.bindUsername"
                :placeholder="$t('login.username')"
                prefix-icon="el-icon-user"
                name="bindUsername"
                type="text"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item prop="bindPassword">
              <el-input
                ref="bindPassword"
                v-model="loginForm.bindPassword"
                :placeholder="$t('login.password')"
                prefix-icon="el-icon-key"
                name="bindPassword"
                type="password"
                :show-password="true"
                autocomplete="off"
              />
            </el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;margin-bottom:14px;"
              @click.native.prevent="bindLogin"
            >
              {{ $t("common.bindLogin") }}
            </el-button>
          </el-tab-pane>
          <el-tab-pane :label="$t('common.signLogin')" name="signLogin">
            <el-form-item prop="signUsername">
              <el-input
                ref="signUsername"
                v-model="loginForm.signUsername"
                :placeholder="$t('login.username')"
                prefix-icon="el-icon-user"
                name="signUsername"
                type="text"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item prop="signPassword">
              <el-input
                ref="signPassword"
                v-model="loginForm.signPassword"
                :placeholder="$t('login.password')"
                prefix-icon="el-icon-key"
                name="signPassword"
                type="password"
                :show-password="true"
                autocomplete="off"
              />
            </el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;margin-bottom:14px;"
              @click.native.prevent="signLogin"
            >
              {{ $t("common.signLogin") }}
            </el-button>
          </el-tab-pane>
        </el-tabs>
      </span>
      <el-dropdown class="login-type" placement="top-end">
        <span class="el-dropdown-link">
          <el-link type="primary">{{ $t("login.ortherLoginType") }}</el-link>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :disabled="login.type === 'up'"
            @click.native="login.type = 'up'"
          >{{ $t("login.type.up") }}</el-dropdown-item>
          <el-dropdown-item
            :disabled="login.type === 'social'"
            @click.native="login.type = 'social'"
          >{{ $t("login.type.social") }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form>
    <span class="login-footer">
      © 2020 &nbsp; <a target="_blank" href="https://www.qcmoke.site">Qcmoke</a>
    </span>
  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect'
import db from '@/utils/localstorage'
import { randomNum, getBase64Image } from '@/utils'
import { socialLoginUrl } from '@/settings'

import { loginSuccessCallbackApi } from '@/api/ums'
import {
  loginApi,
  getUserDetailInfoApi,
  getImageApi,
  signLoginApi,
  bindLoginApi,
  socialLoginApi
} from '@/api/auth'
export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    return {
      tabActiveName: 'bindLogin',
      socialLoginUrl: socialLoginUrl,
      login: {
        type: 'up'
      },
      logo: [
        { img: 'gitee.png', name: 'gitee', radius: true },
        { img: 'github.png', name: 'github', radius: true },
        { img: 'tencent_cloud.png', name: 'tencent_cloud', radius: true },
        { img: 'qq.png', name: 'qq', radius: false },
        { img: 'dingtalk.png', name: 'dingtalk', radius: true },
        { img: 'microsoft.png', name: 'microsoft', radius: false }
      ],
      loginForm: {
        username: '',
        password: '',
        bindUsername: '',
        bindPassword: '',
        signUsername: '',
        signPassword: ''
      },
      rules: {
        username: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        password: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        code: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        bindUsername: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        bindPassword: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        signUsername: [
          {
            required: true,
            message: this.$t('rules.require'),
            trigger: 'blur'
          },
          {
            min: 4,
            max: 10,
            message: this.$t('rules.range4to10'),
            trigger: 'blur'
          }
        ],
        signPassword: [
          {
            required: true,
            message: this.$t('rules.require'),
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: this.$t('rules.range6to20'),
            trigger: 'blur'
          }
        ]
      },
      authUser: null,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      randomId: randomNum(24, 16),
      imageCode: ''
    }
  },
  mounted() {
    // 清空所有缓存
    db.clear()
    this.getCodeImage()
  },
  destroyed() {
    window.removeEventListener('message', this.resolveSocialLogin)
  },
  methods: {
    getCodeImage() {
      getImageApi(this.randomId)
        .then(res => {
          const arrayBuffer = res.data
          return getBase64Image(arrayBuffer)
        })
        .then(res => {
          this.imageCode = res
        })
        .catch(error => {
          console.error(error)
        })
        .catch(e => {
          if (e.toString().indexOf('429') !== -1) {
            this.$message({
              message: this.$t('tips.tooManyRequest'),
              type: 'error'
            })
          } else {
            this.$message({
              message: this.$t('tips.getCodeImageFailed'),
              type: 'error'
            })
          }
        })
    },
    handleTabClick(tab, event) {
      this.tabActiveName = tab.name
    },
    resolveLogo(logo) {
      return require(`@/assets/logo/${logo}`)
    },
    socialLogin(oauthType) {
      socialLoginApi(oauthType, this.resolveSocialLogin)
    },
    resolveSocialLogin(e) {
      const data = e.data
      const that = this
      if (data.message === 'not_bind') {
        that.login.type = 'bind'
        const authUser = data.data
        that.authUser = authUser
        that
          .$confirm(
            that.$t('common.current') +
              authUser.source +
              that.$t('common.socialAccount') +
              authUser.nickname +
              that.$t('common.socialTips'),
            that.$t('common.tips'),
            {
              confirmButtonText: that.$t('common.signLogin'),
              cancelButtonText: that.$t('common.bindLogin'),
              type: 'warning'
            }
          )
          .then(() => {
            that.tabActiveName = 'signLogin'
          })
          .catch(() => {
            that.tabActiveName = 'bindLogin'
          })
      } else if (data.message === 'social_login_success') {
        that.saveLoginData(data.data)
        that.getUserDetailInfo()
        that.loginSuccessCallback()
      } else {
        // do nothing
      }
    },
    bindLogin() {
      let username_c = false
      let password_c = false
      this.$refs.loginForm.validateField('bindUsername', e => {
        if (!e) {
          username_c = true
        }
      })
      this.$refs.loginForm.validateField('bindPassword', e => {
        if (!e) {
          password_c = true
        }
      })
      if (username_c && password_c) {
        this.loading = true
        const that = this
        const params = {
          bindUsername: that.loginForm.bindUsername,
          bindPassword: that.loginForm.bindPassword,
          ...that.authUser
        }
        // 删除token属性，否则后端注入错误
        delete params.token
        bindLoginApi(params)
          .then(r => {
            const data = r.data.data
            this.saveLoginData(data)
            this.getUserDetailInfo()
            this.loginSuccessCallback()
          })
          .catch(error => {
            console.error(error)
            that.loading = false
          })
      }
    },
    signLogin() {
      let username_c = false
      let password_c = false
      this.$refs.loginForm.validateField('signUsername', e => {
        if (!e) {
          username_c = true
        }
      })
      this.$refs.loginForm.validateField('signPassword', e => {
        if (!e) {
          password_c = true
        }
      })
      if (username_c && password_c) {
        this.loading = true
        const that = this
        const params = {
          bindUsername: that.loginForm.signUsername,
          bindPassword: that.loginForm.signPassword,
          ...that.authUser
        }
        params.token = null
        signLoginApi(params)
          .then(r => {
            const data = r.data.data
            this.saveLoginData(data)
            this.getUserDetailInfo()
            this.loginSuccessCallback()
          })
          .catch(error => {
            console.error(error)
            that.loading = false
          })
      }
    },
    handleLogin() {
      let username_c = false
      let password_c = false
      let code_c = false
      this.$refs.loginForm.validateField('username', e => {
        if (!e) {
          username_c = true
        }
      })
      this.$refs.loginForm.validateField('password', e => {
        if (!e) {
          password_c = true
        }
      })
      this.$refs.loginForm.validateField('code', e => {
        if (!e) {
          code_c = true
        }
      })
      if (username_c && password_c && code_c) {
        this.loading = true
        const that = this
        // 请求获取token
        loginApi({ ...that.loginForm, key: this.randomId })
          .then(r => {
            const data = r.data
            this.saveLoginData(data)
            // 获取当前用户信息并缓存，然后跳转到/
            this.getUserDetailInfo()
            // 登录成功记录回调
            this.loginSuccessCallback()
          })
          .catch(error => {
            console.error(error)
            that.loading = false
            that.getCodeImage()
          })
      }
    },
    saveLoginData(data) {
      this.$store.commit('account/setAccessToken', data.access_token)
      this.$store.commit('account/setRefreshToken', data.refresh_token)
      const current = new Date()
      const expireTime = current.setTime(
        current.getTime() + 1000 * data.expires_in
      )
      this.$store.commit('account/setExpireTime', expireTime)
    },
    getUserDetailInfo() {
      getUserDetailInfoApi()
        .then(r => {
          const user = r.data.data
          this.$store.commit('account/setUser', user)
          this.$message({
            message: this.$t('tips.loginSuccess'),
            type: 'success'
          })
          this.loading = false
          this.$router.push('/')
        })
        .catch(error => {
          this.$message({
            message: this.$t('tips.loginFail'),
            type: 'error'
          })
          console.error(error)
          this.loading = false
        })
    },
    loginSuccessCallback() {
      loginSuccessCallbackApi().catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss">
@import "login";
</style>
<style lang="scss" scoped>
@import "login-scoped";
</style>
