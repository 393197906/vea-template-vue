<style scoped>
  .sku_value {
    background: #fafafa;
  }
</style>

<template>
  <div class="card_view">
    <el-form :model="formData" status-icon :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm">
      <el-form-item label="规格名称：" prop="spec_name">
        <el-input v-model="formData.spec_name" readonly></el-input>
      </el-form-item>
      <el-form-item label="规格排序：" prop="sort">
        <el-input :min="0" v-model="formData.sort" size="small" readonly style="width:60px"/>
        <!-- <el-input  v-model="formData.sort"></el-input> -->
      </el-form-item>
      <el-form-item label="是否启用：" prop="is_visible">
        <el-radio-group v-model="formData.is_visible" disabled>
          <el-radio-button label="1">是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否筛选：" prop="is_screen">
        <el-radio-group v-model="formData.is_screen" disabled>
          <el-radio-button label="1">是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="展示方式：" prop="show_type">
        <el-radio-group v-model="formData.show_type" @change="showTypeChange" disabled>
          <el-radio label="1">文字</el-radio>
          <el-radio label="2">颜色</el-radio>
          <!-- <el-radio label="3">图片</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联类型：" prop="goods_attr_id">
        <el-select v-model="formData.goods_attr_id" placeholder="请选择" disabled>
          <el-option
            v-for="item in attrBute"
            :key="item.attr_id"
            :label="item.attr_name"
            :value="item.attr_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="属性：" prop="values">
        <el-row>
          <el-col :span="12">
            <el-table
              border
              :data="attrValues"
              style="width: 100%">
              <el-table-column
                prop="date"
                align="center"
                label="属性名称">
                <template slot-scope="scope">
                  <el-input style="width:200px;" :readonly="scope.row.newAdd ? false : true "
                            v-model="scope.row.spec_value_name"></el-input>
                  <el-color-picker v-if="formData.show_type==2" style="transform:translateY(14px)"
                                   v-model="scope.row.spec_value_data"></el-color-picker>
                </template>
              </el-table-column>
              <!--<el-table-column-->
              <!--align="center"-->
              <!--label="操作">-->
              <!--<template slot-scope="scope">-->
              <!--<el-button type="text" @click="del_val">删除</el-button>-->
              <!--</template>-->
              <!--</el-table-column>-->
            </el-table>
            <div>
              <el-button type="text" @click="saveVal"><i class="el-icon-plus"></i> 添加一个属性</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formData')" size="small" :loading="loading">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      id: '',
      attrBute: [],
      attrValues: [],
      formData: {
        spec_name: '',
        sort: '',
        is_visible: '1',
        is_screen: '1',
        show_type: '1',
        goods_attr_id: '',
        values: ''
      },
      rules: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getAttribute()
    this.getAttriDetail()
  },
  methods: {
    /** 展示方式切换 */
    showTypeChange (val) {
      this.attrValues = [{spec_value_name: '', spec_value_id: '', spec_value_data: '' }]
    },
    /** 提交 */
    submitForm (formName) {
      const formAttrValues = this.attrValues.filter(i => i.newAdd)
      const notValidateAttrValue = this.attrValues.some(item => {
        const {spec_value_name} = item
        return !spec_value_name
      })
      if (notValidateAttrValue) {
        this.$message.error('属性名称不能为空')
        return
      }
      this.formData.values = JSON.stringify(formAttrValues)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.loading = true
          const {err, data} = await this.$service.goods.goods_sku.sku_edit(this.id,
            this.formData
          )
          this.loading = false
          if (err) return
          this.$message({
            type: 'success',
            message: data.message
          })
          this.$router.push({path: '/goods/sku'})
        } else {
          return false
        }
      })
    },
    /** 新建一个属性 */
    saveVal () {
      var index = this.attrValues.length
      this.attrValues.push({spec_value_name: '', spec_value_id: '', spec_value_data: '', newAdd: 1})
    },
    /** 删除属性 */
    del_val () {
      this.$confirm('确定要删除该活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var index = this.attrValues.length
          this.attrValues.splice(index - 1, 1)
          this.$message({
            type: 'success',
            message: data.message
          })
        })
        .catch(() => {
        })
    },
    /** 获取商品类型 */
    async getAttribute () {
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.attribute()
      this.attrBute = data.result
    },
    /** 获取详情 */
    async getAttriDetail () {
      const {
        err,
        data
      } = await this.$service.goods.goods_sku.sku_detail(this.id)
      const dataDetail = data.result
      this.formData.spec_name = dataDetail.spec_name
      this.formData.sort = dataDetail.sort
      this.formData.is_visible = dataDetail.is_visible
      this.formData.is_screen = dataDetail.is_screen
      this.formData.show_type = dataDetail.show_type + ''
      this.formData.goods_attr_id = dataDetail.goods_attr_id
      /** { spec_value_name: "", spec_value_data: "" } */
      dataDetail.value.forEach(item => {
        this.attrValues.push({
          spec_value_id: item.spec_value_id,
          spec_value_name: item.spec_value_name,
          spec_value_data: item.spec_value_data
        })
      })
    }
  }
}
</script>
