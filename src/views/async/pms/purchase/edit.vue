<template>
  <el-dialog
    width="67%"
    :title="title"
    top="20px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <div>

      <el-form
        ref="postForm"
        :model="postForm"
        :rules="rules"
        size="mini"
        status-icon
      >
        <el-form-item label="订单总额" prop="Amount">
          <el-input v-model.number="postForm.Amount" type="number" />
        </el-form-item>
        <el-form-item label="备注" prop="Remarks">
          <el-input v-model="postForm.Remarks" />
        </el-form-item>
      </el-form>

      <el-select
        v-model="selectValue"
        filterable
        clearable
        placeholder="请选择"
        size="mini"
        @change="selectChange"
      >
        <el-option
          v-for="item in options"
          :key="item.ID"
          :label="item.Name"
          :value="item"
          :disabled="item.Disabled"
        />
      </el-select>
      <el-table :data="commodities" style="width: 100%">
        <el-table-column label="ID" prop="ID" />
        <el-table-column label="名称" prop="Name" />
        <el-table-column label="颜色" prop="Colour" />
        <el-table-column label="尺寸" prop="Size" />
        <el-table-column label="品牌" prop="Brand" />
        <el-table-column label="数量" width="150">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.Quantity" :min="0" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button
        :loading="loading"
        type="primary"
        size="mini"
        @click="submitForm"
      >提交</el-button>
      <el-button size="mini" @click="resetForm">重置</el-button>
      <el-button
        type="warning"
        plain
        :loading="buttonLoading"
        @click="isVisible = false"
      >
        {{ $t("common.cancel") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getAllSuppliers } from '@/api/pms'
export default {
  name: 'MaterialEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    dto: {
      type: Object,
      default: () => ({
        materialId: null,
        materialName: null,
        img: null,
        unit: null,
        createTime: null,
        modifyTime: null,
        deleteStatus: null
      })
    }
  },
  data() {
    return {
      // material的数据由父组件决定
      purchaseOrderMaster: {},
      loading: false,
      selectValue: '',
      options: [],
      commodities: [],
      postForm: {
        Amount: null,
        Remarks: '',
        Goods: []
      },
      rules: {
        Amount: [{ required: true, message: '请输入', trigger: 'blur' }],
        Remarks: [{ max: 255, message: '最多255  个字符', trigger: 'blur' }]
      }
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
        this.purchaseOrderMaster = { ...n }
      },
      deep: true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    initSuppliers: function() {
      getAllSuppliers(r => {
        this.suppliers = r.data.data
      })
    },
    close: function() {
      this.$emit('close')
    },
    fetchData() {
      this.options = [
        {
          Quantity: 0,
          ID: '111',
          Name: 'MKBL',
          Colour: 'MKBL',
          Size: 'MKBL-2285AS',
          Brand: 'MKBL-2285AS',
          Number: 1,
          PresaleNumber: 1,
          SalesVolume: 1,
          Price: 1,
          PurchasePrice: 0
        },
        {
          Quantity: 0,
          ID: '222',
          Name: '玉米种',
          Colour: '绿色',
          Size: '呼呼',
          Brand: '于海波',
          Number: 16,
          PresaleNumber: 3,
          SalesVolume: 2,
          Price: 100,
          PurchasePrice: 0
        },
        {
          Quantity: 0,
          ID: '333',
          Name: '蘑菇头',
          Colour: '绿色',
          Size: '呼呼',
          Brand: '于海波',
          Number: 16,
          PresaleNumber: 3,
          SalesVolume: 2,
          Price: 100,
          PurchasePrice: 0
        }
      ]
    },
    submitForm() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          const len = this.commodities.length
          if (len <= 0) {
            this.$message.error('请添加商品')
            return
          }
          for (let i = 0; i < len; i++) {
            if (this.commodities[i].Quantity <= 0) {
              this.$message.error('商品数量不能为 0')
              this.postForm.Goods = []
              return
            }
            this.postForm.Goods.push({
              ID: this.commodities[i].ID,
              Number: this.commodities[i].Quantity
            })
          }

          console.log(this.postForm)
          this.loading = true
          /**
           *
           */
          this.loading = false
        }
      })
    },
    selectChange() {
      if (this.selectValue !== '') {
        this.selectValue.Disabled = true
        this.commodities.push(this.selectValue)
        this.selectValue = ''
      }
    },
    handleDelete(index, row) {
      this.commodities.splice(index, 1)
      row.Disabled = false
    },
    resetForm() {
      this.postForm.Amount = null
      this.postForm.Remarks = ''
      this.postForm.Goods = []
      for (let i = 0; i < this.commodities.length; i++) {
        this.commodities[i].Disabled = false
      }

      this.commodities = []
    }
  }
}
</script>
<style lang="scss" scoped></style>
