<template>
  <el-form ref="form" :model="user" :rules="rules" label-position="right" label-width="80px" class="form">
    <el-form-item :label="$t('table.user.email')" prop="email">
      <el-input v-model="user.email" />
    </el-form-item>
    <el-form-item :label="$t('table.user.mobile')" prop="mobile">
      <el-input v-model="user.mobile" />
    </el-form-item>
    <el-form-item :label="$t('table.user.dept')" prop="deptId">
      <treeselect
        v-model="user.deptId"
        :multiple="false"
        :options="depts"
        :clear-value-text="$t('common.clear')"
        placeholder=" "
        @select="onSelect"
      />
    </el-form-item>
    <el-form-item :label="$t('table.user.sex')" prop="sex">
      <el-select v-model="user.sex" value="" placeholder="">
        <el-option value="0" :label="$t('common.sex.male') " />
        <el-option value="1" :label="$t('common.sex.female') " />
        <el-option value="2" :label="$t('common.sex.secret') " />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('table.user.desc')" prop="description">
      <el-input v-model="user.description" type="textarea" rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain :loading="buttonLoading" @click="submit">{{ $t('common.edit') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { validMobile } from '@/utils/my-validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { modifyProfileApi, getDeptListApi } from '@/api/ums'

export default {
  components: { Treeselect },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data() {
    return {
      depts: [],
      buttonLoading: false,
      deptName: '',
      change: false,
      rules: {
        email: { type: 'email', message: this.$t('rules.email'), trigger: 'blur' },
        mobile: { validator: (rule, value, callback) => {
          if (value !== '' && !validMobile(value)) {
            callback(this.$t('rules.mobile'))
          } else {
            callback()
          }
        }, trigger: 'blur' },
        sex: { required: true, message: this.$t('rules.require'), trigger: 'change' },
        description: { max: 100, message: this.$t('rules.noMoreThan100'), trigger: 'blur' }
      }
    }
  },
  mounted() {
    this.initDept()
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const temp = { ...this.user }
          delete temp.permissions
          delete temp.authorities
          delete temp.lastLoginTime
          delete temp.modifyTime
          delete temp.createTime
          modifyProfileApi({ ...temp }).then((r) => {
            if (r.data.status === 200) {
              this.buttonLoading = false
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              if (this.change) {
                this.user.deptName = this.deptName
              }
              this.$store.commit('account/setUser', this.user)
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    onSelect(a, b) {
      this.deptName = a.label
      this.change = true
    },
    initDept() {
      getDeptListApi().then((r) => {
        this.depts = r.data.data.rows
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: this.$t('tips.getDataFail'),
          type: 'error'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .form {
    padding: 10px 0 0 0;
  }
</style>
