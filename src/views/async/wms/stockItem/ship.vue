<template>
  <el-drawer
    title="发货处理"
    size="450px"
    direction="rtl"
    class="my-drawer"
    :modal="true"
    :show-close="true"
    :wrapper-closable="false"
    :visible.sync="isVisible"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="发货处理">
        <el-form
          ref="postForm"
          :model="postForm"
          :rules="rules"
          size="mini"
          label-width="100px"
        >
          <el-form-item label="运输渠道" prop="deliveryChannel">
            <el-input v-model="postForm.deliveryChannel" />
          </el-form-item>
          <el-form-item label="物流单号" prop="deliverySn">
            <el-input v-model="postForm.deliverySn" />
          </el-form-item>
        </el-form>
        <el-row type="flex" class="row-bg" justify="end">
          <el-col :span="10">
            <div>
              <el-button
                type="primary"
                size="mini"
                :loading="loading"
                @click="submitPostForm"
              >提交</el-button>
              <el-button
                type="warning"
                size="mini"
                :loading="loading"
                @click="close"
              >取 消</el-button>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script>
import { outItemFromStockApi } from '@/api/wms'
export default {
  props: {
    deliveryVisible: {
      type: Boolean,
      default: false
    },
    dto: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      postForm: this.initPostForm(),
      rules: this.initRules()
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.deliveryVisible
      },
      set() {
        this.close()
      }
    }
  },
  watch: {
    dto: {
      handler: function(n, o) {
        this.postForm.stockItemId = n.stockItemId
      }
    }
  },
  methods: {
    initPostForm: function() {
      return {
        stockItemId: null,
        deliverySn: null,
        deliveryChannel: null
      }
    },
    close: function() {
      this.postForm = this.initPostForm()
      this.$emit('close')
    },
    submitPostForm: function() {
      this.$refs['postForm'].validate(v1 => {
        if (!v1) {
          return
        }
        this.loading = true
        outItemFromStockApi({ ...this.postForm })
          .then(r => {
            this.$message({
              message: '发货成功',
              type: 'success'
            })
            this.$emit('success')
            this.close()
            this.loading = false
          })
          .catch(_ => {
            this.loading = false
          })
      })
    },
    initRules: function() {
      const defaultRequire = () => {
        return {
          required: true,
          message: this.$t('rules.require'),
          trigger: 'blur'
        }
      }
      return {
        // 发货申请
        deliveryChannel: defaultRequire(),
        deliverySn: defaultRequire()
      }
    }
  }
}
</script>

<style lang="scss">
.el-drawer__header {
  font-weight: bold;
  color: #050505;
  font-size: 16px;
}
</style>
