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
      <el-table-column prop="masterId" label="订单编号" min-width="60px" />
      <el-table-column prop="supplier" label="供应商" min-width="60px">
        <template slot-scope="scope">
          <div>{{ scope.row.supplier.supplierName }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="总金额" min-width="60px" />
      <el-table-column
        prop="payType"
        label="支付类型"
        min-width="60px"
        :formatter="formatterPayType"
      />
      <el-table-column prop="purchaseDate" label="支付时间" min-width="150px" />
      <el-table-column
        prop="status"
        label="入库状态"
        min-width="100px"
        :formatter="formatterStatus"
      />
      <el-table-column prop="createTime" label="创建时间" min-width="150px" />
      <el-table-column prop="modifyTime" label="修改时间" min-width="150px" />
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        min-width="300px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            :disabled="row.status != 0"
            type="success"
            size="small"
            @click="toApplyStock(row)"
          >入库申请</el-button>
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
  </div>
</template>

<script>
import {
  pagePurchaseOrderMasterApi,
  batchDeletePurchaseOrderMasterApi,
  updatePurchaseOrderMasterApi
} from '@/api/pms'
import Pagination from '@/components/Pagination'
import PurchaseEdit from './edit'

export default {
  name: 'PurchaseManage',
  components: { Pagination, PurchaseEdit },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 5,
        status: 0,
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
    fetch: function() {
      this.loading = true
      const params = this.query
      pagePurchaseOrderMasterApi(params).then(r => {
        this.pageResult = r.data.data
      })
      this.loading = false
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
      this.dialog.title = this.$t('common.add')
      this.dialog.dto = {}
      this.dialog.isVisible = true
    },
    edit: function(row) {
      this.dialog.title = this.$t('common.edit')
      const { materialId, materialName, img, unit } = row
      this.dialog.dto = { materialId, materialName, img, unit }
      this.dialog.isVisible = true
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
        const materialIds = this.selection.map(row => row.materialId).join()
        this.loading = true
        batchDeletePurchaseOrderMasterApi(materialIds)
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
    formatterStatus: function(row, column) {
      switch (row.status) {
        case 4:
          return '审核通过并已入库'
        case 3:
          return '审核通过但未入库'
        case 2:
          return '审核不通过'
        case 1:
          return '已提交申请但未审核'
        case 0:
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
    /**
     * 行功能操作
     */
    toApplyStock: function(row) {
      const masterId = row.masterId
      this.loading = true
      updatePurchaseOrderMasterApi({ masterId: masterId, status: 1 })
        .then(r => {
          this.$message({
            message: '入库成功',
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
