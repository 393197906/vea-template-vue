<template>
  <div>
    <!--模式-->
    <!--<div class="type-container">-->
    <!--<el-button :type="type==='default'?'primary':''"-->
    <!--@click="goods.is_sync_erp_goods ='';goods.is_sync_erp_status='0';select_sku.list=[];select_sku.comb_list=[];select_sku.result_list=[];service.sku_list=[];;goods.goods_attribute_id='';type='default'">-->
    <!--标准模式-->
    <!--</el-button>-->
    <!--<el-button :type="type==='erp'?'primary':''"-->
    <!--@click="goods.is_sync_erp_status='1';select_sku.list=[];select_sku.comb_list=[];select_sku.result_list=[];service.sku_list=[];goods.code='';type='erp'">-->
    <!--ERP模式-->
    <!--</el-button>-->
    <!--</div>-->
    <el-form v-loading="service.loading" id="type-container" :model="goods" :rules="rules" ref="form"
             label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="商品名称" prop="code" v-if="type==='erp'">
        <el-input v-model="goods.code" @focus="erp_goods.visible= true" placeholder="请选择erp商品"/>
      </el-form-item>
      <el-form-item label="商品类型" prop="goods_attribute_id" v-if="type==='default'">
        <el-select @change="getSkuDetail" class="input" v-model="goods.goods_attribute_id" placeholder="请选择商品类型">
          <el-option
            v-for="item in service.attr_list"
            :key="item.attr_id"
            :label="item.attr_name"
            :value="item.attr_id">
          </el-option>
        </el-select>
      </el-form-item>
      <!--规格开始-->
      <el-form-item label="商品规格" v-if="type==='default'&&service.sku_list.length>0">
        <el-table
          border
          :data="service.sku_list"
          style="width: 100%">
          <el-table-column
            prop="spec_name"
            label="规格名称"
            width="180">
          </el-table-column>
          <el-table-column
            label="规格值">
            <template slot-scope="scope">
              <el-button
                size="mini"
                v-for="sku in scope.row.values"
                :key="sku.spec_value_id"
                @click="clickSkuCell(sku,scope.$index,scope.row.spec_name)"
                :type="select_sku.list.find(item=>item.spec_value_id===sku.spec_value_id)?'primary':''"
              >
                {{sku.spec_value_name}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!--规格结束-->
      <el-form-item label="价格体系" prop="code">
        <el-switch :value="goods.is_pricing" @change="isPricingChange"/>
      </el-form-item>

      <!--标准规格库存开始-->
      <el-form-item label="商品价格" v-if="select_sku.result_list.length">
        <el-table
          border
          :default-expand-all="true"
          :data="select_sku.result_list"
        >
          <el-table-column type="index" label="序列" align="center" width="50"/>
          <!--常规规格名-->
          <el-table-column
            v-if="select_sku.result_list[0].sku_list.length"
            v-for="(iitem,iindex) in select_sku.result_list[0].sku_list"
            align="center"
            :key="iindex"
            :prop="`sku${iindex}.spec_value_name`"
            :label="iitem.spec_name"
          />
          <!--erp规格名-->
          <el-table-column
            v-if="select_sku.result_list[0].erp_sku_name"
            align="center"
            prop="erp_sku_name"
            label="标准规格"
          >
          </el-table-column>
          <el-table-column
            v-if="!goods.is_pricing"
            align="center"
            label="销售价"
            width="120"
          >
            <template slot-scope="scope">
              <el-input-number class="input" size="mini" @change="salesChange(scope.$index,$event)" :min="0"
                               :max="99999" :controls="false"
                               v-model="scope.row.price"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!goods.is_pricing"
            align="center"
            label="市场价"
            width="120"
          >
            <template slot-scope="scope">
              <el-input-number class="input" size="mini" :min="0" :max="99999" :controls="false"
                               v-model="scope.row.market_price"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!select_sku.result_list[0].erp_sku_name"
            align="center"
            label="重量"
            width="120"
          >
            <template slot-scope="scope">
              <el-input-number class="input" size="mini" :min="0" :max="99999" :controls="false"
                               v-model="scope.row.weight"/>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!goods.is_pricing"
            align="center"
            label="启用阶梯价"
            width="120"
          >
            <template slot-scope="scope">
              <el-switch v-model="scope.row.is_leader"/>
            </template>
          </el-table-column>
          <!--阶梯价与渠道价-->
          <el-table-column
            :label="goods.is_pricing?'渠道价':'阶梯价'"
            type="expand"
            width="80"
          >
            <template slot-scope="scope">
              <!--阶梯价-->
              <template v-if="!goods.is_pricing">
                <div v-if="scope.row.is_leader">
                  <el-table
                    border
                    :data="scope.row.leader_price">
                    <el-table-column
                      align="center"
                      label="启始门槛">
                      <template slot-scope="leader_scope">
                        <el-input-number class="input"
                                         size="mini"
                                         :max="99999"
                                         :min="leader_scope.$index<2?1:select_sku.result_list[scope.$index].leader_price[1].to+1"
                                         :controls="false"
                                         v-model="leader_scope.row.from"
                                         :disabled="true"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="结束门槛">
                      <template slot-scope="leader_scope">
                        <el-input-number
                          v-if="leader_scope.$index<select_sku.result_list[scope.$index].leader_price.length-1"
                          class="input" size="mini"
                          :min="leader_scope.row.from" :controls="false" :max="99999"
                          @change="leaderChange(scope.$index,leader_scope.$index,$event)"
                          v-model="leader_scope.row.to"/>
                        <span id="leader" v-else>
                <el-input :value="leader_scope.row.to===99999999?'∞':leader_scope.row.to"
                          size="mini"
                          disabled/>
                </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="价格">
                      <template slot-scope="leader_scope">
                        <el-input-number class="input" size="mini" :min="0" :max="99999" :controls="false"
                                         v-model="leader_scope.row.price"/>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      width="100"
                      label="操作">
                      <template slot-scope="leader_scope">
                        <el-button size="mini" icon="el-icon-delete"
                                   v-if="leader_scope.$index===2"
                                   @click="deleteLadder(scope.$index,leader_scope.$index)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="text-align: left;margin-top: 10px">
                    <el-button size="mini" icon="el-icon-plus" @click="addLadder(scope.$index)">
                      添加阶梯价
                    </el-button>
                    <span style="color: rgb(183,163,163)">最多只能添加三级阶梯价 ('∞' 代表无穷大)</span>
                  </div>
                </div>
                <div style="text-align: center"
                     v-if="!scope.row.is_leader">没有开启阶梯价
                </div>
              </template>
              <!--渠道价-->

              <el-table
                v-else
                border
                :data="scope.row.pricing_list">
                <el-table-column
                  align="center"
                  width="100px"
                  prop="erp_sku_name"
                  label="标准规格">
                  <template slot-scope="pricing_scope">
                    <!--<el-switch v-model="pricing_scope.row.status" :active-value="11" :inactive-value="10" :disabled="isDefalutPrice && pricing_scope.$index === 0" />-->
                    <span v-if="parseInt(pricing_scope.row.is_default) === 10">默认</span>
                    <el-switch v-else v-model="pricing_scope.row.status" :active-value="11" :inactive-value="10"/>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="price_type_name"
                  width="220"
                  label="渠道类型"
                />
                <el-table-column
                  align="center"
                  width="120"
                  label="销售价"
                >
                  <template slot-scope="pricing_scope">
                    <el-input-number class="input" size="mini" :min="0"
                                     :max="99999" :controls="false"
                                     :disabled="pricing_scope.row.status==10 && pricing_scope.row.is_default==11"
                                     v-model="pricing_scope.row.price"/>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="120"
                  label="市场价"
                >
                  <template slot-scope="pricing_scope">
                    <el-input-number class="input" size="mini" :min="0"
                                     :disabled="pricing_scope.row.status==10 && pricing_scope.row.is_default==11"
                                     :max="99999" :controls="false"
                                     v-model="pricing_scope.row.market_price"/>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  width="120"
                  label="启用阶梯价"
                >
                  <template slot-scope="pricing_scope">
                    <el-switch v-model="pricing_scope.row.is_leader" :disabled="pricing_scope.row.status==10"/>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="渠道阶梯价"
                >
                  <template slot-scope="pricing_scope">
                    <div v-if="pricing_scope.row.is_leader">
                      <el-table
                        border
                        :data="pricing_scope.row.leader_price">
                        <el-table-column
                          align="center"
                          label="启始门槛">
                          <template slot-scope="pricing_leader_scope">
                            <el-input-number class="input"
                                             size="mini"
                                             :max="99999"
                                             :min="pricing_leader_scope.$index<2?1:select_sku.result_list[scope.$index].pricing_list[pricing_scope.$index].leader_price[1].to+1"
                                             :controls="false"
                                             v-model="pricing_leader_scope.row.from"
                                             :disabled="true"/>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          label="结束门槛">
                          <template slot-scope="pricing_leader_scope">
                            <el-input-number
                              @change="leaderPriceChange(scope.$index,pricing_scope.$index,pricing_leader_scope.$index,$event)"
                              v-if="pricing_leader_scope.$index<select_sku.result_list[scope.$index].pricing_list[pricing_scope.$index].leader_price.length-1"
                              :min="pricing_leader_scope.row.from" :controls="false" :max="99999"
                              class="input" size="mini"
                              :disabled="pricing_scope.row.status==10"
                              v-model="pricing_leader_scope.row.to"/>
                            <span id="leader" v-else>
                        <el-input :value="pricing_leader_scope.row.to===99999999?'∞':pricing_leader_scope.row.to"
                                  size="mini"
                                  disabled/>
                        </span>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          label="价格">
                          <template slot-scope="pricing_leader_scope">
                            <el-input-number class="input" size="mini" :min="0" :max="99999" :controls="false"
                                             :disabled="pricing_scope.row.status==10"
                                             v-model="pricing_leader_scope.row.price"/>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          width="100"
                          label="操作">
                          <template slot-scope="pricing_leader_scope">
                            <el-button size="mini" icon="el-icon-delete"
                                       :disabled="pricing_scope.row.status==10"
                                       v-if="pricing_leader_scope.$index===2"
                                       @click="deletePriceLadder(scope.$index,pricing_scope.$index,pricing_leader_scope.$index)">
                              删除
                            </el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                      <div style="text-align: left;margin-top: 10px">
                        <el-button size="mini" icon="el-icon-plus"
                                   :disabled="pricing_scope.row.status==10"
                                   @click="addPriceLadder(scope.$index,pricing_scope.$index)">
                          添加阶梯价
                        </el-button>
                        <span style="color: rgb(183,163,163)">最多只能添加三级阶梯价 ('∞' 代表无穷大)</span>
                      </div>
                    </div>
                    <div style="text-align: center"
                         v-if="!pricing_scope.row.is_leader">没有开启阶梯价
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!--规格库存结束-->

      <!--选择erp商品-->
      <el-dialog title="选择ERP商品" :visible.sync="erp_goods.visible" width="40%">
        <p style="padding: 8px 0" v-show="goods.code">
          <el-tag type="success">{{goods.code}}</el-tag>
        </p>
        <el-input placeholder="输入商品名进行搜索" v-model="erp_goods.name" size="small" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchErpGoods"/>
        </el-input>
        <el-table :data="service.erp_goods_list" @cell-click="selectErpGoods">
          <el-table-column prop="code" label="商品编码"/>
          <el-table-column prop="name" label="商品名称"/>
          <el-table-column label="库存重量">
            <template slot-scope="scope">
              {{parseFloat(scope.row.stock_weight)}}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          small
          style="text-align: center;margin-top: 10px"
          layout="prev, pager, next"
          @current-change="changeErpGoodsPage"
          :page-size="erp_goods.pre_page"
          :total="erp_goods.total_count">
        </el-pagination>
      </el-dialog>
      <!--erp商家结束-->
    </el-form>
  </div>
</template>

<script>
import lodash from 'lodash'

const LEADER_PRICE = [
  {
    from: 1,
    to: 0,
    price: 0
  },
  {
    from: 1,
    to: 99999999,
    price: 0
  }
]
export default {
  name: 'info',
  props: ['editData'],
  watch: {
    async editData (data) {
      this.type = parseInt(data.is_sync_erp) ? 'erp' : 'default'
      this.goods.is_sync_erp_status = data.is_sync_erp
      this.goods.goods_attribute_id = data.goods_attribute_id
      this.goods.is_pricing = !!parseInt(data.is_pricing)
      // 获取规格
      if (!parseInt(data.is_sync_erp)) {
        await this.getSkuDetail(this.goods.goods_attribute_id)
      }
      // 获取渠道
      if (!this.service.pricingData.length) {
        await this.getPricingData()
      }
      this.goods.code = data.code
      const tmp = JSON.parse(data.select_sku_list) || {}
      this.select_sku.list = tmp.select_sku_list || []
      this.select_sku.comb_list = tmp.select_sku_comb_list || []
      const result_list = data.sku.map(item => {
        let {sku_list, erp_sku_id, leader_price, pricing_list} = item
        if (!leader_price) {
          leader_price = lodash.cloneDeepWith(LEADER_PRICE)
        } else {
          leader_price = JSON.parse(leader_price) || []
        }
        // 渠道价
        pricing_list = JSON.parse(pricing_list) || []
        pricing_list = this.service.pricingData.map(item => {
          // console.log(item)
          const {price_type_id} = item
          const priceItem = pricing_list.find(ii => ii.price_type_id == price_type_id)
          if (priceItem) {
            return {...priceItem, status: parseInt(priceItem.status) || 11, price_type_name: item.price_type_name, is_default: item.is_default}
          }
          return {
            ...item,
            status: 10, // 新增价格体系默认关闭
            price: 0,
            market_price: 0,
            is_leader: false,
            leader_price: lodash.cloneDeepWith(LEADER_PRICE)
          }
        })
        console.log(pricing_list, 'pricing_list')
        // erp模式
        if (erp_sku_id) {
          return {
            ...item,
            leader_price,
            pricing_list
          }
        } else { // 标准模式
          const json_sku_list = JSON.parse(sku_list)
          const tmp = {}
          json_sku_list.forEach((item, index) => {
            tmp[`sku${index}`] = item
          })
          return {...item, ...tmp, sku_list: json_sku_list, leader_price, pricing_list}
        }
      })
      this.select_sku.result_list = result_list
      this.initSkuList = result_list// 暂存编辑数据
      console.log(this.select_sku.result_list, 'this.select_sku.result_list')
    }
  },
  computed: {
    isDefalutPrice () {
      if (this.service.pricingData.length) {
        let temp = []
        temp = this.service.pricingData.filter(item => parseInt(item.is_default) === 10)
        return !!temp.length
      } else {
        return false
      }
    }
  },
  data () {
    return {
      tixix: false,
      initSkuList: [], // 编辑模式初始化数据
      type: 'default',
      erp_goods: {
        visible: false,
        page:
            1,
        pre_page:
            5,
        total_count:
            0,
        name:
            ''
      },
      goods: {
        goods_attribute_id: '',
        skuArray: '', // 标准商品属性特殊格式
        goods_spec_format: '', //	商品规格
        sort: 0, // 排序
        code: '', // 商家编码
        is_sync_erp_status: '0',
        stock: 0, // 总库存
        is_pricing: false // 是否开启渠道价
      },
      rules: {
        goods_attribute_id: [
          {required: true, message: '请选择商品类型', trigger: 'blur'}
        ]
      },
      select_sku: {
        list: [], // 一维数组
        comb_list: [], // 二维数组
        result_list: [] // 结果集数组
      },
      service: {
        loading: false,
        attr_list: [],
        erp_goods_list: [],
        sku_list: [],
        pricingData: []
      }
    }
  },
  async created () {
    // 商品类型
    this.service.loading = true
    const {err, data} = await this.$service.goods.goods_common_api.attr_list()
    if (err) return
    this.service.attr_list = data.result
    this.goods.goods_attribute_id = 1
    await Promise.all([
      this.getSkuDetail(1),
      this.getErpGoodsList(), // erp 商品
      this.getPricingData() // 获取价格体系
    ])
    this.service.loading = false
  },
  methods: {
    // 模式切换
    isPricingChange (value) {
      if (value) {
        if (this.service.pricingData.length) {
          this.goods.is_pricing = value
        } else {
          this.$confirm('没有设置价格体系,无法开启价格体系模式，是否去设置?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push('/goods/pricing/add')
          })
        }
      } else {
        this.goods.is_pricing = value
      }
    },
    // 获取价格体系
    async getPricingData () {
      const {err, data} = await this.$service.goods.pricing.pricing_list_for_goods()
      if (err) return
      this.service.pricingData = data.result
    },
    // 计算市场价
    salesChange (index, value) {
      this.select_sku.result_list[index].market_price = parseInt(value / 0.9)
    },
    leaderChange (skuIndex, index, value) {
      if (index < 2) {
        if (this.select_sku.result_list[skuIndex].leader_price[index + 1]) {
          this.select_sku.result_list[skuIndex].leader_price[index + 1].from = value + 1
        }
      }
    },
    leaderPriceChange (skuIndex, mindex, index, value) {
      if (index < 2) {
        if (this.select_sku.result_list[skuIndex].pricing_list[mindex].leader_price[index + 1]) {
          this.select_sku.result_list[skuIndex].pricing_list[mindex].leader_price[index + 1].from = value + 1
        }
      }
    },
    // 获取店铺经营范围
    async getRegion () {
      const {err: errRegion, data: regionData} = await this.$service.shop.index.region()
      if (errRegion) {
        this.$alert('未设置店铺经营范围, 请先设置经营范围!', '经营范围错误', {type: 'error'})
        return
      }
      this.leaderData = regionData.data || [] // 店铺销售区域
    },
    // 删除一行区域阶梯价
    deleteLadder (parentIndex, index) {
      if (this.select_sku.result_list[parentIndex].leader_price.length <= 2) {
        this.$message.error('最少要有两级阶梯价')
        return
      }
      this.select_sku.result_list[parentIndex].leader_price = this.select_sku.result_list[parentIndex].leader_price.filter((item, i) => i !== index).map((item, ii) => {
        if (ii) {
          return {...item, to: 99999999}
        }
        return item
      })
    },
    // 删除一行渠道价阶梯价
    deletePriceLadder (parentIndex, mindex, index) {
      if (this.select_sku.result_list[parentIndex].pricing_list[mindex].leader_price.length <= 2) {
        this.$message.error('最少要有两级阶梯价')
        return
      }
      this.select_sku.result_list[parentIndex].pricing_list[mindex].leader_price = this.select_sku.result_list[parentIndex].pricing_list[mindex].leader_price.filter((item, i) => i !== index).map((item, ii) => {
        if (ii) {
          return {...item, to: 99999999}
        }
        return item
      })
    },
    // 新增一行区域阶梯价
    addLadder (index) {
      if (this.select_sku.result_list[index].leader_price.length < 3) {
        this.select_sku.result_list[index].leader_price[1].to = this.select_sku.result_list[index].leader_price[1].from + 1
        this.select_sku.result_list[index].leader_price.push({
          from: 0,
          to: 99999999,
          price: 0
        })
      }
    },
    // 新增一行渠道价阶梯价
    addPriceLadder (index, index2) {
      const pricing_list = this.select_sku.result_list[index].pricing_list
      const pricing = pricing_list[index2]
      if (pricing.leader_price.length < 3) {
        pricing.leader_price[1].to = pricing.leader_price[1].from + 1
        pricing.leader_price.push({
          from: 1,
          to: 99999999,
          price: 0
        })
        this.select_sku.result_list[index].pricing_list = pricing_list
      }
    },
    // 规格点击
    clickSkuCell (sku, index, spec_name) {
      const {spec_value_id, spec_value_name, spec_id} = sku
      const is_has = this.select_sku.list.find(item => item.spec_value_id === spec_value_id)
      if (is_has) {
        const tmp_list = [...this.select_sku.comb_list]
        tmp_list[index] = tmp_list[index].filter(item => item.spec_value_id !== spec_value_id)
        this.select_sku.comb_list = [...tmp_list]
        this.select_sku.list = this.select_sku.list.filter(item => item.spec_value_id !== spec_value_id)
      } else {
        const tmp_list = [...this.select_sku.comb_list]
        tmp_list[index] = tmp_list[index] ? tmp_list[index] : []
        tmp_list[index].push({spec_value_id, spec_value_name, spec_id, spec_name})
        this.select_sku.comb_list = [...tmp_list].map(item => item || [])
        this.select_sku.list.push({spec_value_id, spec_value_name, spec_id, spec_name})
      }

      // 组合数组
      function getArrayByArrays (arrays) {
        let arr = ['']
        for (let i = 0; i < arrays.length; i++) {
          arr = getValuesByArray(arr, arrays[i])
        }
        return arr
      }

      function getValuesByArray (arr1, arr2) {
        const arr = []
        for (let i = 0; i < arr1.length; i++) {
          let v1 = arr1[i]
          for (let j = 0; j < arr2.length; j++) {
            let v2 = JSON.stringify(arr2[j])
            let value = `${v1}@${v2}`
            arr.push(value)
          }
        }
        return arr
      }

      const array = getArrayByArrays(this.select_sku.comb_list.filter(item => item.length)).filter(item => item)
      let select_sku_result_list = array.map(item => {
        const tmp = {
          weight: 0, // 重量
          kthree_code: '', // k3编码
          market_price: 0,
          stock: 0,
          price: 0,
          is_leader: false,
          leader_price: lodash.cloneDeepWith(LEADER_PRICE),
          pricing_list: this.service.pricingData.map(item => {
            return {
              ...item,
              price: 0,
              market_price: 0,
              is_leader: false,
              leader_price: lodash.cloneDeepWith(LEADER_PRICE)
            }
          })
        }
        let index = 0
        tmp.sku_list = item.split('@').filter(item => item).map(i => {
          const value = JSON.parse(i)
          return tmp[`sku${index++}`] = value
        })
        // 找出原始数据里是否有已存在sku
        const oldSku = this.initSkuList.find(initItem => {
          const {sku_list = []} = initItem
          const f1 = sku_list.map(to => {
            return `${parseInt(to.spec_id)}|${parseInt(to.spec_value_id)}`
          }).join('@')
          const f2 = tmp.sku_list.map(to => {
            return `${parseInt(to.spec_id)}|${parseInt(to.spec_value_id)}`
          }).join('@')
          return f1 === f2
        })
        if (oldSku) return oldSku
        return tmp
      })
      console.log('select_sku_result_list', select_sku_result_list)
      this.select_sku.result_list = select_sku_result_list
      this.initSkuList = select_sku_result_list
    },

    // 获取标准规格信息
    async getSkuDetail (id) {
      this.select_sku.result_list = [] // 滞空
      this.select_sku.list = []
      this.select_sku.comb_list = []
      const {err, data} = await this.$service.goods.goods_common_api.get_default_attr_detail_list(id)
      if (err) return
      this.service.sku_list = data.result
      // console.log("zz", this.service.sku_list);
    },
    // 选择erp商品
    async selectErpGoods (row, column, cell, event) {
      this.select_sku.result_list = [] // 滞空
      const {id, name} = row
      // 获取详情
      const {err, data} = await this.$service.goods.goods_common_api.get_erp_goods({goods_id: id})
      if (err) return
      const result = data.result // TODO 结果集
      this.goods.is_sync_erp_goods = JSON.stringify(row)// 设置erp值
      this.select_sku.result_list = result.map(item => {
        const tmp = {
          market_price: 0,
          price: 0,
          stock: 0,
          is_leader: false,
          leader_price: lodash.cloneDeepWith(LEADER_PRICE),
          pricing_list: this.service.pricingData.map(item => {
            return {
              ...item,
              price: 0,
              market_price: 0,
              is_leader: false,
              leader_price: lodash.cloneDeepWith(LEADER_PRICE)
            }
          })
        }
        const {id, aux_unit_name, cost_price, market_price, price, virtual_stock, stock_weight, goods_code, denominator, molecule} = item
        tmp.sku_erp_sku_id = id
        tmp.erp_sku_name = aux_unit_name
        tmp.sku_v_stock = virtual_stock// 虚拟库存
        return {...item, ...tmp}
      })
      this.goods.code = name
      this.erp_goods.visible = false
    },
    // 改变erp商品页
    changeErpGoodsPage (page) {
      this.erp_goods.page = page
      this.getErpGoodsList()
    },
    searchErpGoods () {
      this.erp_goods.page = 1
      this.getErpGoodsList()
    },
    // 获取erp商品数据
    async getErpGoodsList () {
      const {err, data} = await this.$service.goods.goods_common_api.erp_goods_list({
        page: this.erp_goods.page,
        pre_page: this.erp_goods.pre_page,
        name: this.erp_goods.name
      })
      if (err) return
      this.service.erp_goods_list = data.result
      this.erp_goods.total_count = data.total_count
    },
    // 下一步
    next () {
      let result = false
      if (this.select_sku.result_list.length == 0 && this.type === 'default') {
        this.$message.error('最少添加一个规格')
        return result
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          let total_stock = 0
          let is_price_zero = false // 价格是否为0
          let is_weight_zero = false// 重量是否为0
          let leaderFalse = false// 阶梯价合规
          let leaderPriceFalse = false// 阶梯价合规
          let sales_price_dayu_leader_height_price = false // 销售价要大于或等于阶梯价的最高价
          let min_price = 9999999999 // 规格最小价格
          let min_price_price = this.service.pricingData.map(item => {
            return {...item, min_price: 999999999}
          }).filter(item => {
            const {price_type_id} = item
            return !!this.select_sku.result_list.find(ii => {
              const {pricing_list = []} = ii
              return !!pricing_list.find(ll => {
                return !!(ll.price_type_id == price_type_id && ll.status == 11)
              })
            })
          }) // 规格最小渠道价格 取并集

          let sku = this.select_sku.result_list.map(item => {
            const {weight = 1, stock_weight, denominator, molecule, sku_erp_sku_id} = item // 默认值防止erp模式报错
            if (stock_weight !== undefined && !parseInt(stock_weight)) { // erp stock_weight 靠！！还得去查
              const index = this.service.erp_goods_list.findIndex(i => parseInt(item.goods_id) == parseInt(i.id))
              if (index === -1) { // 老数据可能找不到
                item.stock_weight = 0
              } else {
                item.stock_weight = this.service.erp_goods_list[index].stock_weight
              }
            }
            if (sku_erp_sku_id) {
              item.stock = parseFloat(item.stock_weight) * parseFloat(denominator) / parseFloat(molecule)
            }
            // 判断重量是否为0
            if (parseFloat(weight) <= 0 || is_weight_zero) {
              is_weight_zero = true
              return
            }
            // 判断价格为0
            if (this.goods.is_pricing) {
              item.pricing_list.filter(item => item.status == 11).forEach(i => {
                if (parseFloat(i.market_price) <= 0 || parseFloat(i.price) <= 0) {
                  is_price_zero = true
                }
              })
            } else {
              if (parseFloat(item.market_price) <= 0 || parseFloat(item.price) <= 0) {
                is_price_zero = true
                return
              }
            }
            // 阶梯价合规  //销售价要大于或等于阶梯价的最高价
            if (this.goods.is_pricing) {
              item.pricing_list.filter(item => item.status == 11).forEach(item => {
                let maxLeaderPrice = 0
                let tmpPrice = 0
                if (item.is_leader) {
                  item.leader_price.forEach((item, index) => {
                    const {price, from, to} = item
                    maxLeaderPrice = price > maxLeaderPrice ? price : maxLeaderPrice
                    if (parseFloat(to) && parseFloat(to) <= parseFloat(from)) {
                      leaderFalse = true
                    }
                    if (parseFloat(price) <= 0) {
                      is_price_zero = true
                    } else {
                      if ((index != 0) && (tmpPrice < parseFloat(price))) {
                        leaderPriceFalse = true
                      }
                      tmpPrice = parseFloat(price)
                    }
                  })
                  if (item.price < maxLeaderPrice) {
                    sales_price_dayu_leader_height_price = true
                  }
                }
              })
            } else {
              let maxLeaderPrice = 0
              let tmpPrice = 0
              if (item.is_leader) {
                let maxleaderprice = 0
                item.leader_price.forEach((item, index) => {
                  const {price, from, to} = item
                  maxLeaderPrice = price > maxLeaderPrice ? price : maxLeaderPrice
                  if (parseFloat(to) && parseFloat(to) <= parseFloat(from)) {
                    leaderFalse = true
                  }
                  if (parseFloat(price) <= 0) {
                    is_price_zero = true
                  } else {
                    if ((index != 0) && (tmpPrice < parseFloat(price))) {
                      leaderPriceFalse = true
                    }
                    tmpPrice = parseFloat(price)
                  }
                })
                if (item.price < maxLeaderPrice) {
                  sales_price_dayu_leader_height_price = true
                }
              }
            }

            // 最小价格
            if (parseFloat(min_price) > parseFloat(item.price)) {
              min_price = item.price
            }

            min_price_price = min_price_price.map(mitem => {
              const {price_type_id, min_price} = mitem
              const current = item.pricing_list.find(ii => ii.price_type_id == price_type_id && ii.status == 11) || {}
              const {price} = current
              if (price) {
                if (min_price > parseFloat(price)) {
                  return {...mitem, min_price: price}
                }
              }
              return mitem
            })
            if (this.goods.is_pricing) {
              let min = 999999999
              min_price_price.forEach(item => {
                const {min_price} = item
                if (parseFloat(min_price) < min) {
                  min = parseFloat(min_price)
                }
              })
              min_price = min
            }

            // 总库存
            total_stock += item.stock
            return {...item}
          })
          // console.log(sku)
          // return

          if (is_weight_zero) {
            setTimeout(() => {
              this.$message.error('规格重量必须大于0')
            }, 500)
          }
          if (is_price_zero) {
            setTimeout(() => {
              this.$message.error('市场价 销售价 阶梯价不能为0')
            }, 500)
            return
          }

          if (leaderFalse) {
            setTimeout(() => {
              this.$message.error('阶梯价结束门槛必须大于启示门槛')
            }, 500)
          }

          if (leaderPriceFalse) {
            setTimeout(() => {
              this.$message.error('阶梯价必须设置为价格递减！')
            }, 500)
          }

          if (sales_price_dayu_leader_height_price) {
            setTimeout(() => {
              this.$message.error('销售价格必须大于最大阶梯价格')
            }, 500)
          }

          // 编辑模式找出删除的sku集合;
          let deleteObject = {}
          if (this.editData.sku) {
            const deleteSkuArray = this.editData.sku.filter(item => {
              const {sku_id = 0} = item
              return !sku.find(sku => parseInt(sku.sku_id) === parseInt(sku_id))
            }).map(item => item.sku_id)
            deleteObject = {deleteSkuArray: JSON.stringify(deleteSkuArray)}
          }

          result = {
            ...deleteObject,
            ...{...this.goods, is_pricing: this.goods.is_pricing ? 1 : 0},
            min_price,
            pricing_price: JSON.stringify(min_price_price),
            stock: total_stock, // 总重量
            skuArray: JSON.stringify(sku),
            front_select_sku_list: JSON.stringify({ // 刘哥帮我存一下
              select_sku_list: this.select_sku.list,
              select_sku_comb_list: this.select_sku.comb_list
            }),
            goods_spec_format: JSON.stringify(this.service.sku_list)
          }
        }
      })
      return result
    }
  }
}
</script>

<style scoped>
  @import '../add.css';

  .name {
    cursor: pointer;
  }
</style>
<style>
  #leader .el-input.is-disabled .el-input__inner {
    text-align: center;
  }
</style>
