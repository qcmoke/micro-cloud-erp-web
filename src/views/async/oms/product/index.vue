<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.productName"
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
          <el-dropdown-item @click.native="exportExcel">初始化商品库存</el-dropdown-item>
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
      <el-table-column prop="productId" label="编号" min-width="60px" />
      <el-table-column prop="productName" label="产品名称" min-width="60px" />
      <el-table-column prop="img" label="图片" min-width="50px">
        <template
          v-if="scope.row.img && scope.row.img != ''"
          slot-scope="scope"
        >
          <el-image
            style="width: 50px;"
            :src="scope.row.img"
            :alt="scope.row.productName"
            :preview-src-list="[scope.row.img]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="approveId" label="批准文号" min-width="120px" />
      <el-table-column prop="batchId" label="生产批号" min-width="120px" />
      <el-table-column prop="price" label="销售单价(零售价)" min-width="120px" />
      <el-table-column prop="space" label="商品产地" min-width="120px" />
      <el-table-column prop="unit" label="单位" min-width="160px" />
      <el-table-column prop="standard" label="规格" min-width="160px" />
      <el-table-column prop="safetyStock" label="安全库存" min-width="120px" />
      <el-table-column
        :label="$t('table.operation')"
        align="center"
        min-width="150px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
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

    <edit-form
      :dialog-visible="dialog.isVisible"
      :dto="dialog.dto"
      @success="search"
      @close="dialog.isVisible = false"
    />
  </div>
</template>

<script>
import { pageProductApi, batchDeleteProductApi } from '@/api/oms'
import Pagination from '@/components/Pagination'
import editForm from './edit'

export default {
  name: 'StockItemManage',
  components: { Pagination, editForm },
  data() {
    return {
      query: {
        pageNum: 1,
        pageSize: 5,
        productName: null
      },
      pageResult: {
        row: [],
        total: 10
      },
      selection: [],
      loading: false,
      tableKey: 0,
      dialog: {
        isVisible: false,
        title: '',
        dto: {}
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
      pageProductApi(params)
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
    add: function() {
      this.dialog.title = this.$t('common.add')
      this.dialog.dto = {}
      this.dialog.isVisible = true
    },
    edit: function(row) {
      this.dialog.title = '编辑'
      this.dialog.dto = { ...row }
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
        const productIds = this.selection.map(row => row.productId).join()
        this.loading = true
        batchDeleteProductApi(productIds)
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
    reset: function() {
      this.query.productName = null
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    exportExcel: function() {},
    onSelectChange: function(selection) {
      this.selection = selection
    }
  }
}
</script>
<style lang="scss" scoped></style>
