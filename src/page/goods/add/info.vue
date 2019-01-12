<template>
  <div>
    <el-form v-loading="service.loading" :model="goods" :rules="rules" ref="form" label-width="100px"
             class="demo-ruleForm">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="商品分类" prop="goods_category">
            <el-cascader
              class="input"
              placeholder="请选择商品分类"
              :options="service.category_list"
              :props="service.category_props"
              v-model="goods.goods_category"
            >
            </el-cascader>
          </el-form-item>
          <!--<el-form-item label="扩展分类" prop="goods_extend_goods_category">-->
          <!--<el-cascader-->
          <!--class="input"-->
          <!--placeholder="请选择商品扩展分类"-->
          <!--:options="service.category_list"-->
          <!--:props="service.category_props"-->
          <!--v-model="goods.goods_extend_goods_category"-->
          <!--&gt;-->
          <!--</el-cascader>-->
          <!--</el-form-item>-->
          <el-form-item label="商品名称" prop="title">
            <el-input placeholder="请输入商品名称" v-model="goods.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="基础销量" prop="base_sales">
            <el-input-number class="input" controls-position="right" :min="0" v-model="goods.base_sales"/>
          </el-form-item>
          <!--<el-form-item label="库存预警" prop="minstock">-->
          <!--<el-input-number class="input" controls-position="right" :min="0" v-model="goods.minstock"/>-->
          <!--</el-form-item>-->
          <el-form-item label="商品品牌" prop="brand_name">
            <el-input v-model="goods.brand_name" readonly placeholder="请选择商品品牌" @focus="brand.visible= true"/>
            <!--<el-select v-model="goods.brand_id" placeholder="请选择商品品牌">-->
            <!--<el-option-->
            <!--v-for="item in service.brand_list"-->
            <!--:key="item.brand_id"-->
            <!--:label="item.brand_name"-->
            <!--:value="item.brand_id">-->
            <!--</el-option>-->
            <!--</el-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">

          <!--  <el-form-item label="总库存" prop="stock">
             <el-input-number class="input" controls-position="right" v-model="goods.stock"/>
           </el-form-item> -->
          <!--<el-form-item label="关键词" prop="key_words">-->
          <!--<el-input v-model="goods.key_words" placeholder="请输入商品关键词"/>-->
          <!--</el-form-item>-->
          <el-form-item label="商品促销语" prop="introduction">
            <el-input v-model="goods.introduction" placeholder="请输入商品促销语"/>
          </el-form-item>
          <el-form-item label="计量单位">
            <el-input class="input" value="kg"/>
          </el-form-item>
          <!-- <el-form-item label="市场价" prop="market_price" v-show="false">
            <el-input-number class="input" controls-position="right" v-model="goods.market_price"/>
          </el-form-item>
          <el-form-item label="销售价" prop="price" v-show="false">
            <el-input-number class="input" controls-position="right" v-model="goods.price"/>
          </el-form-item> -->
          <!--<el-form-item label="成本价" prop="cost_price" v-show="false">-->
          <!--<el-input-number class="input" controls-position="right" :min="0" v-model="goods.cost_price"/>-->
          <!--</el-form-item>-->
        </el-col>
      </el-row>
    </el-form>
    <!--商品品牌-->
    <el-dialog title="选择品牌" :visible.sync="brand.visible" width="25%">
      <el-input size="mini" placeholder="搜索品牌" v-model="brand.name" style="margin-bottom: 10px">
        <el-button slot="append" icon="el-icon-search" @click="brandSearch"/>
      </el-input>
      <el-tag type="success" v-show="goods.brand_id">{{goods.brand_name}}</el-tag>
      <el-table :data="service.brand_list" @cell-click="selectBrand" v-loading="brand.load">
        <el-table-column prop="brand_name" label="品牌名"/>
      </el-table>
      <el-pagination
        small
        style="text-align: center;margin-top: 10px"
        layout="prev, pager, next"
        @current-change="changeBrandPage"
        :page-size="brand.pre_page"
        :total="brand.total_count">
      </el-pagination>
    </el-dialog>
    <!--商品品牌结束-->
  </div>
</template>

<script>
export default {
  name: 'info',
  props: ['editData'],
  watch: {
    editData (data) {
      this.goods.title = data.goods_name
      this.goods.goods_category = [data.category_id_1, data.category_id_2, data.category_id_3, data.category_id_4].filter(item => item)
      this.goods.introduction = data.introduction
      this.goods.key_words = data.keywords
      this.goods.market_price = parseFloat(data.market_price)
      this.goods.base_sales = parseFloat(data.sales) // 待确认;
      this.goods.minstock = parseFloat(data.min_stock_alarm)
      this.goods.brand_id = data.brand_id
      this.goods.brand_name = data.brand_name
    }
  },
  data () {
    return {
      brand: {
        load: false,
        visible: false,
        page: 1,
        pre_page: 5,
        total_count: 0,
        name: ''
      },
      goods: {
        goods_category: [],
        category_id_1: '', // 一级分类
        category_id_2: '', // 二级分类
        category_id_3: '', // 三级分类
        category_id_4: '', // 三级分类
        categoryId: '', // 商品分类id

        // goods_extend_goods_category: '',
        // categoryExtendId: '',//扩展分类id
        // extend_category_id_1: '',
        // extend_category_id_2: '',
        // extend_category_id_3: '',
        // extend_category_id_4: '',

        title: '', // 商品名称
        introduction: '', // 商品促销语
        key_words: '', // 关键词
        market_price: 0, // 市场价
        // price: 0,//销售价
        cost_price: 0, // 成本价
        base_sales: 0, // 基础销量
        // stock: 0,//总库存
        minstock: 0, // 库存预警
        brand_id: 0, // 品牌id
        brand_name: ''// 品牌name
      },
      rules: {
        title: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {max: 50, message: '商品名称文字不能多于50个', trigger: 'blur'}
        ],
        goods_category: [
          {required: true, message: '请选择商品分类', trigger: 'change'}
        ],
        // key_words: [
        //   {required: true, message: '请输入商品关键词', trigger: 'blur'},
        // ],
        // brand_name: [
        //   {required: true, message: '请选择商品品牌', trigger: 'change'},
        // ],

        // goods_extend_goods_category: [
        //   {required: true, message: '请选择商品扩展分类', trigger: 'change'},
        // ],
        market_price: [
          {required: true, message: '请输入商品市场价', trigger: 'blur'}
        ],
        // price: [
        //   {required: true, message: '请输入商品销售价', trigger: 'blur'},
        // ],
        // base_sales: [
        //   {required: true, message: '请输入基础销量', trigger: 'blur'},
        // ],
        cost_price: [
          {required: true, message: '请输入商品成本价', trigger: 'blur'}
        ]
        // stock: [
        //   {required: true, message: '请输入商品总库存', trigger: 'blur'},
        // ],
        // minstock: [
        //   {required: true, message: '请输入商品库存预警数量', trigger: 'blur'},
        // ],
      },
      service: {
        category_list: [],
        category_props: {
          value: 'category_id',
          label: 'category_name',
          children: 'children'
        },
        brand_list: []
      }
    }
  },
  async created () {
    // 分类
    this.service.loading = true
    const {err, data} = await this.$service.goods.goods_common_api.category_list()
    this.service.loading = false
    if (err) return
    this.service.category_list = data.result
    this.getBrandList()
  },
  methods: {
    selectBrand (row, column, cell, event) {
      const {brand_id, brand_name} = row
      this.goods.brand_id = brand_id
      this.goods.brand_name = brand_name
      this.brand.visible = false
    },
    brandSearch () {
      this.brand.page = 1
      this.getBrandList()
    },
    changeBrandPage (page) {
      this.brand.page = page
      this.getBrandList()
    },
    async getBrandList () {
      this.brand.load = true
      // 品牌
      const {err: err_barnd, data: data_barnd} = await this.$service.goods.goods_common_api.brand_list({
        page: this.brand.page,
        pre_page: this.brand.pre_page,
        name: this.brand.name
      })
      this.brand.load = false
      if (err_barnd) return
      this.service.brand_list = data_barnd.result
      this.brand.total_count = data_barnd.total_count
    },
    next () {
      let result = false
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 赋值
          this.goods.categoryId = this.goods.goods_category[this.goods.goods_category.length - 1]
          this.goods.category_id_1 = this.goods.goods_category[0] || 0
          this.goods.category_id_2 = this.goods.goods_category[1] || 0
          this.goods.category_id_3 = this.goods.goods_category[2] || 0
          this.goods.category_id_4 = this.goods.goods_category[3] || 0

          // this.goods.categoryExtendId = this.goods.goods_extend_goods_category[this.goods.goods_extend_goods_category.length - 1]
          // this.goods.extend_category_id_1 = this.goods.goods_extend_goods_category[0] || 0
          // this.goods.extend_category_id_2 = this.goods.goods_extend_goods_category[1] || 0
          // this.goods.extend_category_id_3 = this.goods.goods_extend_goods_category[2] || 0
          // this.goods.extend_category_id_4 = this.goods.goods_extend_goods_category[3] || 0
          result = this.goods
        }
      })
      return result
    },
    addExtend () {
      this.goods.goods_extend_goods_category.push([])
    },
    removeExtend (index) {
      this.goods.goods_extend_goods_category = this.goods.goods_extend_goods_category.filter((item, i) => i !== index)
    }
  }
}
</script>

<style scoped>
  @import '../add.css';

  .extend-p {
    margin-bottom: 10px;
  }
</style>
