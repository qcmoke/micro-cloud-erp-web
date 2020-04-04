<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.materialName"
        placeholder="名称"
        class="filter-item search-item"
      />
      <el-button class="filter-item" type="primary" plain @click="search">
        {{ $t("table.search") }}
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        {{ $t("table.reset") }}
      </el-button>
      <el-dropdown trigger="click" class="filter-item">
        <el-button>
          {{ $t("table.more") }}<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="add">新增订单</el-dropdown-item>
          <el-dropdown-item @click.native="batchDelete">{{
            $t("table.delete")
          }}</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel">{{
            $t("table.export")
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="pageResult.rows"
      stripe
      height="450"
      @selection-change="onSelectChange"
    >
      <el-table-column type="expand" fixed>
        <template slot-scope="props">
          <el-table
            :data="props.row.details"
            class="inner-table-detail"
            style="width: 100%"
          >
            <el-table-column
              label="订单明细信息"
              align="center"
              :render-header="(h, cos) => renderHeader(h, cos, props.row)"
            >
              <el-table-column
                label="编号"
                prop="detailId"
                align="center"
                width="80px"
              />
              <el-table-column label="产品" prop="productName" align="center" />
              <el-table-column label="数量" prop="count" align="center" />
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column prop="masterId" align="center" label="订单编号" />
      <el-table-column
        prop="customerName"
        align="center"
        label="客户"
        min-width="200px"
      />
      <el-table-column prop="totalAmount" align="center" label="总金额" />
      <el-table-column prop="freightAmount" align="center" label="运费" />
      <el-table-column prop="payTypeInfo" align="center" label="支付类型" />
      <el-table-column prop="payStatusInfo" align="center" label="支付状态" />
      <el-table-column prop="stockCheckStatusInfo" align="center" label="仓库审核状态" />
      <el-table-column prop="outStatusInfo" align="center" label="发货状态" />
      <el-table-column prop="receiveStatusInfo" align="center" label="客户收货状态" />
      <el-table-column prop="finishStatusInfo" align="center" label="完成状态" />
      <el-table-column prop="receiverName" align="center" label="收货人姓名" />
      <el-table-column
        prop="receiverPhone"
        align="center"
        label="收货人电话"
        min-width="120px"
      />
      <el-table-column
        prop="receiverDetailAddress"
        align="center"
        label="收货人地址"
        min-width="305px"
      />
      <el-table-column prop="deliverySn" label="物流单号" align="center" />
      <el-table-column prop="billTypeInfo" label="发票类型" align="center" />
      <el-table-column
        prop="billContent"
        label="发票内容"
        align="center"
        width="100px"
        show-overflow-tooltip
      />
      <el-table-column prop="deliveryChannel" label="运输渠道" align="center" />
      <el-table-column prop="deliverySn" label="物流单号" align="center" />
      <el-table-column
        prop="saleDate"
        align="center"
        label="销售时间"
        min-width="155px"
      />
      <el-table-column
        prop="paymentTime"
        align="center"
        label="支付时间"
        min-width="155px"
      />
      <el-table-column
        prop="deliveryTime"
        align="center"
        label="发货时间"
        min-width="155px"
      />
      <el-table-column
        prop="receiveTime"
        align="center"
        label="收货时间"
        min-width="155px"
      />
      <el-table-column
        label="备注"
        prop="remark"
        align="center"
        width="100px"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
        min-width="110px"
      >
        <template slot-scope="{ row }">
          <i
            class="el-icon-truck table-operation"
            style="color: #67C23A;"
            @click="editUserDelivery(row)"
          />
          <i
            class="el-icon-edit table-operation"
            style="color: #2db7f5;"
            @click="edit(row)"
          />
          <i
            class="el-icon-delete table-operation"
            style="color: #f50;"
            @click="singleDelete(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="pageResult.total > 0"
      :total="pageResult.total"
      :page.sync="query.pageNum"
      :limit.sync="query.pageSize"
      @pagination="search"
    />
    <purchase-edit
      ref="edit"
      :dialog-visible="dialog.isVisible"
      :title="dialog.title"
      :dto="dialog.dto"
      @success="search"
      @close="dialog.isVisible = false"
    />

    <delivery-edit
      :dto="deliveryDrawer.dto"
      :delivery-visible="deliveryDrawer.isVisible"
      @success="search"
      @close="
        () => {
          deliveryDrawer.isVisible = false;
        }
      "
    />
  </div>
</template>

<script>
import {
  pageSaleOrderMasterApi,
  batchDeleteSaleOrderMasterApi
} from '@/api/oms'
import Pagination from '@/components/Pagination'

import PurchaseEdit from './edit'
import DeliveryEdit from './delivery-edit'
export default {
  name: 'PurchaseManage',
  components: { Pagination, PurchaseEdit, DeliveryEdit },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 5,
        materialName: null
      },
      pageResult: {
        row: [],
        total: 10
      },
      dialog: {
        isVisible: false,
        title: '',
        dto: {}
      },
      deliveryDrawer: {
        isVisible: false,
        dto: {
          freightAmount: null,
          deliveryTime: null,
          receiveTime: null,
          receiverName: null,
          receiverPhone: null,
          receiverDetailAddress: null,
          deliverySn: null
        }
      },
      refundFormDialog: { isVisible: false, masterId: null },
      selection: [],
      loading: false,
      tableKey: 0
    }
  },
  computed: {},
  mounted() {
    this.fetch()
  },
  methods: {
    // render 事件
    renderHeader(h, cos, row) {
      // h即为cerateElement的简写，具体可看vue官方文档
      return h('div', [
        h('span', cos.column.label),
        h('i', {
          class: 'el-icon-house',
          style: 'margin-left:5px;margin-right:5px;'
        }),
        h('span', '销售件数：' + row.details.length)
      ])
    },
    fetch: function() {
      this.loading = true
      const params = this.query
      pageSaleOrderMasterApi(params)
        .then(r => {
          this.pageResult = r.data.data
          this.loading = false
        })
        .catch(e => {
          this.loading = false
        })
    },
    search: function() {
      this.fetch()
    },
    reset: function() {
      this.query.materialName = null
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    add: function() {
      this.dialog.title = '新增订单'
      this.dialog.dto = {}
      this.dialog.isVisible = true
    },
    edit: function(row) {
      if (row.payStatus === 2) {
        this.$message({
          message: '该订单已经付款，不能修改',
          type: 'warning'
        })
        return
      }
      this.dialog.title = '编辑订单'
      this.dialog.dto = { ...row }
      this.dialog.isVisible = true
    },
    singleDelete: function(row) {
      if (row.payStatus === 2) {
        this.$message({
          message: '该订单已经付款，不能修改',
          type: 'warning'
        })
        return
      }
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete: function() {
      for (const elm of this.selection) {
        if (elm.payStatus === 2) {
          this.$message({
            message: '该订单已经付款，不能删除',
            type: 'warning'
          })
          return
        }
      }
      if (!this.selection.length) {
        this.$message({
          message: this.$t('tips.noDataSelected'),
          type: 'warning'
        })
        return
      }
      this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        const masterIds = this.selection.map(row => row.masterId).join()
        this.loading = true
        batchDeleteSaleOrderMasterApi(masterIds)
          .then(r => {
            this.$message({
              message: this.$t('tips.deleteSuccess'),
              type: 'success'
            })
            this.loading = false
            this.$refs.table.clearSelection()
            this.search()
          })
          .catch(err => {
            console.error(err)
            this.loading = false
            this.$refs.table.clearSelection()
          })
      })
    },
    exportExcel: function() {},
    onSelectChange: function(selection) {
      this.selection = selection
    },
    editUserDelivery: function(row) {
      this.deliveryDrawer.dto = { ...row }
      this.deliveryDrawer.isVisible = true
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.inner-table-detail {
  margin-bottom: 80px;
}

button.el-button.btn-apply-stock.el-button--success.el-button--mini {
  width: 80px;
}
</style>
