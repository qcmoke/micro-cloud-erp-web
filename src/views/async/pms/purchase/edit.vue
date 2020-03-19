<template>
  <el-dialog
    width="67%"
    :title="title"
    top="20px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form
      ref="postForm2"
      :model="postForm"
      :rules="rules"
      size="mini"
      label-position="right"
      status-icon
    >
      <el-form-item label="选择供应商" label-width="100px" prop="supplierId">
        <el-select
          v-model="postForm.supplierId"
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="item in allSuppliers"
            :key="item.supplierId"
            :label="item.supplierName"
            :value="item.supplierId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="添加采购物料" label-width="100px">
        <el-select
          v-model="selectValue"
          filterable
          clearable
          placeholder="请选择物料"
          size="mini"
          @change="selectChange"
        >
          <el-option
            v-for="item in allMaterials"
            :key="item.materialId"
            :label="item.materialName"
            :value="item"
            :disabled="item.disabled"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-table :data="tableDetails" style="width: 100%" border>
      <el-table-column label="ID" prop="materialId" align="center" />
      <el-table-column label="物料名称" prop="materialName" align="center" />
      <el-table-column label="图片" prop="img" align="center">
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
      <el-table-column label="单位" prop="unit" align="center" />
      <el-table-column label="规格" prop="standard" align="center" />
      <el-table-column label="采购单价" prop="price" align="center" />
      <el-table-column label="数量" width="160" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.count" :min="0" size="mini" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
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
    <div>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="14">
          <el-card shadow="always">
            <span>采购件数： {{ amounCount }}</span>
            <span>总金额： {{ amounTotal }}</span>
            <el-form
              ref="postForm"
              :model="postForm"
              :rules="rules"
              label-position="left"
              size="mini"
              status-icon
            >
              <el-form-item label="订单支付状态">
                <el-switch
                  v-model="postForm.orderIsPaid"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-form-item>
              <el-form-item label="运费支付状态">
                <el-switch
                  v-model="postForm.freightIsPaid"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-form-item>
              <el-form-item label="订单支付类型" label-width="100px">
                <el-select
                  v-model="postForm.payType"
                  placeholder="请选择"
                  size="mini"
                  :disabled="!postForm.orderIsPaid"
                >
                  <el-option
                    v-for="item in [
                      { key: 1, name: '支付宝' },
                      { key: 2, name: '微信' },
                      { key: 3, name: '银联' },
                      { key: 4, name: '货到付款' }
                    ]"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="运费" label-width="100px">
                <el-input
                  v-model="postForm.freight"
                  size="mini"
                  style="width: 185px;"
                  :disabled="!postForm.freightIsPaid"
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark" label-width="100px">
                <el-input v-model="postForm.remark" />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
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
        size="mini"
        :loading="loading"
        @click="isVisible = false"
      >
        {{ $t("common.cancel") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  getAllSuppliersApi,
  getAllMaterialsApi,
  createOrUpdatePurchaseOrderApi
} from '@/api/pms'
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
        masterId: '',
        supplier: {},
        payType: null,
        payStatus: false,
        freightPayStatus: false,
        freight: null,
        purchaseOrderDetailVoSet: [],
        remark: ''
      })
    }
  },
  data() {
    return {
      loading: false,
      selectValue: '',
      options: [],
      allMaterials: [],
      allSuppliers: [],
      tableDetails: [],
      amounTotal: 0,
      amounCount: 0,
      postForm: this.initPostForm(),
      rules: {
        remark: [{ max: 255, message: '最多255  个字符', trigger: 'blur' }],
        supplierId: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'change'
        }
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
    // 监控订单明细，并计算出其总金额
    tableDetails: {
      handler(n, o) {
        this.amounTotal = 0
        this.amounCount = 0
        if (!n || !n.length || n.length <= 0) {
          return
        }
        this.amounCount = n.length
        n.forEach(good => {
          this.amounTotal += good.price * good.count
        })
      },
      deep: true
    },
    dto: {
      handler(dtoInfo, o) {
        // Object.assign(target,…sources) 有相同的key时，在target对象中的值会被后面source对象的值覆盖
        Object.assign(this.postForm, { ...dtoInfo })
        this.postForm.orderIsPaid = dtoInfo.payStatus === 2
        this.postForm.freightIsPaid = dtoInfo.freightPayStatus === 2
        const purchaseOrderDetailVoSet = dtoInfo.purchaseOrderDetailVoSet
        if (purchaseOrderDetailVoSet) {
          this.tableDetails = purchaseOrderDetailVoSet.map(detailVo => {
            // 让列表物料与明细物料相同id的，让其不可选
            this.setMaterialBeDisable(true, detailVo.materialId)
            // 将订单明细返回给tableDetails，从而渲染到表格中
            return {
              ...detailVo.material,
              count: detailVo.count,
              detailId: detailVo.detailId
            }
          })
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initAllSuppliers()
    this.initAllMaterials()
  },
  methods: {
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v.count) === arr.lastIndexOf(v.count)
      })
    },
    initAllSuppliers: function() {
      getAllSuppliersApi()
        .then(r => {
          this.allSuppliers = r.data.data
        })
        .catch(e => {
          console.error('获取供应商列表失败', e)
        })
    },
    close: function() {
      this.resetForm()
      this.$emit('close')
    },
    initAllMaterials: function() {
      getAllMaterialsApi()
        .then(r => {
          this.allMaterials = r.data.data.map(item => {
            return {
              count: 0,
              materialId: item.materialId,
              materialName: item.materialName,
              img: item.img,
              unit: item.unit,
              standard: item.standard,
              price: item.price
            }
          })
        })
        .catch(e => {
          console.error('获取物料列表失败')
        })
    },
    submitForm: function() {
      this.$refs['postForm'].validate(v1 => {
        if (!v1) {
          return
        }
        this.$refs.postForm2.validate(v2 => {
          if (!v2) {
            return
          }
          const len = this.tableDetails.length
          if (len <= 0) {
            this.$message.error('请添加物料')
            return
          }
          for (let i = 0; i < len; i++) {
            if (this.tableDetails[i].count <= 0) {
              this.$message.error('物料数量不能为 0')
              this.postForm.purchaseOrderDetailList = []
              return
            }
            this.postForm.purchaseOrderDetailList.push({
              detailId: this.tableDetails[i].detailId,
              materialId: this.tableDetails[i].materialId,
              count: this.tableDetails[i].count
            })
          }
          this.loading = true
          createOrUpdatePurchaseOrderApi(this.postForm)
            .then(r => {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.loading = false
              this.$emit('success')
              this.close()
            })
            .catch(e => {
              this.loading = false
            })
        })
      })
    },
    selectChange() {
      if (this.selectValue !== '') {
        // 让选中的物料不可再选
        this.selectValue.disabled = true
        // 渲染到列表中
        this.tableDetails.push(this.selectValue)
        this.selectValue = ''
      }
    },
    handleDelete(index, row) {
      // 让删除掉表格中的明细，并让其对应的物料重新可选
      this.tableDetails.splice(index, 1)
      this.setMaterialBeDisable(false, row.materialId)
    },
    // 让明细中物料id对应的物料选择列表重新可选。如果不传id，那么全部重新可选
    setMaterialBeDisable: function(flag, id) {
      if (id) {
        this.allMaterials.forEach(elm => {
          if (id === elm.materialId) {
            elm.disabled = flag
          }
        })
      } else {
        this.allMaterials.forEach(elm => {
          elm.disabled = flag
        })
      }
    },
    resetForm: function() {
      // 让物料列表所有物料重新可选
      this.setMaterialBeDisable(false)
      this.tableDetails.forEach(elm => {
        elm.count = 0
      })
      this.tableDetails = []
      this.amounTotal = 0
      this.amounCount = 0
      this.postForm = this.initPostForm()
    },
    initPostForm: function() {
      return {
        masterId: null,
        remark: '',
        purchaseOrderDetailList: [],
        supplierId: null,
        payType: null,
        freight: null,
        freightIsPaid: false,
        orderIsPaid: false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card {
  margin-top: 30px;
  form.el-form {
    margin-top: 20px;
  }
}
</style>
