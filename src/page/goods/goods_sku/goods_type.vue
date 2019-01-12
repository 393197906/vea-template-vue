<template>
  <el-form id="container" :model="goods" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
    <el-form-item label="商家编码" prop="code">
      <el-input v-model="goods.code" @focus="erp_goods.visible= true" placeholder="请选择erp商品编码"/>
    </el-form-item>
    <el-form-item label="同步ERP" prop="is_sync_erp_goods" v-show="goods.code">
      <el-radio v-model="goods.is_sync_erp_goods" :label="1">是</el-radio>
      <el-radio v-model="goods.is_sync_erp_goods" :label="0">否</el-radio>
    </el-form-item>
    <el-form-item label="商品类型" prop="goods_attribute_id">
      <el-select @change="getSkuDetail" v-model="goods.goods_attribute_id" placeholder="请选择商品类型">
        <el-option
          v-for="item in service.attr_list"
          :key="item.attr_id"
          :label="item.attr_name"
          :value="item.attr_id">
        </el-option>
      </el-select>
    </el-form-item>
    <!--规格开始-->
    <el-form-item label="商品规格" v-show="service.sku_list.length">
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
            <el-button @click="clickSkuCell(sku,scope.$index,scope.row.spec_name)"
                       size="mini"
                       v-for="sku in scope.row.values"
                       :key="sku.spec_value_id"
                       :type="select_sku.list.find(item=>item.spec_value_id===sku.spec_value_id)?'primary':''"
            >
              {{sku.spec_value_name}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!--规格结束-->

    <!--规格库存开始-->
    <el-form-item label="商品库存" v-if="select_sku.result_list.length">
      <el-table
        border
        :default-expand-all="false"
        :data="select_sku.result_list"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :gutter="10">
              <el-col :span="4">
                销售价（元）
                <el-input size="mini" v-model="scope.row.sku_sales_price"/>
              </el-col>
              <el-col :span="4">
                市场价（元
                <el-input size="mini" v-model="scope.row.sku_market_price"/>
              </el-col>
              <el-col :span="4">
                成本价（元）
                <el-input size="mini" v-model="scope.row.sku_cost_price"/>
              </el-col>
              <el-col :span="4">
                虚拟库存
                <el-input size="mini" v-model="scope.row.sku_v_stock"/>
              </el-col>
              <el-col :span="4">
                商家编码
                <el-input size="mini" v-model="scope.row.sku_code"/>
              </el-col>
              <el-col :span="4">
                销量
                <el-input size="mini" v-model="scope.row.sku_sales_number"/>
              </el-col>
            </el-row>
            <!--阶梯价-->
            <el-table
              border
              stripe
              style="margin-top: 10px"
              v-if="scope.row.sku_is_ladder"
              :data="scope.row.sku_ladder_list"
            >
              <el-table-column type="index" label="层级" align="center" width="50"/>
              <el-table-column
                align="center"
                label="优惠门槛(单位)"
              >
                <template slot-scope="props">
                  <el-row :gutter="5">
                    <el-col :span="9">
                      <el-input size="mini" v-model="props.row.door.from"/>
                    </el-col>
                    <el-col :span="3">
                      -
                    </el-col>
                    <el-col :span="9">
                      <el-input size="mini" v-model="props.row.door.to"/>
                    </el-col>
                    <el-col :span="3">
                      <!--{{props.row.sku_name}}-->
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="优惠价格"
              >
                <template slot-scope="props">
                  <el-input v-model="props.row.price" size="mini">
                    <template slot="prepend">价格</template>
                    <template slot="append">元</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="150"
                label="操作"
              >
                <template slot-scope="props">
                  <el-button
                    size="mini"
                    @click="skuLadderDelete(props.$index,scope.$index, props.row,scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--新增阶梯价-->
            <el-button @click="skuLadderAdd(scope.$index)" icon="el-icon-plus" size="mini"
                       v-if="scope.row.sku_is_ladder">新增阶梯价
            </el-button>
            <span v-if="scope.row.sku_is_ladder">最多只能添加三级阶梯价</span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序列" align="center" width="50"/>
        <el-table-column
          v-for="(iitem,iindex) in select_sku.result_list[0].sku_list"
          align="center"
          :key="iindex"
          :prop="`sku${iindex}.spec_value_name`"
          :label="iitem.spec_name"
        />
        <el-table-column
          label="阶梯价"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sku_is_ladder"/>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <!--规格库存结束-->

    <!--选择erp商品-->
    <el-dialog title="选择ERP商品" :visible.sync="erp_goods.visible" width="40%">
      <el-tag type="success" v-show="goods.code">{{goods.code}}</el-tag>
      <!--<el-input size="small" placeholder="搜索品牌" v-model="brand.name" @change="brandSearch"/>-->
      <el-table :data="service.erp_goods_list" @cell-click="selectErpGoods">
        <el-table-column prop="id" label="商品编码"/>
        <el-table-column prop="name" label="商品名称"/>
        <el-table-column prop="stock_weight" label="商品库存"/>
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

</template>

<script>
export default {
  name: 'info',
  data () {
    return {
      erp_goods: {
        visible: false,
        page: 1,
        pre_page: 5,
        total_count: 0,
        name: ''
      },
      goods: {
        goods_attribute_id: '',
        stock_weight: 0, // erp_库存总重量
        sku_picture_vlaues: '', // erp_商品集合json格式
        skuArray: '', // 标准商品属性特殊格式
        leaderArray: '', // 标准商品阶梯价格特
        goods_spec_format: '', //	商品规格
        goods_attribute: '', //	商品属性json
        skuArrayCloud: '', // erp商品属性特殊格式
        skuLeaderCloud: '', // erp商品阶梯价格特殊
        cloudSku: '', //	erp——id
        groupArray: '', // 店铺分组
        qrcode: '', // 二维码
        sort: 0, // 排序
        code: '', // 商家编码
        is_sync_erp_goods: 0,
        is_sync_erp_status: 0
      },
      rules: {
        goods_attribute_id: [
          {required: true, message: '请选择商品类型', trigger: 'blur'}
        ]
      },
      select_sku: {
        list: [], // 一维数组
        comb_list: [], // 二维数组
        result_list: [], // 结果集数组
        format_list: [] // 格式化数组
      },
      service: {
        attr_list: [],
        erpGoodsList: [],
        sku_list: []
      }
    }
  },
  async created () {
    // 商品类型
    const {err, data} = await this.$service.goods.goods_common_api.attr_list()
    if (err) return
    this.service.attr_list = data.result
    // this.service.attr_list.unshift({attr_id: -1, attr_name: '请选择商品类型'})
    // erp 商品
    this.getErpGoodsList()
  },
  methods: {
    // 阶梯价新增行
    skuLadderAdd (index) {
      if (this.select_sku.result_list[index].sku_ladder_list.length >= 3) {
        return
      }
      this.select_sku.result_list[index].sku_ladder_list.push({price: 0, door: {to: 0, from: 0}})
    },
    // 阶梯价删除行
    skuLadderDelete (index, parentIndex, row, parentRow) {
      const tmp = [...this.select_sku.result_list]
      const tmp2 = tmp[parentIndex]
      tmp2.sku_ladder_list = tmp2.sku_ladder_list.filter((i, ii) => ii !== index)
      tmp[parentIndex] = tmp2
      this.select_sku.result_list = [...tmp]
    },
    // 规格点击
    clickSkuCell (sku, index, spec_name) {
      const format_arr = [...this.select_sku.format_list]
      const {spec_value_id, spec_value_name, spec_id} = sku
      const is_has = this.select_sku.list.find(item => item.spec_value_id === spec_value_id)
      if (is_has) {
        const tmp_list = [...this.select_sku.comb_list]
        tmp_list[index] = tmp_list[index].filter(item => item.spec_value_id !== spec_value_id)
        this.select_sku.comb_list = [...tmp_list]
        this.select_sku.list = this.select_sku.list.filter(item => item.spec_value_id !== spec_value_id)
        // format
        format_arr[index].value = format_arr[index].value.filter(item => item.spec_value_id !== spec_value_id)
        this.select_sku.format_list = [...format_arr]
      } else {
        const tmp_list = [...this.select_sku.comb_list]
        tmp_list[index] = tmp_list[index] ? tmp_list[index] : []
        tmp_list[index].push({spec_value_id, spec_value_name, spec_id, spec_name})
        this.select_sku.comb_list = [...tmp_list].map(item => item || [])
        this.select_sku.list.push({spec_value_id, spec_value_name, spec_id, spec_name})
        // format
        format_arr[index].value.push({
          spec_name,
          spec_id,
          spec_value_name,
          spec_value_id,
          spec_show_type: 1,
          spec_value_data: ''
        })
        this.select_sku.format_list = [...format_arr]
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

      const array = getArrayByArrays(this.select_sku.comb_list.filter(item => item.length))
      this.select_sku.result_list = array.map(item => {
        const tmp = {}
        let index = 0
        tmp.sku_list = item.split('@').filter(item => item).map(i => {
          const value = JSON.parse(i)
          return tmp[`sku${index++}`] = value
        })
        tmp.sku_sales_price = 0 // 销售价
        tmp.sku_market_price = 0// 市场价
        tmp.sku_cost_price = 0// 成本价
        tmp.sku_v_stock = 0// 虚拟库存
        tmp.sku_code = 0// 商家编码
        tmp.sku_sales_number = 0// 销量
        tmp.sku_is_ladder = false // 阶梯价开关
        tmp.sku_ladder_list = [
          {price: 0, door: {from: 0, to: 0}, sku_name: tmp['sku0'].spec_value_name}
        ]
        return tmp
      })
      // console.log(this.select_sku.result_list)
    },
    // 获取标准规格信息
    async getSkuDetail (id) {
      const {err, data} = await this.$service.goods.goods_common_api.get_default_attr_detail_list(id)
      if (err) return
      console.log(data)
      this.service.sku_list = data.result
      this.select_sku.format_list = data.result.map(item => {
        const {spec_name, spec_id} = item
        return {spec_name, spec_id, value: []}
      })
    },
    // 选择erp商品
    async selectErpGoods (row, column, cell, event) {
      const {id, name} = row
      // 获取详情
      const {err, data} = await this.$service.goods.goods_common_api.get_erp_goods({goods_id: id})
      if (err) return
      const result = data.result // TODO 结果集
      this.goods.code = name
      this.erp_goods.visible = false
    },
    // 改变erp商品页
    changeErpGoodsPage () {
      this.erp_goods.page = page
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
    // 上一步
    pre () {
      this.$emit('pre')
    },
    // 下一步
    next () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 处理数据
          const sku_arr = [] // 容器
          const leader_arr = [] // 容器
          const a = this.select_sku.result_list.map(item => {
            const {sku_list, sku_sales_price, sku_market_price, sku_cost_price, sku_v_stock, sku_ladder_list} = item
            const sku_name = sku_list.map(sku => (`${sku.spec_id}:${sku.spec_value_id}`)).join(';')
            const sku_array_item = `${sku_name}¦${parseInt(sku_sales_price)}¦${parseInt(sku_market_price)}¦${parseInt(sku_cost_price)}¦${parseInt(sku_v_stock)}¦`
            const tem_arr = []
            sku_ladder_list.forEach(item => {
              const {door: {from, to}, price} = item
              tem_arr.push(parseInt(from))
              tem_arr.push(parseInt(to))
              tem_arr.push(parseInt(price))
            })
            for (let i = tem_arr.length; i < 9; i++) {
              tem_arr.push(0)
            }
            const sku_leader_array_item = `${sku_name}¦${tem_arr.join('¦')}`
            sku_arr.push(sku_array_item)
            leader_arr.push(sku_leader_array_item)
          })
          this.goods.skuArray = sku_arr.join('§')
          this.goods.leaderArray = leader_arr.join('§')
          this.goods.goods_spec_format = JSON.stringify(this.select_sku.format_list.filter(item => item.value.length))
          this.$emit('next', this.goods)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  @import '../add.css';
</style>
