<template>
  <el-dialog
    :title="title"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <!--el-form加入:model="supplier"，让this.$refs.form.resetFields()等表单函数起作用 -->
    <el-form
      ref="form"
      :model="supplier"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <!-- 需要加prop，rules才起作用-->
      <el-form-item label="名称" prop="supplierName">
        <el-input v-model="supplier.supplierName" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="supplier.address" :rules="{ required: true, message: '不能为空' }" />
      </el-form-item>
      <el-form-item label="开户银行" prop="bank">
        <el-input v-model="supplier.bank" :rules="{ required: true, message: '不能为空' }" />
      </el-form-item>
      <el-form-item label="银行账号" prop="bankAccount">
        <el-input v-model.number="supplier.bankAccount" :rules="{ required: true, message: '不能为空' }" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="supplier.email" :rules="{ required: true, message: '不能为空' }" />
      </el-form-item>
      <el-form-item label="联系人" prop="linkMan">
        <el-input v-model="supplier.linkMan" :rules="{ required: true, message: '不能为空' }" />
      </el-form-item>
      <el-form-item label="联系人号码" prop="linkTel">
        <el-input v-model="supplier.linkTel" :rules="{ required: true, message: '不能为空' }" />
      </el-form-item>
      <el-form-item label="联系电话" prop="telPhone">
        <el-input v-model="supplier.telPhone" :rules="{ required: true, message: '不能为空' }" />
      </el-form-item>
      <el-form-item label="邮编" prop="postcode">
        <el-input v-model="supplier.postcode" :rules="{ required: true, message: '不能为空' }" />
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
import { addeSupplierApi, updateSupplierApi } from '@/api/pms'
export default {
  name: 'SupplierEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    dto: {
      type: Object,
      default: () => ({
        supplierName: null,
        address: null,
        bank: null,
        bankAccount: null,
        email: null,
        linkMan: null,
        linkTel: null,
        telPhone: null,
        postcode: null
      })
    }
  },
  data() {
    return {
      buttonLoading: false,
      // supplier的数据由父组件决定
      supplier: {},
      rules: {
        supplierName: {
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
  watch: {
    dto: {
      handler(n, o) {
        this.supplier = { ...n }
        // console.log(this.supplier)
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    submitForm: function() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        this.buttonLoading = true
        const params = this.supplier
        if (!params.supplierId) {
          // 不存在id说明新增
          addeSupplierApi(params)
            .then(r => {
              console.log(r.data.status)
              this.$message({
                message: this.$t('tips.createSuccess'),
                type: 'success'
              })
              this.buttonLoading = false
              this.$emit('success')
            })
            .catch(e => {
              this.buttonLoading = false
            })
        } else {
          updateSupplierApi(params)
            .then(r => {
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.buttonLoading = false
              this.$emit('success')
            })
            .catch(e => {
              this.buttonLoading = false
            })
        }
        this.reset()
      })
    },
    close: function() {
      this.$emit('close')
    },
    reset: function() {
      this.supplier = {}
      this.buttonLoading = false
      this.isVisible = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped></style>
