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
      <el-table-column prop="materialId" label="编号" min-width="60px" />
      <el-table-column prop="materialName" label="名称" min-width="150px" />
      <el-table-column prop="img" label="图片" min-width="50px">
        <template
          v-if="scope.row.img && scope.row.img != ''"
          slot-scope="scope"
        >
          <el-image
            style="width: 50px;"
            :src="scope.row.img"
            :alt="scope.row.materialName"
            :preview-src-list="[scope.row.img]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" min-width="50px" />
      <el-table-column prop="unit" label="单位" min-width="50px" />
      <el-table-column prop="standard" label="规格" min-width="50px" />
      <el-table-column prop="safetyStock" label="安全库存量" min-width="80px" />
      <el-table-column prop="createTime" label="创建时间" min-width="150px" />
      <el-table-column prop="modifyTime" label="修改时间" min-width="150px" />
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
    <material-edit
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
import { pageMaterialApi, batchDeleteMaterialApi } from '@/api/pms'
import Pagination from '@/components/Pagination'
import MaterialEdit from './edit'

export default {
  name: 'MaterielManage',
  components: { Pagination, MaterialEdit },
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
      pageMaterialApi(params).then(r => {
        this.pageResult = r.data.data
        this.loading = false
      }).catch(e => {
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
      this.dialog.title = this.$t('common.add')
      this.dialog.dto = {}
      this.dialog.isVisible = true
    },
    edit: function(row) {
      this.dialog.title = this.$t('common.edit')
      const { materialId, materialName, img, unit, standard, price, safetyStock } = row
      this.dialog.dto = { materialId, materialName, img, unit, standard, price, safetyStock }
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
        batchDeleteMaterialApi(materialIds)
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
    }
  }
}
</script>
<style lang="scss" scoped></style>
