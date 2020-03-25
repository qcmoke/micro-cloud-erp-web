<template>
  <div>
    <el-button
      type="danger"
      size="mini"
      @click.native="toRefund()"
    >退订</el-button>
    <refund-form
      :dialog-visible="refundFormDialog.isVisible"
      :master-id="refundFormDialog.masterId"
      @success="search"
      @close="refundFormDialog.isVisible = false"
    />
  </div>
</template>

<script>
import RefundForm from './dialog'

export default {
  components: { RefundForm },
  data: function() {
    return {
      refundFormDialog: { isVisible: false, masterId: 0 }
    }
  },
  methods: {
    toRefund: function() {
      this.refundFormDialog.isVisible = true
      this.refundFormDialog.masterId = 1
    },
    search: function() {
      console.log('ok')
    }
  }
}
</script>
