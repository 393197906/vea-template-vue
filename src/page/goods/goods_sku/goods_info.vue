
<style scoped>
.main_view .el-form-item__label {
  font-size: 12px;
}
</style>
<template>
<div>
    <div class="main_view">
        <el-row :gutter="10">
            <el-col :span="12">
                <el-form :model="form_data" status-icon  ref="form_data" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="商品名称" >
                        <el-input size="medium" v-model="form_data.title"   auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" >
                        <el-cascader clearable expand-trigger="hover" :props="category_props"  size="small" :options="category_list" v-model="category_options"></el-cascader>
                    </el-form-item>
                    <el-form-item label="扩展分类" >
                        <!-- <el-input size="medium" v-model="form_data.extend_category_id"  auto-complete="off"></el-input> -->
                        <el-cascader clearable expand-trigger="hover" :props="category_props"  size="small" :options="category_list" v-model="extend_category_options"></el-cascader>
                    </el-form-item>
                    <el-form-item label="商品促销语" >
                        <el-input size="medium" v-model="form_data.introduction"  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="关键词" >
                        <el-input size="medium" v-model="form_data.key_words"  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品品牌" >
                        <el-select v-model="form_data.brand_id" placeholder="请选择">
                            <el-option
                            v-for="item in brand_list"
                            :key="item.brand_id"
                            :label="item.brand_name"
                            :value="item.brand_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="市场价" >
                        <el-input size="medium" v-model="form_data.market_price"  auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <el-form :model="form_data" status-icon  ref="form_data" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="销售价" prop="pass">
                        <el-input size="medium" v-model="form_data.price"  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="成本价" >
                        <el-input size="medium" v-model="form_data.cost_price"  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="基础销量" >
                        <el-input size="medium" v-model="form_data.base_sales"  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="库存重量" >
                        <el-input size="medium" v-model="form_data.stock_weight"  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="总库存" >
                        <el-input size="medium" v-model="form_data.stock"  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="库存预警" >
                        <el-input size="medium" v-model="form_data.minstock"  auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-table
                :data="goods_spec_format"
                border
                style="width: 100%">
                <el-table-column
                v-for="item in goodsSpecFormat" :key="item.spec_id"
                prop="spec_name"
                :label="item.spec_name">
                    <template slot-scope="scope">
                        <span v-for="itemS in scope.row[item.spec_name]">{{itemS.spec_value_name}},</span>
                    </template>
                </el-table-column>

                <el-table-column
                prop="address"
                label="阶梯价">
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</div>
</template>
<script>
export default {
  props: {
    formData: Object,
    categoryOptions: Array,
    extendCategoryOptions: Array,
    goodsSpecFormat: Array
  },
  data () {
    return {
      goods_spec_format: [],
      form_data: this.formData,
      brand_list: [],
      category_list: [],
      category_options: [],
      extend_category_options: [],
      category_id: '',
      category_props: {
        value: 'category_id',
        label: 'category_name',
        children: 'children'
      }
    }
  },

  watch: {
    goodsSpecFormat (val) {
      let goods_spec_format = {}
      val.forEach(item => {
        goods_spec_format[item.spec_name] = item.value
      })
      this.goods_spec_format.push(goods_spec_format)
      console.log(this.goods_spec_format)
    },
    categoryOptions (val) {
      this.category_options = val
    },
    extendCategoryOptions (val) {
      this.extend_category_options = val
    }
  },
  created () {
    //   console.log("created",this.formData.price)
    this.getBrand()
    this.categoryList()
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    /** 获取品牌列表 */
    async getBrand () {
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.brand_list(this.id)
      this.brand_list = data.result
    },
    /** 获取商品分类 */
    async categoryList () {
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.category_list()
      this.category_list = data.result || []
    }
  }
}
</script>
