<template>
  <el-dialog
    :title="title"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <!--el-form加入:model="account"，让this.$refs.form.resetFields()等表单函数起作用 -->
    <el-form
      ref="form"
      size="mini"
      :model="account"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <!-- 需要加prop，rules才起作用-->
      <el-form-item label="账户名称" prop="accountName">
        <el-input v-model="account.accountName" />
      </el-form-item>
      <el-form-item label="账户名称" prop="bankName">
        <el-input
          v-model="account.bankName"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="交易平台名称" prop="bankName">
        <el-input
          v-model="account.bankName"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="交易平台账号" prop="bankNum">
        <el-input
          v-model.number="account.bankNum"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="余额" prop="amount">
        <el-input
          v-model.number="account.amount"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="是否默认" prop="isDefault">
        <el-input
          v-model="account.isDefault"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="warning"
        plain
        :loading="buttonLoading"
        @click="isVisible = false"
      >
        {{ $t("common.cancel") }}
      </el-button>
      <el-button
        type="primary"
        plain
        :loading="buttonLoading"
        @click="submitForm"
      >
        {{ $t("common.confirm") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  saveOrUpdateAccountApi
} from '@/api/fms'
export default {
  name: 'AccountEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      buttonLoading: false,
      // account的数据由父组件决定
      account: {},
      rules: {
        accountName: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        bankAccount: [
          { required: true, message: this.$t('rules.require') },
          { type: 'number', message: '必须为数字值' }
        ]
      }
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
      }
    }
  },
  watch: {},
  mounted() {
  },
  methods: {
    // 父传子
    setRow: function(row) {
      // 给account赋值
      this.account = { ...row }
    },
    submitForm: function() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        this.buttonLoading = true
        const params = {
          ...this.account,
          materialIds: this.materialIds
        }
        saveOrUpdateAccountApi(params)
          .then(r => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$emit('success')
            this.close()
            this.buttonLoading = false
          })
          .catch(e => {
            this.buttonLoading = false
          })
      })
    },
    close: function() {
      this.reset()
      this.$emit('close')
      this.buttonLoading = false
    },
    reset: function() {
      this.account = {}
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped></style>
