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
      style="width: 100%;"
      @selection-change="onSelectChange"
    >
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column
        prop="stockItemId"
        label="出入库编号"
        min-width="150px"
      />
      <el-table-column
        prop="stockTypeInfo"
        label="出入库类型"
        min-width="100px"
      />
      <el-table-column prop="orderId" label="订单编号" min-width="150px" />
      <el-table-column prop="makeDate" label="出入库时间" min-width="150px" />
      <el-table-column prop="itemTypeInfo" label="货物类型" min-width="100px" />
      <el-table-column
        prop="applyUserName"
        label="移交用户"
        min-width="100px"
      />
      <el-table-column
        prop="checkStatusInfo"
        label="审核状态"
        min-width="100px"
      />
      <el-table-column
        prop="finishStatusInfo"
        label="完成状态"
        min-width="100px"
      />
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        min-width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">

          <i
            class="el-icon-view table-operation"
            style="color: #2db7f5;"
            @click="viewDetails(row)"
          />

          <el-dropdown
            split-button
            size="small"
            :type="
              row.finishStatus === FINISH_TYPE.NO_FINISHED ? 'primary' : 'info'
            "
          >
            审核
            <el-dropdown-menu slot="dropdown">
              <template v-if="row.finishStatus === FINISH_TYPE.NO_FINISHED">
                <el-dropdown-item
                  :disabled="row.checkStatus === CHECK_TYPE.PASS"
                  @click.native="checkPass(row)"
                >审核通过</el-dropdown-item>
                <el-dropdown-item
                  :disabled="row.checkStatus === CHECK_TYPE.NO_PASS"
                  @click.native="checkFail(row)"
                >审核不通过</el-dropdown-item>
                <el-dropdown-item
                  v-if="
                    row.checkStatus === CHECK_TYPE.PASS &&
                      (row.stockType === STOCK_TYPE.PURCHASE_IN ||
                      row.stockType === STOCK_TYPE.SALE_IN)
                  "
                  divided
                  @click.native="addItemToStock(row)"
                >收货入库</el-dropdown-item>
                <el-dropdown-item
                  v-if="
                    row.checkStatus === CHECK_TYPE.PASS &&
                      (row.stockType === STOCK_TYPE.SALE_OUT ||
                      row.stockType === STOCK_TYPE.PURCHASE_OUT)
                  "
                  divided
                  @click.native="outItemFromStock(row)"
                >发货出库</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
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
    <ship
      :dto="deliveryDrawer.dto"
      :delivery-visible="deliveryDrawer.isVisible"
      @success="search"
      @close="
        () => {
          deliveryDrawer.isVisible = false;
        }
      "
    />
    <detail
      :dialog-visible="detailDialog.isVisible"
      :dto="detailDialog.dto"
      @close="detailDialog.isVisible = false"
    />
  </div>
</template>

<script>
import {
  pageApi,
  checkPassApi,
  checkFailApi,
  addItemToStockApi,
  // outItemFromStockApi,
  batchDeleteMaterialRefundApi
} from '@/api/wms'
import Pagination from '@/components/Pagination'
import ship from './ship'
import detail from './detail'
export default {
  name: 'StockItemManage',
  components: { Pagination, ship, detail },
  data() {
    return {
      STOCK_TYPE: {
        PURCHASE_IN: 1, // 采购入库
        SALE_OUT: 2, // 销售出库
        PURCHASE_OUT: 3, // 采购退货出库
        SALE_IN: 4 // 销售退货入库
      },
      CHECK_TYPE: {
        NO_REVIEWED: 1, // 未审核
        NO_PASS: 2, // 审核不通过
        PASS: 3 // 审核通过
      },
      FINISH_TYPE: {
        NO_FINISHED: 1, // 未完成
        FINISHED: 2 // 已完成
      },
      query: {
        pageNum: 1,
        pageSize: 5,
        materialName: null
      },
      pageResult: {
        row: [],
        total: 10
      },
      selection: [],
      loading: false,
      tableKey: 0,
      deliveryDrawer: {
        isVisible: false,
        dto: {}
      },
      detailDialog: {
        isVisible: false,
        title: '',
        dto: []
      }
    }
  },
  computed: {},
  mounted() {
    this.fetch()
  },
  methods: {
    fetch: function() {
      this.loading = true
      const params = this.query
      pageApi(params)
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
    singleDelete: function(row) {
      this.$refs.table.toggleRowSelection(row, true)
      this.batchDelete()
    },
    batchDelete: function() {
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
        const stockItemIds = this.selection.map(row => row.stockItemId).join()
        this.loading = true
        batchDeleteMaterialRefundApi(stockItemIds)
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
    checkFail: function(row) {
      checkFailApi({ stockItemId: row.stockItemId }).then(r => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.search()
      })
    },
    checkPass: function(row) {
      checkPassApi({ stockItemId: row.stockItemId }).then(r => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.search()
      })
    },
    addItemToStock: function(row) {
      this.loading = true
      addItemToStockApi([row.stockItemId]).then(r => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.search()
        this.loading = false
      })
      this.loading = false
    },
    outItemFromStock: function(row) {
      this.deliveryDrawer.isVisible = true
      this.deliveryDrawer.dto = { ...row }
    },
    viewDetails: function(row) {
      this.detailDialog.dto = [...row.stockItemDetailVos]
      this.detailDialog.isVisible = true
    }
  }
}
</script>
<style lang="scss" scoped></style>
