<style scoped>
  .goods_sel_left {
    margin-right: 10px;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  .text-align {
    text-align: center;
  }

  .box-card1 {
    width: 39%;
    margin-right: 15px;
    float: left;
  }

  .box-card2 {
    width: calc(61% - 20px);
    float: left;
  }

  .showScroll {
    max-height: 500px;
    overflow-y: auto
  }
</style>
<template>
  <div>
    <div>
      <el-input size="small" style="width:170px;" v-model="goods_name_key" placeholder="请输入商品名称关键字"
                clearable></el-input>
      <el-cascader clearable expand-trigger="hover" change-on-select :props="category_props" size="small"
                   :options="category_list"
                   v-model="category_options" placeholder="请选择商品分类" clearable></el-cascader>
      <el-button size="small" type="primary" @click="searchGoods" style="margin-left: 10px"><i
        class="el-icon-search"></i> 搜索
      </el-button>
    </div>
    <el-row style="margin-top: 15px">
      <el-card class="box-card1" :body-style="{ padding: '0px 5px' }">
        <div class="clearfix" style="text-align: center">
          <span>可选商品列表</span>
        </div>
        <el-table border ref="multipleTable" :data="goods_data" tooltip-effect="dark" style="width: 100%"
                  v-loading="goods_loading">
          <el-table-column prop="goods_name" label="商品">
            <template slot-scope="scope">
              <div v-if="scope.row.sku[0].aux_unit_name">
                {{scope.row.goods_name}}({{scope.row.sku[0].aux_unit_name}})
              </div>
              <div v-if="scope.row.sku[0].sku_list">
                <span>{{scope.row.goods_name}}(</span>
                <span v-for="(item,iindex) in JSON.parse(scope.row.sku[0].sku_list)" :key="item.spec_value_id">{{item.spec_value_name}}
                  <span v-if="iindex<(JSON.parse(scope.row.sku[0].sku_list).length-1)">&nbsp;&nbsp;</span>
                </span>
                <span>)</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" align="center">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="hover">
                <sku-table v-if="scope.row.sku.length" :is-pricing="scope.row.is_pricing"
                           :sku-data="scope.row.sku"></sku-table>
                <el-button slot="reference" size="mini">查看价格</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" align="center"></el-table-column>
          <el-table-column prop="handel" label="操作" align="center">
            <template slot-scope="scope">
              <el-button :type="select_statu[scope.row.sku[0].sku_id] ? 'info' : 'primary'" size="small"
                         @click="leftGoodsChange(scope.row)"
                         :disabled="select_statu[scope.row.sku[0].sku_id]? true : false">
                {{select_statu[scope.row.sku[0].sku_id] ? '已参与活动' : '参与活动'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <el-pagination
            class="text-align"
            background
            layout="prev, pager, next"
            :page-size="pre_page"
            :current-page.sync="page"
            @current-change="leftCurrentChange"
            :total="total_count">
          </el-pagination>
        </div>
      </el-card>
      <el-card class="box-card2" :body-style="{ padding: '0px 5px 5px 5px' }">
        <div class="clearfix" style="text-align: center">
          <span>已选商品列表</span>
        </div>
        <el-table border ref="multipleTable" :data="goods_data_right" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="goods_name" label="商品">
            <template slot-scope="scope">
              <div v-if="scope.row.sku[0].aux_unit_name">
                {{scope.row.goods_name}}({{scope.row.sku[0].aux_unit_name}})
              </div>
              <div v-if="scope.row.sku[0].sku_list">
                <span>{{scope.row.goods_name}}(</span>
                <span v-for="(item,iindex) in JSON.parse(scope.row.sku[0].sku_list)" :key="item.spec_value_id">{{item.spec_value_name}}
                <span v-if="iindex<(JSON.parse(scope.row.sku[0].sku_list).length-1)">&nbsp;&nbsp;</span></span>
                <span>)</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" align="center">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="hover">
                <sku-table v-if="scope.row.sku.length" :is-pricing="scope.row.is_pricing"
                           :sku-data="scope.row.sku"></sku-table>
                <el-button slot="reference" size="mini">查看价格</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" align="center"></el-table-column>
          <!--<el-table-column prop="max_price" label="max" align="center"></el-table-column>-->
          <el-table-column prop="discount" label="秒杀价" width="120" v-if="componentKey=='seckill'">
            <template slot-scope="scope">
              <el-input-number size="mini" :min="0.01" :max="scope.row.max_price" :controls="false"
                               v-model="scope.row.discount"
                               style="width:100px"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="can_count" label="限购" width="120" v-if="componentKey=='seckill'">
            <template slot-scope="scope">
              <el-input-number size="mini" :min="1" :controls="false" v-model="scope.row.can_count"
                               style="width:100px"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="discount" label="折扣" width="120" v-if="componentKey=='discount'">
            <template slot-scope="scope">
              <el-input-number
                :precision="2"
                size="mini"
                :min="0.01"
                :max="9.99"
                :controls="false"
                :step="0.01"
                @blur="scope.row.discount = scope.row.discount.toFixed(2)"
                v-model="scope.row.discount"
                style="width:100px;">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="handel" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="info" size="mini" @click="rightGoodsChange(scope.row,scope.$index)">取消参与</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import skuTable from './skuTable'

export default {
  components: {skuTable},
  data () {
    return {
      page: 1,
      pre_page: 10,
      total_count: 0,
      right_page: 1,
      goods_data: [],
      goods_data_right: [],
      activeGoods: [],
      goods_name_key: '',
      category_list: [],
      category_options: [],
      category_id: '',
      category_props: {
        value: 'category_id',
        label: 'category_name',
        children: 'children'
      },
      loading: false,
      goods_set: new Set(),
      select_statu: {},
      goods_loading: false
    }
  },
  props: {
    goodsDataRight: Array,
    componentKey: String
  },
  created () {
    this.goods_data_right = this.goodsDataRight
    this.goodsList()
    this.categoryList()
    this.goods_data_right.forEach(item => {
      const index = this.goods_data.findIndex(obj => obj.sku[0].sku_id === item.sku_id)
      if (index > -1) {
        this.select_statu[index].statu = 1
      }
    })
  },

  methods: {
    showPrice (data) {
      const data_detail = data
      let is_pricing = !!parseInt(data_detail.is_pricing)
      let skuData = data_detail.sku.map(item => {
        const {sku_list = '[]'} = item
        const json_sku_list = JSON.parse(sku_list)
        const tmp = {}
        json_sku_list.forEach((item, index) => {
          tmp[`sku${index}`] = item
        })
        return {...item, ...tmp}
      })
      return {is_pricing: is_pricing, skuData: skuData}
    },

    /** 获取商品分类 */
    async categoryList () {
      const {
        err,
        data
      } = await
        this.$service.goods.goods_common_api.category_list()
      this.category_list = data.result || []
    },

    /** 搜索商品 */
    searchGoods () {
      this.category_id = this.category_options[
        this.category_options.length - 1
      ]
      this.page = 1
      this.goodsList()
    },

    /** 商品列表 */
    async goodsList () {
      this.goods_loading = true
      const {
        err,
        data
      } = await
        this.$service.goods.goods_common_api.skusgoodsList({
          page: this.page,
          pre_page: this.pre_page,
          goods_name: this.goods_name_key,
          category_id: this.category_id,
          state: 1
        })
      let tmpres = data.result
      let narr = new Array()
      tmpres.forEach(item => {
        const {is_pricing, skuData} = this.showPrice(item)
        skuData.forEach(iitem => {
          narr.push({
            ...item,
            isMore: (skuData.length > 1),
            discount: 0,
            can_count: 0,
            stock: iitem.stock,
            is_pricing: is_pricing,
            sku: [iitem]
          })
        })
      })
      this.goods_data = narr
      narr.forEach(i => this.goods_set.add(i.sku[0].sku_id))
      for (let i of this.goods_set.keys()) {
        this.$set(this.select_statu, i, 0)
      }
      this.goods_data_right.forEach(item => {
        this.select_statu[item.sku[0].sku_id] = 1
      })
      this.total_count = data.total_count
      this.goods_loading = false
    },

    leftCurrentChange (val) {
      this.page = val
      this.goodsList()
    },

    async leftGoodsChange (select, index) {
      // console.log(select);
      // if (select.isMore && (this.componentKey == 'seckill')) {
      //   this.$message.error("多规格商品暂时不能参与秒杀");
      //   return;
      // }
      if (select.stock == 0) {
        this.$message.error('商品库存不足！')
        return
      }
      // const hasSelect = this.goods_data_right.some(item => item.goods_id === select.goods_id)
      // if(hasSelect) return
      this.select_statu[select.sku[0].sku_id] = 1
      // 计算可以设置的最大秒杀价格
      let max_price = 999999999
      // const {
      //   err,
      //   data
      // } = await this.$service.goods.goods_common_api.goods_edit_detail(select.goods_id);
      // if (err) return;
      const {is_pricing = 0, sku = []} = select
      const item = sku[0] || {}
      let {price = 0, pricing_list, is_leader = false, leader_price} = item
      if (is_pricing===false ||is_pricing==0 ) {
        if (is_leader) {
          leader_price = (JSON.parse(leader_price) || leader_price) || []
          let min_price = max_price
          leader_price.forEach(item => {
            let {price} = item
            price = parseFloat(price)
            min_price = price < min_price ? price : min_price
          })
          max_price = min_price
        } else {
          max_price = parseFloat(price)
        }
      } else {
        pricing_list = JSON.parse(pricing_list) || []
        let min_price = max_price
        pricing_list.forEach(item => {
          const {price = 0, is_leader = false, leader_price} = item
          let item_min_price
          if (is_leader) {
            let min_price = max_price
            leader_price.forEach(item => {
              let {price} = item
              price = parseFloat(price)
              min_price = price < min_price ? price : min_price
            })
            item_min_price = min_price
          } else {
            item_min_price = parseFloat(price)
          }
          min_price = item_min_price < min_price ? item_min_price : min_price
        })
        max_price = min_price
      }
      this.goods_data_right.push({...select, max_price})
      this.$emit('goodsDataRight', this.goods_data_right)
    },

    rightGoodsChange (selection, index) {
      this.select_statu[selection.sku[0].sku_id] = 0
      this.goods_data_right.splice(index, 1)
      this.goods_data.push({})
      this.goods_data.pop()
      // console.log(scope.$index)
    }
  }
}

</script>
