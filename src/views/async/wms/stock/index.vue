<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.itemNameKey"
        placeholder="货物名称"
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
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column prop="itemId" label="货物编号" min-width="60px" />
      <el-table-column prop="itemType" label="类型" min-width="60px" />
      <el-table-column prop="itemName" label="货物名称" min-width="160px" />
      <el-table-column prop="itemCount" label="库存量" min-width="120px" />
      <el-table-column prop="area" label="存放位置" min-width="120px" />
      <el-table-column prop="smax" label="最大库存量" min-width="120px" />
      <el-table-column prop="smin" label="安全库存量" min-width="120px" />
      <el-table-column prop="createTime" label="创建时间" min-width="160px" />
      <el-table-column prop="modifyTime" label="修改时间" min-width="160px" />
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
import { pageStockApi } from '@/api/wms'
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
        itemNameKey: null
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
      pageStockApi(params)
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
    edit: function(row) {
      this.dialog.title = '编辑'
      this.dialog.dto = { ...row }
      this.dialog.isVisible = true
    },
    reset: function() {
      this.query.itemNameKey = null
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    }
  }
}
</script>
<style lang="scss" scoped></style>
