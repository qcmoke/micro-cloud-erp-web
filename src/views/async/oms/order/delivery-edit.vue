<template>
  <el-drawer
    title="货物收发与售后"
    size="450px"
    direction="rtl"
    class="my-drawer"
    :modal="true"
    :show-close="true"
    :wrapper-closable="false"
    :visible.sync="isVisible"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="生成发货单">

        <el-steps :space="70" :active="step.stepActive" finish-status="success" direction="vertical">
          <el-step title="提交申请" />
          <el-step title="仓库审核" :description="step.checkResult" />
          <el-step title="待发货" />
          <el-step title="仓库发货" />
        </el-steps>
        <el-row type="flex" class="row-bg" justify="end">
          <el-col :span="10">
            <div>
              <el-button
                type="primary"
                size="mini"
                :loading="loading"
                @click="submitApplyForDeliveryPostForm"
              >提交</el-button>
              <el-button
                type="warning"
                size="mini"
                :loading="loading"
                @click="close"
              >取 消</el-button>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="收货处理">
        <el-form
          ref="receiverPostForm"
          :model="receiverPostForm"
          :rules="rules"
          size="mini"
          label-position="right"
          label-width="100px"
          status-icon
          class="delivery-form"
        >
          <el-form-item label="收货人姓名" prop="receiverName">
            <el-input v-model="receiverPostForm.receiverName" />
          </el-form-item>
          <el-form-item label="收货人电话" prop="receiverPhone">
            <el-input v-model="receiverPostForm.receiverPhone" />
          </el-form-item>
          <el-form-item label="收货人地址" prop="receiverDetailAddress">
            <el-input v-model="receiverPostForm.receiverDetailAddress" />
          </el-form-item>
          <el-form-item label="是否已收货" prop="isReceived">
            <el-switch v-model="receiverPostForm.isReceived" />
          </el-form-item>
          <el-form-item
            v-if="receiverPostForm.isReceived"
            label="收货时间"
            prop="receiveTime"
          >
            <el-date-picker
              v-model="receiverPostForm.receiveTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              size="mini"
              align="center"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <el-row type="flex" class="row-bg" justify="end">
          <el-col :span="10">
            <div>
              <el-button
                type="primary"
                size="mini"
                :loading="loading"
                @click="submit"
              >提交</el-button>
              <el-button
                type="warning"
                size="mini"
                :loading="loading"
                @click="close"
              >取 消</el-button>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="退货处理">
        <el-form
          ref="refundPostForm"
          :model="refundPostForm"
          label-width="100px"
          size="mini"
          label-position="right"
          :rules="rules"
        >
          <el-form-item label="退款渠道" prop="refundChannel">
            <el-select
              v-model="refundPostForm.refundChannel"
              placeholder="请选择"
              size="mini"
              style="width: 100%"
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
          <el-form-item label="退款金额" prop="totalAmount">
            <el-input v-model.number="refundPostForm.totalAmount" disabled />
          </el-form-item>
          <el-form-item label="退货原因">
            <el-input v-model="refundPostForm.reason" />
          </el-form-item>
          <el-form-item label="退货时间" prop="refundDate">
            <el-date-picker
              v-model="refundPostForm.refundDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              size="mini"
              align="center"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <el-row type="flex" class="row-bg" justify="end">
          <el-col :span="10">
            <div>
              <el-button
                type="primary"
                size="mini"
                :loading="loading"
                @click="submitRefundPostForm"
              >提交</el-button>
              <el-button
                type="warning"
                size="mini"
                :loading="loading"
                @click="close"
              >取 消</el-button>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>
import { validMobile } from '@/utils/my-validate'
import { updateUserDeliveryApi, addSaleRefundApi, applyForDeliveryApi } from '@/api/oms'
export default {
  props: {
    deliveryVisible: {
      type: Boolean,
      default: false
    },
    dto: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      receiverPostForm: this.initReceiverPostForm(),
      refundPostForm: this.initRefundPostForm(),
      applyForDeliveryPostForm: this.initApplyForDeliveryPostForm(),
      rules: this.initRules(),
      step: this.initStep()
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.deliveryVisible
      },
      set() {
        this.close()
      }
    }
  },
  watch: {
    dto: {
      handler: function(n, o) {
        this.receiverPostForm = {
          ...n,
          isReceived: n.status && n.status >= 5
        }
        this.step.stepActive = 0

        // 申请发货
        if (n.transferStockStatus === 2) {
          this.step.stepActive = 0
        }

        // 申请完成
        if (n.transferStockStatus === 2) {
          this.step.stepActive = 1
        }
        // 仓库审核
        if (n.transferStockStatus === 3) {
          this.step.stepActive = 2
          this.step.checkResult = '审核不通过'
        }
        // 仓库审核完成
        if (n.transferStockStatus === 4) {
          this.step.stepActive = 2
          this.step.checkResult = '审核通过'
        }

        // 仓库发货
        if (n.transferStockStatus === 4 && n.status < 3) {
          this.step.stepActive = 3
        }
        // 仓库发货
        if (n.status >= 3) {
          this.step.stepActive = 4
        }
        this.applyForDeliveryPostForm.masterId = n.masterId
        this.refundPostForm.saleOrderMasterId = n.masterId
        this.refundPostForm.totalAmount = n.totalAmount
      },
      deep: true
    }
  },
  methods: {
    initApplyForDeliveryPostForm: function() {
      return {
        masterId: null
      }
    },
    initReceiverPostForm: function() {
      return {
        isReceived: false,
        masterId: null,
        receiveTime: null,
        receiverName: null,
        receiverPhone: null,
        receiverDetailAddress: null
      }
    },
    initRefundPostForm: function() {
      return {
        saleOrderMasterId: null,
        refundChannel: null,
        totalAmount: null,
        reason: null,
        refundDate: null
      }
    },
    initStep: function() {
      return {
        stepActive: 0,
        checkResult: '...'
      }
    },
    submit: function() {
      this.$refs.receiverPostForm.validate(v => {
        if (!v) {
          return
        }
        this.loading = true
        updateUserDeliveryApi({ ...this.receiverPostForm })
          .then(r => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$emit('success')
            this.close()
            this.loading = false
          })
          .catch(_ => {
            this.loading = false
          })
      })
    },
    close: function() {
      this.applyForDeliveryPostForm = this.initApplyForDeliveryPostForm()
      this.receiverPostForm = this.initReceiverPostForm()
      this.refundPostForm = this.initRefundPostForm()
      this.step = this.initStep()
      this.$emit('close')
    },
    submitApplyForDeliveryPostForm: function() {
      this.loading = true
      applyForDeliveryApi({ ...this.applyForDeliveryPostForm })
        .then(r => {
          this.$message({
            message: '申请成功,等待仓库发货...',
            type: 'success'
          })
          this.$emit('success')
          this.close()
          this.loading = false
        })
        .catch(_ => {
          this.loading = false
        })
    },
    submitRefundPostForm: function() {
      this.$refs.refundPostForm.validate(v => {
        if (!v) {
          return
        }
        this.loading = true
        addSaleRefundApi({ ...this.refundPostForm })
          .then(r => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$emit('success')
            this.close()
            this.loading = false
          })
          .catch(_ => {
            this.loading = false
          })
      })
    },
    initRules: function() {
      const defaultRequire = () => {
        return {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        }
      }
      return {
        receiveTime: defaultRequire(),
        receiverName: defaultRequire(),
        receiverDetailAddress: defaultRequire(),
        receiverPhone: {
          required: true,
          validator: (rule, value, callback) => {
            if (value !== '' && !validMobile(value)) {
              callback(this.$t('rules.mobile'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        },
        // 退货
        refundChannel: defaultRequire(),
        totalAmount: defaultRequire(),
        refundDate: defaultRequire(),
        // 发货申请
        deliveryChannel: defaultRequire(),
        deliverySn: defaultRequire()
      }
    }
  }
}
</script>

<style lang="scss">
.el-drawer__header {
  font-weight: bold;
  color: #050505;
  font-size: 16px;
}
</style>
