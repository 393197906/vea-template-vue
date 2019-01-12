<style scoped>
  .card_title {
    font-weight: 600;
    color: #1c8fef;
    padding-bottom: 12px;
  }

  .price_view {
    text-align: center;
    margin: 10px 0;
    color: #606266;
  }

  .price_view .price_tit {
    padding-bottom: 10px;
  }

  .door_in {
    width: 100px;
  }

  .save_view {
    padding: 10px 0;
    font-size: 12px;
  }

  .card_view1 .el-input-number {
    width: 100%;
  }
</style>
<template>

  <div class="out_view" v-loading="loading">
    <div class="card_view  card_view1">
      <p class="card_title">商品信息</p>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form :model="formData" status-icon ref="formData" label-width="100px" class="demo-ruleForm">
              <el-form-item label="商品名称" prop="title" :rules="{required:true, message:'请输入商品名称', trigger:'blur'}">
                <el-input size="medium" v-model="formData.title" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="商品品牌">
                <el-input v-model="formData.brand_name" readonly placeholder="请选择商品品牌" @focus="brand.visible= true"/>
              </el-form-item>
              <el-form-item label="商品分类" required>
                <el-cascader clearable expand-trigger="hover" :props="category_props" size="small"
                             :options="category_list" v-model="categoryOptions"></el-cascader>
              </el-form-item>
              <el-form-item label="扩展分类">
                <!-- <el-input size="medium" v-model="formData.extend_category_id"  auto-complete="off"></el-input> -->
                <el-cascader clearable expand-trigger="hover" :props="category_props" size="small"
                             :options="category_list" v-model="extendCategoryOptions"></el-cascader>
              </el-form-item>

              <el-form-item label="关键词">
                <el-input size="medium" v-model="formData.key_words" auto-complete="off"></el-input>
              </el-form-item>

              <el-form-item label="市场价" v-show="false">
                <el-input-number :controls="false" size="medium" v-model="formData.market_price"
                                 auto-complete="off"></el-input-number>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form :model="formData" status-icon ref="formData" label-width="100px" class="demo-ruleForm">
              <el-form-item label="销售价" prop="pass" v-show="false">
                <el-input-number :controls="false" size="medium" v-model="formData.price"
                                 auto-complete="off"></el-input-number>
              </el-form-item>
              <!-- <el-form-item label="成本价" v-show="false">
                <el-input-number :controls="false" size="medium" v-model="formData.cost_price"
                                 auto-complete="off"></el-input-number>
              </el-form-item> -->
              <el-form-item label="基础销量">
                <el-input-number :controls="false" size="medium" v-model="formData.base_sales"
                                 auto-complete="off"></el-input-number>
              </el-form-item>
              <el-form-item label="库存重量">
                <el-input-number :controls="false" size="medium" v-model="formData.stock_weight"
                                 auto-complete="off"></el-input-number>
              </el-form-item>
             <!--  <el-form-item label="总库存">
                <el-input-number :controls="false" size="medium" v-model="formData.stock"
                                 auto-complete="off"></el-input-number>
              </el-form-item> -->
              <el-form-item label="库存预警">
                <el-input-number :controls="false" size="medium" v-model="formData.minstock"
                                 auto-complete="off"></el-input-number>
              </el-form-item>
              <el-form-item label="商品促销语">
                <el-input size="medium" v-model="formData.introduction" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="card_view">
      <p class="card_title">基本类型</p>
      <div>
        <el-form label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品规格" prop="is_sale">
            <el-table
              :data="sku_type_data"
              border
              style="width: 100%">
              <template v-for="item in sku_type">
                <el-table-column
                  :prop="item.key"
                  align="center"
                  :label="item.key">
                </el-table-column>
              </template>
            </el-table>
            <div class="price_view">
              <el-row :gutter="20">
                <template v-for="item in sku_price">
                  <el-col :span="4">
                    <p class="price_tit">{{item.key}}</p>
                    <p>
                      <el-input-number :controls="false" size="small" v-model="item.value"></el-input-number>
                    </p>
                  </el-col>
                </template>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item label="阶梯价" prop="leaderType">
            <el-radio v-model="formData.leaderType" label="1">启用</el-radio>
            <el-radio v-model="formData.leaderType" label="2">禁用</el-radio>
          </el-form-item>
          <div v-if="formData.leaderType!=2">
            <el-table
              :data="ladder_price"
              border
              style="width: 100%">
              <el-table-column
                type="index"
                align="center"
                width="50"
                label="层级">
              </el-table-column>
              <el-table-column
                prop="date"
                align="center"
                label="优惠门槛（单位）">
                <template slot-scope="scope">
                  <el-input-number :controls="false" class="door_in" v-model="scope.row.door.to"
                                   size="mini"></el-input-number>
                  -
                  <el-input-number :controls="false" class="door_in" v-model="scope.row.door.from"
                                   size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="date"
                align="center"
                label="优惠价格">
                <template slot-scope="scope">
                  <el-input-number :controls="false" size="mini" v-model="scope.row.price">
                  </el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                type="index"
                prop="address"
                align="center"
                width="100"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="danger" size="small" @click="delLadder(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="save_view">
              <el-button size="small" type="primary" @click="save_ladder">新增阶梯价</el-button>
              <span>注：最多只能添加三级阶梯价</span>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="card_view">
      <p class="card_title">商品详情</p>
      <div>
        <el-form label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品图片">
            <el-upload
              action=" "
              :file-list="file_list"
              list-type="picture-card"
              :http-request="beforeUpload"
              :on-remove="removeImg"
              multiple
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="11">
            </el-dialog>
          </el-form-item>
          <el-form-item label="商品描述">
            <Editor :content="formData.description" @change="editorChange"/>
          </el-form-item>

        </el-form>
      </div>
    </div>
    <div class="card_view">
      <p class="card_title">其他信息</p>
      <div>
        <!-- {{service.province_list}} -->
        <el-form label-width="100px" class="demo-ruleForm">
          <!-- <el-form-item label="商品地点" prop="province_id">
            <el-select
              placeholder="请选择省份"
              @change="changeProvince"
              v-model="formData.province_id"
            >
              <el-option
                v-for="item in service.province_list"
                :key="item.province_id"
                :label="item.province_name"
                :value="item.province_id"
              >
              </el-option>
            </el-select>
            <el-select placeholder="请选择城市" v-model="formData.city_id" @change="changeCity">
              <el-option
                v-for="item in service.city_list"
                :key="item.city_id"
                :label="item.city_name"
                :value="item.city_id">
              </el-option>
            </el-select>
            <el-select placeholder="请选择区域" v-model="formData.district_id">
              <el-option
                v-for="item in service.area_list"
                :key="item.district_id"
                :label="item.district_name"
                :value="item.district_id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="库存显示" prop="is_sale">
            <el-radio v-model="formData.is_sale" label="1">是</el-radio>
            <el-radio v-model="formData.is_sale" label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="是否上架" prop="display_stock">
            <el-radio v-model="formData.display_stock" label="1">立刻上架</el-radio>
            <el-radio v-model="formData.display_stock" label="0">放入仓库</el-radio>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card_view">
      <el-button type="primary" @click="submit_goods">提交</el-button>
    </div>

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
import { Editor } from './add/edit'

export default {
  components: {
    Editor
  },
  data () {
    return {
      sku_list: '',
      brand: {
        load: false,
        visible: false,
        page: 1,
        pre_page: 5,
        total_count: 0,
        name: ''
      },
      stock_temp: 0,
      single_stock_temp: 0,
      loading: false,
      ladder_sku: '',
      sku_price: [],
      sku_type: [],
      ladder_price: [{price: 0, door: {to: 0, from: 0}}],
      goods_sku: [],
      /** 其他信息 */
      service: {
        brand_list: [],
        province_list: [],
        city_list: [],
        area_list: []
      },
      /** 其他信息 END */
      /** 商品详情 */
      file_list: [],
      dialogImageUrl: '',
      dialogVisible: false,
      editorOption: {},
      goods: {
        description: '', // 商品描述，
        picture: 0,
        imageArray: ''
      },
      rules: {

      },
      /** 商品详情 END */
      sku_type_data: [],
      brand_list: [],
      category_list: [],
      categoryOptions: [],
      extendCategoryOptions: [],
      category_id: '',
      category_props: {
        value: 'category_id',
        label: 'category_name',
        children: 'children'
      },
      formData: {
        leaderType: 2,
        district_id: '',
        title: '',
        introduction: '',
        categoryId: '',
        categoryExtendId: '',
        market_price: '',
        price: '',
        // cost_price: '',
        base_sales: '',
        code: '',
        is_sale: '',
        display_stock: '',
        stock: '',
        minstock: '',
        key_words: '',
        description: '111',
        groupArray: '',
        picture: '',
        imageArray: '',
        stock_weight: '',
        sku_picture_vlaues: '',
        skuArray: '',
        leaderArray: '',
        skuArrayCloud: '',
        skuLeaderCloud: '',
        skuLeaderCloud: '',
        is_sync_erp_goods: '',
        is_sync_erp_status: '',
        goods_attribute_id: '',
        sort: '',
        goods_attribute: '',
        province_id: '',
        city_id: '',
        qrcode: '',
        extend_category_id_1: '',
        extend_category_id_2: '',
        extend_category_id_3: '',
        category_id_1: '',
        category_id_2: '',
        category_id_3: '',
        brand_id: '',
        brand_name: ''
      }
    }
  },
  async created () {
    this.id = this.$route.params.id
    this.sku_list = this.$route.query.skuList
    await this.options_province()
    this.getDetail()
    this.getBrand()
    this.categoryList()
  },
  methods: {
    changeBrandPage (page) {
      this.brand.page = page
      this.getBrand()
    },
    // 选择品牌
    selectBrand (row, column, cell, event) {
      const {brand_id, brand_name} = row
      this.formData.brand_id = brand_id
      this.formData.brand_name = brand_name
      this.brand.visible = false
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('请选择图片')
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    },
    // 提交
    async submit_goods () {
      if (!this.formData.title) {
        this.$message({
          message: '请输入商品名称',
          type: 'warning'
        })
        return false
      }
      if (!this.categoryOptions.length) {
        this.$message({
          message: '请选择商品分类',
          type: 'warning'
        })
        return false
      }
      this.loading = true

      // this.formData.price = this.sku_price[0].value
      this.formData.market_price = this.sku_price[1].value
      // this.formData.cost_price = this.sku_price[2].value

      /** 分类 */
      this.formData.categoryId = this.categoryOptions[this.categoryOptions.length - 1]
      this.formData.category_id_1 = this.categoryOptions[0] || 0
      this.formData.category_id_2 = this.categoryOptions[1] || 0
      this.formData.category_id_3 = this.categoryOptions[2] || 0
      this.formData.extend_category_id_1 = this.extendCategoryOptions[0] || 0
      this.formData.extend_category_id_2 = this.extendCategoryOptions[1] || 0
      this.formData.extend_category_id_3 = this.extendCategoryOptions[2] || 0

      /** 图片 */
      let imgArray = ''
      this.file_list.forEach((item, index) => {
        if (index == 0) {
          imgArray = imgArray + item.id + ''
          this.formData.picture = item.id
        } else {
          imgArray = imgArray + ',' + item.id
        }
      })
      this.formData.imageArray = imgArray
      /** 销售价，成本价 等等 */
      let sku_price = []
      this.sku_price.forEach(item => {
        if (item.key == '销售价（元）') {
          this.sku_list.forEach(sku => {
            if (this.id != sku.sku_id) {
              this.formData.price = parseFloat(item.value).toFixed(2) < parseFloat(sku.price).toFixed(2) ? parseFloat(item.value).toFixed(2) : parseFloat(sku.price).toFixed(2)
            }
          })
        }
        if (item.key == '虚拟库存') {
          this.formData.stock = parseInt(item.value) - parseInt(this.single_stock_temp) + this.stock_temp
        }
        sku_price.push(item.value)
      })
      sku_price.unshift(this.ladder_sku)
      this.formData.skuArray = sku_price.join('¦')

      /** 阶梯价 */
      if (this.formData.leaderType == '2') {
        this.ladder_price.forEach(item => {
          item.door.to = 0
          item.door.from = 0
          item.price = 0
        })
      }
      let leaderArray = []
      this.ladder_price.forEach(item => {
        leaderArray.push(item.door.to, item.door.from, item.price)
      })
      leaderArray.unshift(this.ladder_sku)
      this.formData.leaderArray = leaderArray.join('¦')
      /** 阶梯价 END */
      // return false;
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.goodsEditSku(
        this.id,
        this.formData
      )
      this.loading = false
      if (err) return
      this.$message({
        message: data.message,
        type: 'success'
      })
      this.$router.push('/goods/list')
    },
    /** 获取详情 */
    async getDetail () {
      this.loading = true
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.goods_edit_detail(this.id)
      const data_detail = data.result
      if (data_detail.province_id) { await this.changeProvince(data_detail.province_id) }
      if (data_detail.city_id) await this.changeCity(data_detail.city_id)

      this.formData.title = data_detail.goods_name || ''
      this.formData.introduction = data_detail.introduction || ''
      this.formData.categoryId = data_detail.category_id || ''
      this.formData.categoryExtendId = data_detail.extend_category_id || ''
      this.formData.market_price = data_detail.market_price || ''
      this.formData.price = data_detail.price || '0'
      // this.formData.cost_price = data_detail.cost_price || '0'
      this.formData.base_sales = data_detail.sales || '0'
      this.formData.code = data_detail.code || ''
      this.formData.is_sale = data_detail.is_stock_visible + '' || '0'
      this.formData.display_stock = data_detail.state + '' || '0'
      this.formData.stock = data_detail.stock || '0'
      this.stock_temp = parseInt(this.formData.stock)
      this.formData.minstock = data_detail.min_stock_alarm || '0'
      this.formData.key_words = data_detail.keywords || ''
      this.formData.description = data_detail.description || ''
      this.formData.groupArray = data_detail.group_id_array || ''
      this.formData.picture = data_detail.picture || ''
      this.formData.imageArray = data_detail.img_id_array || ''
      this.formData.stock_weight = data_detail.stock_weight || '0'
      this.formData.sku_picture_vlaues = data_detail.sku_picture_vlaues || ''
      this.formData.skuArray = data_detail.skuArray || ''
      this.formData.skuArrayCloud = data_detail.skuArrayCloud || ''
      this.formData.skuLeaderCloud = data_detail.skuLeaderCloud || ''
      this.formData.cloudSku = data_detail.cloudSku || ''
      this.formData.is_sync_erp_goods = data_detail.is_sync_erp_goods || '0'
      this.formData.is_sync_erp_status = data_detail.is_sync_erp_status || '0'
      this.formData.goods_attribute_id = data_detail.goods_attribute_id || '0'
      this.formData.sort = data_detail.sort || 0
      this.formData.goods_attribute = data_detail.goods_attribute || ''
      this.formData.province_id = data_detail.province_id || ''
      this.formData.city_id = data_detail.city_id || ''
      this.formData.district_id = data_detail.district_id || ''
      this.formData.qrcode = data_detail.qrcode || ''
      this.formData.extend_category_id_1 =
          data_detail.extend_category_id_1 || 0
      this.formData.extend_category_id_2 =
          data_detail.extend_category_id_2 || 0
      this.formData.extend_category_id_3 =
          data_detail.extend_category_id_3 || 0
      this.formData.extend_category_id_4 =
          data_detail.extend_category_id_4 || 0
      this.formData.category_id_1 = data_detail.category_id_1 || 0
      this.formData.category_id_2 = data_detail.category_id_2 || 0
      this.formData.category_id_3 = data_detail.category_id_3 || 0
      this.formData.category_id_4 = data_detail.category_id_4 || 0
      this.formData.brand_id = data_detail.brand_id || ''
      this.formData.leaderType = data_detail.leaderType + '' || '2'

      /** 阶梯价 */
      if (data_detail.leader_price) {
        const leaderPrice = JSON.parse(this.$substr(data_detail.leader_price))
        this.ladder_sku = leaderPrice.slice(0, 1)

        this.formData.leaderArray = data_detail.leader_price
          ? leaderPrice.join('¦')
          : ''
        const leader_price = leaderPrice.slice(1)

        this.ladder_price = [
          {
            price: leader_price[2],
            door: {to: leader_price[0], from: leader_price[1]}
          },
          {
            price: leader_price[5],
            door: {to: leader_price[3], from: leader_price[4]}
          },
          {
            price: leader_price[8],
            door: {to: leader_price[6], from: leader_price[7]}
          }
        ]
      }
      /** 商品sku */
      this.goods_sku = data_detail.goods_sku
      let sku_index = 0
      this.goods_sku.forEach((item, index) => {
        if (item.key == '销售价（元）') {
          sku_index = index
          return
        }
        if (item.key == '虚拟库存') {
          this.single_stock_temp = item.value
        }
      })
      this.sku_price = this.goods_sku.slice(sku_index)
      this.sku_type = this.goods_sku.slice(0, sku_index)
      let sku_type_data = {is_ladder: true}
      this.sku_type.forEach((item, i) => {
        sku_type_data[item.key] = item.value
      })

      this.sku_type_data.push(sku_type_data)

      /** 图片 */

      let file_list = []
      let img_id_arr = []
      try {
        img_id_arr = JSON.parse(data_detail.img_id_array)
        if (img_id_arr.indexOf(',') > 0) {
          img_id_arr = data_detail.img_id_array.split(',')
        } else {
          img_id_arr.push(data_detail.img_id_array)
        }
      } catch (e) {
        try {
          if (!data_detail.img_id_array.split(',')) {
            img_id_arr.push(data_detail.img_id_array)
          } else {
            img_id_arr = data_detail.img_id_array.split(',')
          }
        } catch (e) {
          img_id_arr = []
        }
      }

      if (data_detail.picture_array) {
        var i = 0
        for (var key in data_detail.picture_array) {
          if (key) {
            file_list.push({
              name: 'picture' + i,
              url: data_detail.picture_array[key],
              id: key
            })
          }
          i++
        }
        // data_detail.picture_array.forEach((item, i) => {
        //   if(item)
        //   file_list.push({name: 'picture' + i, url: item, id: img_id_arr[i]})
        // })
      }
      this.file_list = file_list
      /** 分类 */
      let categoryOptions = []
      let extendCategoryOptions = []
      categoryOptions = [
        data_detail.category_id_1,
        data_detail.category_id_2,
        data_detail.category_id_3
      ]
      if (data_detail.category_id_4) {
        categoryOptions[3] = data_detail.category_id_4
      }
      extendCategoryOptions = [
        Number(data_detail.extend_category_id_1),
        Number(data_detail.extend_category_id_2),
        Number(data_detail.extend_category_id_3)
      ]
      if (data_detail.extend_category_id_4) {
        categoryOptions[3] = Number(data_detail.extend_category_id_4)
      }
      this.categoryOptions = categoryOptions
      this.extendCategoryOptions = extendCategoryOptions
      this.loading = false
    },
    // 搜索品牌
    brandSearch () {
      this.brand.page = 1
      this.getBrand()
    },
    /** 获取品牌列表 */
    async getBrand () {
      this.brand.load = true
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.brand_list({
        page: this.brand.page,
        pre_page: this.brand.pre_page,
        name: this.brand.name
      })
      this.brand.load = false
      if (err) return
      this.service.brand_list = data.result
      this.brand.total_count = data.total_count
    },
    /** 获取商品分类 */
    async categoryList () {
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.category_list()
      this.category_list = data.result || []
    },
    /** 商品详情 */
    removeImg (file) {
      this.file_list = this.file_list.filter(item => item.id !== file.id)
    },
    async beforeUpload ({file}) {
      let fd = new FormData()
      fd.append('file', file, Date.now().toString())
      const {err, data} = await this.$service.upload_img(fd)
      if (err) return
      const {pic_cover, shop_id, pic_name, pic_id} = data.result
      this.file_list.push({id: pic_id, name: pic_name, url: pic_cover})
      this.$message({
        message: '上传成功!',
        type: 'success'
      })

      this.formData.picture = data.result.pic_id
    },
    editorChange (content) {
      this.formData.description = content
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /** 商品详情 END */

    /** 其他信息 */
    async options_province (value) {
      const {err, data} = await this.$service.zone.options_province()
      if (err) return
      this.service.province_list = data.data
    },
    async changeProvince (value) {
      this.service.city_list = []
      this.service.area_list = []
      const {err, data} = await this.$service.zone.options_city(value)
      if (err) return
      this.service.city_list = data.data
      this.formData.city_id = this.service.city_list[0].city_id
      this.changeCity(this.formData.city_id)
    },
    async changeCity (value) {
      this.formData.district_id = ''
      this.service.area_list = []
      const {err, data} = await this.$service.zone.options_district(value)
      if (err) return
      this.service.area_list = data.data
      this.formData.district_id = this.service.area_list[0].district_id
    },
    /** 其他信息 END */

    /** 新增阶梯价 */
    save_ladder () {
      if (this.ladder_price.length < 3) {
        this.ladder_price.push({price: 0, door: {to: 0, from: 0}})
      }
    },
    /** 删除阶梯价 */
    delLadder (index) {
      if (this.ladder_price.length > 1) {
        this.ladder_price.splice(index, 1)
      }
    }
  }
}
</script>
