<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.masterId"
        placeholder="订单编号"
        class="filter-item search-item"
      />
      <el-button class="filter-item" type="primary" plain @click="search">
        {{ $t("table.search") }}
      </el-button>
      <el-button class="filter-item" type="warning" plain @click="reset">
        {{ $t("table.reset") }}
      </el-button>
    </div>

    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      :data="pageResult.rows"
      fit
      style="width: 100%;"
      :row-class-name="tableRowClassName"
      @selection-change="onSelectChange"
    >
      <el-table-column type="expand">
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
              <el-table-column
                label="编号"
                prop="detailId"
                align="center"
              />
              <el-table-column
                label="物料名称"
                prop="materialName"
                align="center"
              />
              <el-table-column label="采购数量" prop="count" align="center" />
              <el-table-column label="备注" prop="remark" align="center" />
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
      <el-table-column type="selection" align="center" width="40px" />
      <el-table-column prop="masterId" label="订单编号" min-width="60px" />
      <el-table-column prop="supplier" label="供应商" min-width="60px">
        <template slot-scope="scope">
          <div>{{ scope.row.supplier.supplierName }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalAmount"
        label="总金额"
        min-width="60px"
        align="center"
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
      <el-table-column
        prop="payStatus"
        align="center"
        label="支付状态"
        min-width="80px"
        :formatter="(r, c) => (r.payStatus === 2 ? '已支付' : '未支付')"
      />
      <el-table-column
        prop="payType"
        label="支付类型"
        min-width="80px"
        :formatter="formatterPayType"
      />
      <el-table-column prop="purchaseDate" label="支付时间" min-width="155px" />
      <el-table-column
        prop="status"
        label="审核状态"
        min-width="100px"
        :formatter="formatterStatus"
      />
      <el-table-column
        prop="transferStockStatus"
        label="移交状态"
        min-width="100px"
        align="center"
        :formatter="
          (r, c) =>
            r.transferStockStatus === 4
              ? '已完成移交'
              : r.transferStockStatus === 3
                ? '移交失败'
                : r.transferStockStatus === 2
                  ? '已移交申请'
                  : '未移交'
        "
      />
      <el-table-column prop="createTime" label="创建时间" min-width="155px" />
      <el-table-column prop="modifyTime" label="修改时间" min-width="155px" />
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        min-width="300px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-dropdown size="small" split-button type="primary">
            审核
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :disabled="row.status == 1 || row.status === 4"
                @click.native="checkPass(row.masterId)"
              >审核通过</el-dropdown-item>
              <el-dropdown-item
                :disabled="row.status == 1 || row.status === 3"
                @click.native="checkFail(row.masterId)"
              >审核不通过</el-dropdown-item>
              <el-dropdown-item
                :disabled="row.status != 4"
                @click.native="transferToStock(row.masterId)"
              >移交仓库</el-dropdown-item>
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
  </div>
</template>

<script>
import {
  pagePurchaseOrderMasterForAddStockApi,
  transferToStockApi,
  updatePurchaseOrderMasterApi
} from '@/api/pms'
import Pagination from '@/components/Pagination'

export default {
  name: 'PurchaseManage',
  components: { Pagination },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 5,
        masterId: null
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
        h('span', '采购件数：' + row.purchaseOrderDetailVoSet.length)
      ])
    },
    fetch: function() {
      this.loading = true
      const params = this.query
      pagePurchaseOrderMasterForAddStockApi(params)
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
      this.query.masterId = null
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    onSelectChange: function(selection) {
      this.selection = selection
    },
    formatterStatus: function(row, column) {
      switch (row.status) {
        case 4:
          return '审核通过'
        case 3:
          return '审核不通过'
        case 2:
          return '已提交申请但未审核'
        case 1:
          return '未提交入库申请'
        default:
          return row.status
      }
    },
    formatterPayType: function(row, column) {
      switch (row.payType) {
        case 1:
          return '支付宝'
        case 2:
          return '微信'
        case 3:
          return '银联'
        case 4:
          return '货到付款'
        default:
          break
      }
      return row.payType
    },
    tableRowClassName: function({ row, rowIndex }) {
      if (row.status === 4) {
        return 'success-row'
      } else {
        return 'warning-row'
      }
    },
    /**
     * 行功能操作
     */
    checkFail: function(masterId) {
      this.loading = true
      updatePurchaseOrderMasterApi({
        masterId: masterId,
        status: 3
      }).then(r => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.loading = false
        this.$refs.table.clearSelection()
        this.search()
      }).catch(_ => {
        this.loading = false
      })
    },
    checkPass: function(masterId) {
      this.loading = true
      updatePurchaseOrderMasterApi({
        masterId: masterId,
        status: 4
      }).then(r => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.loading = false
        this.$refs.table.clearSelection()
        this.search()
      }).catch(_ => {
        this.loading = false
      })
    },
    transferToStock: function(masterId) {
      this.loading = true
      transferToStockApi(masterId)
        .then(r => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.loading = false
          this.$refs.table.clearSelection()
          this.search()
        })
        .catch(_ => {
          this.loading = false
        })
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
</style>
