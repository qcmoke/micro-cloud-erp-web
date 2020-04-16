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
        :label="$t('table.operation')"
        align="center"
        min-width="110px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-dropdown size="small" split-button type="primary">
            审核
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :disabled="row.purchaseCheckStatus == 1 || row.purchaseCheckStatusInfo === 4"
                @click.native="checkPass(row.masterId)"
              >审核通过</el-dropdown-item>
              <el-dropdown-item
                :disabled="row.purchaseCheckStatus == 1 || row.purchaseCheckStatus === 3"
                @click.native="checkFail(row.masterId)"
              >审核不通过</el-dropdown-item>
              <el-dropdown-item
                :disabled="row.purchaseCheckStatus != 4"
                @click.native="applyToStock(row.masterId)"
              >入库申请</el-dropdown-item>
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
  pagePurchaseOrderMasterApi,
  applyToStockApi,
  checkFailPurchaseOrderMasterApi,
  checkPassPurchaseOrderMasterApi
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
        isCheckRequest: true,
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
      this.query.createTimeFrom = this.queryCreateTimes[0]
      this.query.createTimeTo = this.queryCreateTimes[1]
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
    onSelectChange: function(selection) {
      this.selection = selection
    },
    tableRowClassName: function({ row, rowIndex }) {
      if (row.purchaseCheckStatus === 4) {
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
      checkFailPurchaseOrderMasterApi(masterId).then(r => {
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
      checkPassPurchaseOrderMasterApi(masterId).then(r => {
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
    applyToStock: function(masterId) {
      this.loading = true
      applyToStockApi(masterId)
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
