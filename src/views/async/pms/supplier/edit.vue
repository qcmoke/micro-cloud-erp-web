<template>
  <el-dialog
    :title="title"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <!--el-form加入:model="supplier"，让this.$refs.form.resetFields()等表单函数起作用 -->
    <el-form
      ref="form"
      size="mini"
      :model="supplier"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <!-- 需要加prop，rules才起作用-->
      <el-form-item label="名称" prop="supplierName">
        <el-input v-model="supplier.supplierName" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input
          v-model="supplier.address"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="开户银行" prop="bank">
        <el-input
          v-model="supplier.bank"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="银行账号" prop="bankAccount">
        <el-input
          v-model.number="supplier.bankAccount"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="supplier.email"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="linkMan">
        <el-input
          v-model="supplier.linkMan"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="联系人号码" prop="linkTel">
        <el-input
          v-model="supplier.linkTel"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="telPhone">
        <el-input
          v-model="supplier.telPhone"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="邮编" prop="postcode">
        <el-input
          v-model="supplier.postcode"
          :rules="{ required: true, message: '不能为空' }"
        />
      </el-form-item>
      <el-form-item label="添加物料">
        <el-select v-model="materialIds" multiple placeholder="请选择">
          <el-option
            v-for="item in allMaterials"
            :key="item.materialId"
            :label="item.materialName"
            :value="item.materialId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="warning"
        plain
        :loading="buttonLoading"
        @click="isVisible = false"
      >
        {{ $t("common.cancel") }}
      </el-button>
      <el-button
        type="primary"
        plain
        :loading="buttonLoading"
        @click="submitForm"
      >
        {{ $t("common.confirm") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  saveOrUpdateSupplierApi,
  getAllMaterialsApi,
  getAllMaterialsBySupplierIdApi
} from '@/api/pms'
export default {
  name: 'SupplierEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      buttonLoading: false,
      // supplier的数据由父组件决定
      supplier: {},
      materialIds: [],
      allMaterials: [],
      rules: {
        supplierName: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        bankAccount: [
          { required: true, message: this.$t('rules.require') },
          { type: 'number', message: '必须为数字值' }
        ]
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
  watch: {},
  mounted() {
    this.initAllMaterialsApi()
  },
  methods: {
    // 父传子
    setRow: function(row) {
      // 给supplier赋值
      this.supplier = { ...row }

      // 给materialIds赋值
      const supplierId = this.supplier.supplierId
      if (supplierId) {
        getAllMaterialsBySupplierIdApi(supplierId)
          .then(r => {
            const materials = r.data.data
            this.materialIds = []
            for (const { materialId } of materials) {
              this.materialIds.push(materialId)
            }
          })
          .catch(e => {
            console.error('获取物料列表失败')
          })
      }

      // 如果allMaterials为空，则重新对其初始化
      if (this.allMaterials === null || this.allMaterials.length === 0) {
        this.initAllMaterialsApi()
      }
    },
    initAllMaterialsApi: function() {
      getAllMaterialsApi()
        .then(r => {
          this.allMaterials = r.data.data
        })
        .catch(e => {
          console.error('获取物料列表失败', e)
        })
    },
    submitForm: function() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        this.buttonLoading = true
        const params = {
          ...this.supplier,
          materialIds: this.materialIds
        }
        saveOrUpdateSupplierApi(params)
          .then(r => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$emit('success')
            this.close()
            this.buttonLoading = false
          })
          .catch(e => {
            this.buttonLoading = false
          })
      })
    },
    close: function() {
      this.reset()
      this.$emit('close')
      this.buttonLoading = false
    },
    reset: function() {
      this.supplier = {}
      this.materialIds = []
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped></style>
