<template>
  <el-dialog
    title="创建退订单"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    top="20px"
    width="30%"
  >
    <el-form ref="form" :model="postForm" label-width="100px" :rules="rules" size="mini">
      <el-form-item
        v-if="row.payStatus===2"
        label="退款渠道"
        prop="refundChannel"
      >
        <el-select
          v-model="postForm.refundChannel"
          placeholder="请选择"
          size="mini"
          style="width:100%"
        >
          <el-option
            v-for="item in [
              { key: 1, name: '支付宝' },
              { key: 2, name: '微信' },
              { key: 3, name: '银联' }
            ]"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="row.payStatus===2"
        label="退订金额"
        prop="totalAmount"
      >
        <el-input v-model.number="postForm.totalAmount" />
      </el-form-item>
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
      postForm: this.initPostForm(),
      row: {},
      rules: {
        totalAmount: [
          { required: true, message: this.$t('rules.require') },
          { type: 'number', message: '必须为数字值' }
        ],
        refundChannel: {
          required: true, message: this.$t('rules.require')
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
  methods: {
    setRow: function(row) {
      this.row = { ...row }
      this.postForm.totalAmount = row.totalAmount
      console.log(row)
    },
    initPostForm: function() {
      return {
        reason: '',
        purchaseOrderMasterId: null,
        refundChannel: null,
        totalAmount: null
      }
    },
    submit: function() {
      this.$refs['form'].validate(v => {
        if (!v) {
          return
        }
        this.postForm.purchaseOrderMasterId = this.masterId
        createRefuseApi(this.postForm).then(r => {
          this.$message({
            message: '创建退订单成功',
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
      this.postForm = this.initPostForm()
    }
  }
}
</script>
