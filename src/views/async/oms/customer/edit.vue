<template>
  <el-dialog
    title="编辑"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    top="50px"
    width="50%"
  >
    <el-form ref="form" :model="postForm" label-width="100px" :rules="rules">
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="postForm.customerName"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="telPhone">
        <el-input
          v-model="postForm.telPhone"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="linkMan">
        <el-input
          v-model="postForm.linkMan"
        />
      </el-form-item>
      <el-form-item label="联系人电话" prop="linkTel">
        <el-input
          v-model="postForm.linkTel"
        />
      </el-form-item>
      <el-form-item label="客户收货地址" prop="address">
        <el-input
          v-model="postForm.address"
        />
      </el-form-item>
      <el-form-item label="开户行" prop="bank">
        <el-input
          v-model="postForm.bank"
        />
      </el-form-item>
      <el-form-item label="银行账户" prop="bankAccount">
        <el-input
          v-model.number="postForm.bankAccount"
        />
      </el-form-item>
      <el-form-item label="电子邮件" prop="email">
        <el-input
          v-model="postForm.email"
        />
      </el-form-item>
      <el-form-item label="邮编" prop="postcode">
        <el-input
          v-model="postForm.postcode"
        />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="isVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addCustomerApi, updateCustomerApi } from '@/api/oms'

export default {
  name: 'RefundForm',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dto: {
      type: Object,
      default: () => this.initPostForm()
    }
  },
  data: function() {
    return {
      buttonLoading: false,
      postForm: this.initPostForm(),
      rules: this.initRules()
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
  watch: {
    dto: {
      handler(n, o) {
        this.postForm = { ...n }
      },
      deep: true
    }
  },
  methods: {
    submitForm: function() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        const params = { ...this.postForm }
        delete params.createTime
        delete params.modifyTime
        delete params.deleteStatus
        // 不存在id说明新增
        const isCreateFlag = !params.customerId
        this.buttonLoading = true
        if (isCreateFlag) {
          addCustomerApi(params).then(r => {
            this.$message({
              message: this.$t('tips.createSuccess'),
              type: 'success'
            })
            this.buttonLoading = false
            this.$emit('success')
            this.close()
          }).catch(e => {
            this.buttonLoading = false
          })
        } else {
          updateCustomerApi(params).then(r => {
            this.$message({
              message: this.$t('tips.updateSuccess'),
              type: 'success'
            })
            this.buttonLoading = false
            this.$emit('success')
            this.close()
          }).catch(e => {
            this.buttonLoading = false
          })
        }
        this.reset()
      })
    },
    close: function() {
      this.resetForm()
      this.$emit('close')
    },
    resetForm: function() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.postForm = this.initPostForm()
    },
    initPostForm: function() {
      return {
        customerId: null,
        address: null,
        bank: null,
        bankAccount: null,
        email: null,
        linkMan: null,
        linkTel: null,
        customerName: null,
        telPhone: null,
        postcode: null
      }
    },
    initRules: function() {
      const defaultRequire = () => {
        return {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'change'
        }
      }
      return {
        address: defaultRequire(),
        bank: defaultRequire(),
        bankAccount: defaultRequire(),
        email: {},
        linkMan: defaultRequire(),
        linkTel: defaultRequire(),
        customerName: defaultRequire(),
        telPhone: defaultRequire(),
        postcode: {}
      }
    }
  }
}
</script>
