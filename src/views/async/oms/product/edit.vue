<template>
  <el-dialog
    title="编辑"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    top="50px"
    width="30%"
  >
    <el-form ref="form" :model="postForm" label-width="100px" :rules="rules">
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="postForm.productName"
          placeholder="请输入..."
        />
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <el-input
          v-model="postForm.img"
          placeholder="请输入..."
        />
      </el-form-item>
      <el-form-item label="销售单价" prop="price">
        <el-input
          v-model.number="postForm.price"
          placeholder="请输入..."
        />
      </el-form-item>
      <el-form-item label="商品产地" prop="space">
        <el-input
          v-model="postForm.space"
          placeholder="请输入..."
        />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input
          v-model="postForm.unit"
          placeholder="请输入..."
        />
      </el-form-item>
      <el-form-item label="规格" prop="standard">
        <el-input
          v-model="postForm.standard"
          placeholder="请输入..."
        />
      </el-form-item>
      <el-form-item label="批准文号" prop="approveId">
        <el-input
          v-model="postForm.approveId"
          placeholder="请输入..."
        />
      </el-form-item>
      <el-form-item label="生产批号" prop="batchId">
        <el-input
          v-model="postForm.batchId"
          placeholder="请输入..."
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
import { addProductApi, updateProductApi } from '@/api/oms'

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
        this.buttonLoading = true
        const params = { ...this.postForm }
        delete params.createTime
        delete params.modifyTime
        delete params.deleteStatus

        // 不存在id说明新增
        const isCreateFlag = !params.productId
        if (isCreateFlag) {
          addProductApi(params).then(r => {
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
          updateProductApi(params).then(r => {
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
        productId: null,
        productName: null,
        img: null,
        approveId: null,
        batchId: null,
        price: null,
        space: null,
        unit: null,
        standard: null,
        safetyStock: null
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
        productName: defaultRequire(),
        img: defaultRequire(),
        approveId: defaultRequire(),
        batchId: defaultRequire(),
        price: defaultRequire(),
        space: defaultRequire(),
        unit: defaultRequire(),
        standard: defaultRequire(),
        safetyStock: defaultRequire()
      }
    }
  }
}
</script>
