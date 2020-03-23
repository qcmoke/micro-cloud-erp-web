<template>
  <el-dialog
    :title="title"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <!--el-form加入:model="material"，让this.$refs.form.resetFields()等表单函数起作用 -->
    <el-form
      ref="form"
      :model="material"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <!-- 需要加prop，rules才起作用-->
      <el-form-item label="名称" prop="materialName">
        <el-input v-model="material.materialName" />
      </el-form-item>
      <el-form-item label="图片" prop="img">
        <el-input v-model="material.img" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="material.unit" />
      </el-form-item>
      <el-form-item label="规格" prop="standard">
        <el-input v-model="material.standard" />
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model.number="material.price" />
      </el-form-item>
      <el-form-item label="安全库存量" prop="safetyStock">
        <el-input v-model.number="material.safetyStock" />
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
import { addeMaterialApi, updateMaterialApi } from '@/api/pms'
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
        standard: null,
        price: null,
        safetyStock: null,
        createTime: null,
        modifyTime: null,
        deleteStatus: null
      })
    }
  },
  data() {
    return {
      buttonLoading: false,
      // material的数据由父组件决定
      material: {},
      rules: {
        materialName: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        img: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        unit: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        standard: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        price: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        },
        safetyStock: {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
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
    dto: {
      handler(n, o) {
        this.material = { ...n }
        // console.log(this.material)
      },
      deep: true
    },
    'dto.materialName': function(n, o) {
      // console.log(n)
    }
  },
  mounted() {},
  methods: {
    submitForm: function() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        this.buttonLoading = true
        const params = this.material
        if (!params.materialId) {
          // 不存在id说明新增
          addeMaterialApi(params).then(r => {
            console.log(r.data.status)
            this.$message({
              message: this.$t('tips.createSuccess'),
              type: 'success'
            })
            this.buttonLoading = false
            this.$emit('success')
          }).catch(e => {
            this.buttonLoading = false
          })
        } else {
          updateMaterialApi(params).then(r => {
            this.$message({
              message: this.$t('tips.updateSuccess'),
              type: 'success'
            })
            this.buttonLoading = false
            this.$emit('success')
          }).catch(e => {
            this.buttonLoading = false
          })
        }
        this.reset()
      })
    },
    close: function() {
      this.$emit('close')
    },
    reset: function() {
      this.material = {}
      this.buttonLoading = false
      this.isVisible = false
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped></style>
