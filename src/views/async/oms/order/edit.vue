<template>
  <el-dialog
    width="65%"
    :title="title"
    top="20px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
    center
  >
    <div id="edit-dialog">
      <el-select
        v-model="selectValue"
        filterable
        clearable
        placeholder="请选择产品"
        size="mini"
        @change="selectChange"
      >
        <el-option
          v-for="item in allProducts"
          :key="item.productId"
          :label="item.productName"
          :value="item"
          :disabled="item.disabled"
        />
      </el-select>
      <el-table :data="tableDetails" style="width: 100%;margin-top:10px">
        <el-table-column label="ID" prop="productId" align="center" />
        <el-table-column label="产品名称" prop="productName" align="center" />
        <el-table-column label="图片" prop="img" align="center">
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
        <el-table-column label="单位" prop="unit" align="center" />
        <el-table-column label="规格" prop="standard" align="center" />
        <el-table-column label="销售单价" prop="price" align="center" />
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
    </div>
    <div style="margin-top:20px">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="18">
          <el-card shadow="always">
            <el-form
              ref="postForm"
              :model="postForm"
              :rules="rules"
              size="mini"
              label-position="right"
              label-width="130px"
              status-icon
            >
              <el-form-item label="选择客户" prop="customerId">
                <el-select v-model="postForm.customerId" placeholder="请选择">
                  <el-option
                    v-for="item in allCustomers"
                    :key="item.customerId"
                    :label="item.customerName"
                    :value="item.customerId"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="支付状态" prop="isPayStatus">
                <el-switch
                  v-model="postForm.isPayStatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-form-item>
              <el-form-item
                v-if="postForm.isPayStatus"
                label="支付类型"
                prop="payType"
              >
                <el-select
                  v-model="postForm.payType"
                  placeholder="请选择"
                  size="mini"
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
              <el-form-item
                v-if="postForm.isPayStatus"
                label="发票类型"
                prop="billType"
              >
                <el-select
                  v-model="postForm.billType"
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option
                    v-for="item in [
                      { key: 1, name: '不开发票' },
                      { key: 2, name: '电子发票' },
                      { key: 3, name: '纸质发票' }
                    ]"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="
                  postForm.isPayStatus &&
                    (postForm.billType === 2 || postForm.billType === 3)
                "
                label="发票内容"
                prop="billContent"
              >
                <el-input v-model="postForm.billContent" />
              </el-form-item>
              <el-form-item label="订单金额" prop="totalAmount">
                <el-input v-model.number="postForm.totalAmount" />
              </el-form-item>
              <el-form-item
                v-if="postForm.isPayStatus"
                label="运输费用"
                prop="freightAmount"
              >
                <el-input v-model.number="postForm.freightAmount" />
              </el-form-item>
              <el-form-item label="收货人姓名" prop="receiverName">
                <el-input v-model="postForm.receiverName" />
              </el-form-item>
              <el-form-item label="收货人电话" prop="receiverPhone">
                <el-input v-model="postForm.receiverPhone" />
              </el-form-item>
              <el-form-item label="收货人地址" prop="receiverDetailAddress">
                <el-input v-model="postForm.receiverDetailAddress" />
              </el-form-item>
              <el-form-item label="订单备注" prop="remark">
                <el-input v-model="postForm.remark" />
              </el-form-item>
            </el-form>
            <el-row type="flex" class="row-bg" justify="end">
              <el-col :span="8">
                <div>件数： {{ amounCount }}</div>
                <div style="margin-top:10px">
                  总计(含运费)：
                  {{ postForm.totalAmount + postForm.freightAmount }}
                </div>
              </el-col>
            </el-row>
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
  getallCustomersApi,
  getallProductsApi,
  createOrUpdateSaleOrderApi
} from '@/api/oms'
import { validMobile } from '@/utils/my-validate'
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
      default: () => this.initPostForm()
    }
  },
  data() {
    return {
      loading: false,
      selectValue: '',
      options: [],
      allProducts: [],
      allCustomers: [],
      tableDetails: [],
      amounCount: 0,
      postForm: this.initPostForm(),
      rules: this.initRules()
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
    'postForm.isPayStatus': function(n, o) {
      if (!n) {
        this.postForm.payType = null
        this.postForm.freightAmount = null
        this.postForm.billType = null
        this.postForm.billContent = null
      }
    },
    // 监控订单明细，并计算出其总金额
    tableDetails: {
      handler(n, o) {
        this.postForm.totalAmount = 0
        this.amounCount = 0
        if (!n || !n.length || n.length <= 0) {
          return
        }
        this.amounCount = n.length
        n.forEach(good => {
          this.postForm.totalAmount += good.price * good.count
        })
      },
      deep: true
    },
    dto: {
      handler(dtoInfo, o) {
        // Object.assign(target,…sources) 有相同的key时，在target对象中的值会被后面source对象的值覆盖
        Object.assign(this.postForm, { ...dtoInfo })
        const details = dtoInfo.details
        this.postForm.isPayStatus = dtoInfo.status === 2
        if (details) {
          this.tableDetails = details.map(detailVo => {
            // 让列表产品与明细产品相同id的，让其不可选
            this.setMaterialBeDisable(true, detailVo.productId)
            // 将订单明细返回给tableDetails，从而渲染到表格中
            return {
              ...detailVo.product,
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
    this.initallCustomers()
    this.initallProducts()
  },
  methods: {
    initPostForm: function() {
      return {
        totalAmount: 0,
        status: null,
        isPayStatus: false,
        details: [],
        billType: null,
        payType: null,
        masterId: null,
        remark: null,
        customerId: null,
        freightAmount: null,
        deliveryTime: null,
        receiveTime: null,
        receiverName: null,
        receiverPhone: null,
        receiverDetailAddress: null,
        billContent: null
      }
    },
    initallProducts: function() {
      getallProductsApi()
        .then(r => {
          this.allProducts = r.data.data.map(item => {
            return {
              count: 0,
              productId: item.productId,
              productName: item.productName,
              img: item.img,
              unit: item.unit,
              standard: item.standard,
              price: item.price
            }
          })
        })
        .catch(e => {
          console.error('获取产品列表失败')
        })
    },
    submitForm: function() {
      this.$refs['postForm'].validate(v1 => {
        if (!v1) {
          return
        }
        this.postForm.details = this.getDetailsFromTableDetails()
        // eslint-disable-next-line no-unused-vars
        const { createTime, modifyTime, deleteStatus, ...data } = this.postForm
        this.loading = true
        createOrUpdateSaleOrderApi(data)
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
    },
    getDetailsFromTableDetails: function() {
      const tableDatas = [...this.tableDetails]
      if (tableDatas.length <= 0) {
        this.$message.error('请添加产品')
        return
      }
      let arr = []
      for (let i = 0; i < tableDatas.length; i++) {
        if (this.tableDetails[i].count <= 0) {
          this.$message.error('产品数量不能为 0')
          arr = []
          return
        }
        arr.push({
          detailId: this.tableDetails[i].detailId,
          productId: this.tableDetails[i].productId,
          count: this.tableDetails[i].count
        })
      }

      return arr
    },
    // 清空表格,如果给定行则让其行的数量为0，如果不给定，则清空所有
    resetTable: function(elm) {
      if (elm) {
        elm.count = 0
        return
      }
      this.tableDetails.forEach((elm, index) => {
        elm.count = 0
      })
      this.tableDetails = []
    },
    resetForm: function() {
      // 让产品列表所有产品重新可选
      this.setMaterialBeDisable(false)
      this.resetTable()
      this.postForm.totalAmount = 0
      this.amounCount = 0
      this.postForm = this.initPostForm()
    },
    initallCustomers: function() {
      getallCustomersApi()
        .then(r => {
          this.allCustomers = r.data.data
        })
        .catch(e => {
          console.error('获取客户列表失败', e)
        })
    },
    close: function() {
      this.resetForm()
      this.$emit('close')
    },
    selectChange() {
      if (this.selectValue !== '') {
        // 让选中的产品不可再选
        this.selectValue.disabled = true
        // 渲染到列表中
        this.tableDetails.push(this.selectValue)
        this.selectValue = ''
      }
    },
    handleDelete(index, row) {
      // 让删除掉表格中的明细，并让其对应的产品重新可选
      this.resetTable(row)
      this.tableDetails.splice(index, 1)
      this.setMaterialBeDisable(false, row.productId)
    },
    // 让明细中产品id对应的产品选择列表重新可选。如果不传id，那么全部重新可选
    setMaterialBeDisable: function(flag, id) {
      if (id) {
        this.allProducts.forEach(elm => {
          if (id === elm.productId) {
            elm.disabled = flag
          }
        })
      } else {
        this.allProducts.forEach(elm => {
          elm.disabled = flag
        })
      }
    },
    initRules: function() {
      const defaultRequire = () => {
        return {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'change'
        }
      }
      return {
        customerId: defaultRequire(),
        payType: defaultRequire(),
        billType: defaultRequire(),
        freightAmount: [
          defaultRequire(),
          { type: 'number', message: '必须为数字值', trigger: 'blur' }
        ],
        totalAmount: defaultRequire(),
        billContent: defaultRequire(),
        deliveryTime: defaultRequire(),
        receiveTime: defaultRequire(),
        receiverName: defaultRequire(),
        receiverPhone: {
          required: true,
          validator: (rule, value, callback) => {
            if (value !== '' && !validMobile(value)) {
              callback(this.$t('rules.mobile'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        },
        receiverDetailAddress: defaultRequire(),
        remark: [{ max: 255, message: '最多255  个字符', trigger: 'blur' }]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card {
  margin-top: 10px;
}
</style>
