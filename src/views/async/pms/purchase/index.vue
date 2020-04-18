<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="queryCreateTimes"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="filter-item"
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
          <el-dropdown-item @click.native="add">{{
            $t("table.add")
          }}</el-dropdown-item>
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
      fit
      stripe
      style="width: 100%;"
      @selection-change="onSelectChange"
    >
      <el-table-column type="expand" fixed width="20px">
        <template slot-scope="props">
          <el-table
            :data="props.row.purchaseOrderDetailVoSet"
            style="width: 100%"
            class="inner-table-detail"
            border
          >
            <el-table-column
              label="订单明细信息"
              align="center"
              :render-header="(h, cos) => renderHeader(h, cos, props.row)"
            >
              <el-table-column label="编号" prop="detailId" align="center" />
              <el-table-column
                label="物料名称"
                prop="materialName"
                align="center"
              />
              <el-table-column label="采购数量" prop="count" align="center" />
              <el-table-column
                label="创建时间"
                prop="createTime"
                align="center"
                min-width="155px"
              />
              <el-table-column
                label="修改时间"
                prop="modifyTime"
                align="center"
                min-width="155px"
              />
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" align="center" width="40px" fixed />
      <el-table-column
        fixed
        type="index"
        width="30px"
        label="#"
      />

      <el-table-column
        prop="masterId"
        align="center"
        label="订单编号"
        min-width="80px"
      />
      <el-table-column
        prop="supplier"
        align="center"
        label="供应商"
        min-width="80px"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.supplier.supplierName }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalAmount"
        align="center"
        label="总金额"
        min-width="80px"
      />
      <el-table-column
        prop="freight"
        align="center"
        label="运费"
        min-width="80px"
      />
      <el-table-column
        prop="operator"
        align="center"
        label="操作员"
        min-width="80px"
      />

      <el-table-column prop="payStatusInfo" align="center" label="支付状态" />
      <el-table-column prop="purchaseCheckStatusInfo" align="center" label="采购审批状态" />
      <el-table-column prop="stockCheckStatusInfo" align="center" label="仓库审核状态" />
      <el-table-column prop="inStatusInfo" align="center" label="入库状态" />
      <el-table-column prop="finishStatusInfo" align="center" label="完成状态" />

      <!-- <el-table-column
        prop="payStatus"
        align="center"
        label="支付状态"
        min-width="80px"
        :formatter="(r, c) => (r.payStatus === 2 ? '已支付' : '未支付')"
      /> -->
      <el-table-column prop="payTypeInfo" label="支付类型" min-width="80px" />
      <el-table-column
        prop="purchaseDate"
        align="center"
        label="支付时间"
        min-width="155px"
      />

      <el-table-column
        label="备注"
        prop="remark"
        min-width="100px"
        align="center"
      />
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间"
        min-width="155px"
      />
      <el-table-column
        prop="modifyTime"
        align="center"
        label="修改时间"
        min-width="155px"
      />
      <el-table-column
        fixed="right"
        :label="$t('table.operation')"
        align="center"
        min-width="180px"
      >
        <template slot-scope="{ row }">
          <span class="btn-row">
            <el-button
              type="success"
              size="mini"
              round
              @click="toApplyCheck(row)"
            >审批申请</el-button>
            <el-button
              type="danger"
              size="mini"
              round
              @click.native="toRefund(row)"
            >退订</el-button>
          </span>
          <i
            class="el-icon-setting table-operation"
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
    <refund-form
      ref="refundForm"
      :dialog-visible="refundFormDialog.isVisible"
      :master-id="refundFormDialog.masterId"
      @success="search"
      @close="refundFormDialog.isVisible = false"
    />
  </div>
</template>

<script>
import {
  pagePurchaseOrderMasterApi,
  batchDeletePurchaseOrderMasterApi,
  toApplyCheckPurchaseOrderMasterApi
} from '@/api/pms'
import Pagination from '@/components/Pagination'
import PurchaseEdit from './edit'
import RefundForm from './refund-form'

export default {
  name: 'PurchaseManage',
  components: { Pagination, PurchaseEdit, RefundForm },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 5,
        createTimeFrom: null,
        createTimeTo: null
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
      refundFormDialog: { isVisible: false, masterId: null },
      selection: [],
      loading: false,
      tableKey: 0,
      queryCreateTimes: []
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
        h('span', '采购件数：' + row.purchaseOrderDetailVoSet.length)
      ])
    },
    fetch: function() {
      this.loading = true
      if (this.queryCreateTimes.length === 2) {
        this.query.createTimeFrom = this.queryCreateTimes[0]
        this.query.createTimeTo = this.queryCreateTimes[1]
      }
      const params = this.query
      pagePurchaseOrderMasterApi(params)
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
      this.queryCreateTimes = []
      this.query.createTimeFrom = null
      this.query.createTimeTo = null
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
      if (row.purchaseCheckStatus === 2) {
        this.$message({
          message: '包含已审核通过的订单，不允许修改',
          type: 'warning'
        })
        return
      }
      this.dialog.title = '编辑订单'
      const {
        masterId,
        supplier,
        payType,
        payStatus,
        freightPayStatus,
        freight,
        purchaseOrderDetailVoSet,
        remark
      } = row
      this.dialog.dto = {
        masterId,
        supplier,
        payType,
        payStatus,
        freightPayStatus,
        freight,
        purchaseOrderDetailVoSet,
        remark
      }
      this.dialog.isVisible = true
    },
    singleDelete: function(row) {
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete: function() {
      var canDelete = true
      this.selection.forEach(elm => {
        if (elm.purchaseCheckStatus === 2) {
          canDelete = false
        }
      })
      if (!canDelete) {
        this.$message({
          message: '包含已审核通过的订单，不允许删除',
          type: 'warning'
        })
        return
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
        batchDeletePurchaseOrderMasterApi(masterIds)
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
      console.log(this.selection)
    },
    /**
     * 行功能操作
     */
    toApplyCheck: function(row) {
      const masterId = row.masterId
      this.loading = true
      toApplyCheckPurchaseOrderMasterApi(masterId)
        .then(r => {
          this.$message({
            message: '申请成功',
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
    },
    toRefund: function(row) {
      this.refundFormDialog.isVisible = true
      this.refundFormDialog.masterId = row.masterId
      this.$refs.refundForm.setRow({ ...row })
    }
  }
}
</script>
<style>

.btn-row{
  margin-right: 8px;
  margin-left: 0px;
}

.el-button--mini.is-round {
  width: 41px;
  height: 21px;
  font-size: 10px;
  padding: 0px;
  margin-left: 0px;
  margin-right: 0px;
}

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
</style>
