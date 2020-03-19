<template>
  <el-dialog
    title="创建退订单"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    top="20px"
    width="30%"
  >
    <el-form ref="form" label-width="80px">
      <el-form-item label="退订原因">
        <el-input v-model="postForm.reason" type="textarea" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="isVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createRefuseApi } from '@/api/pms'

export default {
  name: 'RefundForm',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    masterId: {
      type: Number,
      default: null
    }
  },
  data: function() {
    return {
      postForm: this.initPostForm()
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
  methods: {
    initPostForm: function() {
      return {
        reason: '',
        purchaseOrderMasterId: null
      }
    },
    submit: function() {
      this.postForm.purchaseOrderMasterId = this.masterId
      createRefuseApi(this.postForm).then(r => {
        this.$message({
          message: '创建退订单成功',
          type: 'success'
        })
        this.$emit('success')
        this.close()
      })
    },
    close: function() {
      this.resetForm()
      this.$emit('close')
    },
    resetForm: function() {
      this.postForm = this.initPostForm()
    }
  }
}
</script>
