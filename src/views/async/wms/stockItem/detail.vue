<template>
  <el-dialog
    width="65%"
    title="出入明细详情"
    top="20px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    center
  >
    <div id="edit-dialog">
      <el-table :data="tableDetails" style="width: 100%;margin-top:10px">
        <el-table-column label="明细编号" prop="stockItemDetailId" align="center" />
        <el-table-column label="货物编号" prop="itemId" align="center" />
        <el-table-column label="货物名称" prop="itemName" align="center" />
        <el-table-column label="数量" prop="itemNum" align="center" />
        <el-table-column label="货物图片" prop="img" align="center">
          <template
            v-if="scope.row.img && scope.row.img != ''"
            slot-scope="scope"
          >
            <el-image
              style="width: 50px;"
              :src="scope.row.img"
              :alt="scope.row.itemName"
              :preview-src-list="[scope.row.img]"
            />
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="unit" align="center" />
        <el-table-column label="规格" prop="standard" align="center" />
      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button
        type="warning"
        size="mini"
        @click="isVisible = false"
      >
        {{ $t("common.cancel") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'MaterialEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    dto: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      tableDetails: []
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
      }
    }
  },
  watch: {
    dto: {
      handler(n, o) {
        console.log(n)
        this.tableDetails = [...n]
      },
      deep: true
    }
  },
  methods: {
    close: function() {
      this.$emit('close')
    }

  }
}
</script>
