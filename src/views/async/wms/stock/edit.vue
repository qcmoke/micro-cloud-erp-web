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

      <el-form-item label="库存量" prop="itemCount">
        <el-input
          v-model.number="postForm.itemCount"
          placeholder="请输入..."
        />
      </el-form-item>

      <el-form-item label="库存位置" prop="area">
        <el-input
          v-model="postForm.area"
          placeholder="请输入..."
        />
      </el-form-item>

      <el-form-item label="最大库存量" prop="sMax">
        <el-input
          v-model.number="postForm.sMax"
          placeholder="请输入..."
        />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="isVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateStockApi } from '@/api/wms'

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
      postForm: this.initPostForm(),
      rules: {
        area: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        sMax: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        itemCount: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        }
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
        this.postForm.stockId = n.stockId
        this.postForm.area = n.area
        this.postForm.sMax = n.smax
        this.postForm.itemCount = n.itemCount
      },
      deep: true
    }
  },
  methods: {
    submit: function() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        updateStockApi(this.postForm).then(r => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('success')
          this.close()
        })
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
        stockId: null,
        area: null,
        sMax: null,
        itemCount: null
      }
    }
  }
}
</script>
