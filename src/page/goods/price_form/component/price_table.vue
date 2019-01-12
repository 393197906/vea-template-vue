<style scoped>
  .table {
    width: 100%;
    text-align: center;
    border-color: #ebebeb;
    border: 1px solid #ebebeb;
  }

  .table th {
    text-align: center;
    padding: 12px 0;
    color: #909399;
  }

  .table tr {
    min-width: 0;
    border-color: #ebebeb;
    /* border-bottom: 1px solid #ebebeb; */
  }

  /*.table tr:hover {*/
  /*background: #f5f7fa;*/
  /*}*/
  .bacitem {
    background: #f5f7fa;
  }

  .table td {
    padding: 12px 0;
    color: #606266;
  }

  .down {
    color: #409eff;
  }

  .page_view {
    text-align: center;
    padding: 12px 0;
  }

  .el-input.is-disabled .el-input__inner {
    text-align: center;
  }

</style>
<style>
  .innerTable .el-table th, .innerTable .el-table tr {
    background-color: #f5f7fa;
  }
</style>
<template>
  <div>
    <!--头部搜索start-->
    <GoodsSearch @searchData="searchData" ref="search"/>
    <table class="table" cellspacing="0" border="1">
      <tr>
        <th>商品名称</th>
        <th>规格(sku)</th>
        <th>重量</th>
        <th>库存</th>
        <th v-if="isPricing==1">渠道类型</th>
        <th>销售价</th>
        <th>市场价</th>
        <th>启用阶梯价</th>
        <th>阶梯价</th>
        <th>操作</th>
      </tr>
      <template v-if="isPricing==1" v-for="(item,st) in tableData">
        <tr v-for="(items,sindex) in item.nsku"    :key="items.goods_name" :class="{bacitem:(st%2==0)}">
          <td :rowspan="item.nsku.length" v-if="sindex==0">{{item.goods_name}}</td>
          <td v-if="items.is_hang" :rowspan="items.len">{{items.sku_name}}</td>
          <td v-if="items.is_hang" :rowspan="items.len">
            {{items.stock_weight}}
          </td>
          <td v-if="items.is_hang" :rowspan="items.len">
            {{items.stock}}
          </td>
          <td>{{items.price_type_name}}</td>
          <td>
            <el-input-number style="width: 100px" class="input" size="mini" :min="0" :max="99999" :controls="false"
                             v-model="items.price"/>
          </td>
          <td>
            <el-input-number style="width: 100px" class="input" size="mini" :min="0" :max="99999" :controls="false"
                             v-model="items.market_price"/>
          </td>
          <td>
            <el-switch v-model="items.is_leader"/>
          </td>
          <td style="width: 400px">
            <template>
              <div v-if="items.is_leader" :class="{innerTable:(st%2==0)}">
                <el-table border :data="items.leader_price" ref="unopentable">
                  <el-table-column label="启始门槛" align="center">
                    <template slot-scope="start_scope">
                      <el-input-number class="input" style="width: 80px" size="mini"
                                       :min="1" :max="99999" :disabled="true"
                                       :controls="false" v-model="start_scope.row.from"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="结束门槛" align="center">
                    <template slot-scope="end_scope">
                      <el-input-number v-if="end_scope.row.to<99999" style="width: 80px"
                                       @change="leaderChange(end_scope.$index,sindex,st,$event)"
                                       class="input" size="mini" :min="0" :max="99999"
                                       :controls="false" v-model="end_scope.row.to"/>
                      <span v-else><el-input :value="end_scope.row.to>=99999?'∞':end_scope.row.to" size="mini"
                                             disabled/></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="价格" align="center">
                    <template slot-scope="price_scope">
                      <el-input-number class="input" style="width: 80px" size="mini" :min="0" :max="99999"
                                       :controls="false" v-model="price_scope.row.price"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="handle_scope">
                      <el-button size="small" v-if="handle_scope.$index==2" @click="delPrice(sindex,st)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="text-align: left;margin-top: 10px">
                  <el-button size="mini" icon="el-icon-plus" @click="addPrice(sindex,st,items.leader_price)">
                    添加阶梯价
                  </el-button>
                  <span style="color: rgb(183,163,163)">最多只能添加三级阶梯价</span>
                </div>
              </div>
              <div v-else>未开启阶梯价</div>
            </template>
          </td>
          <td v-if="items.is_hang" :rowspan="items.len">
            <el-button size="small" :disabled="!$checkActionAccess($ACCESS.PRICE_FORM_EDIT)" type="primary" @click="saveUpdate(items,sindex,items.len,st)">保存</el-button>
          </td>
        </tr>
      </template>
      <template v-if="isPricing==0" v-for="(item,st) in tableData">
        <tr v-for="(items,sindex) in item.nsku" :key="items.goods_name" :class="{bacitem:(st%2==0)}">
          <td :rowspan="item.nsku.length" v-if="sindex==0">{{item.goods_name}}</td>
          <td v-if="items.is_hang">{{items.sku_name}}</td>
          <td v-if="items.is_hang">
            {{items.stock_weight}}
          </td>
          <td v-if="items.is_hang">
            <!--<el-input-number class="input" style="width: 100px" size="mini" :min="0" :max="99999" :controls="false"-->
            <!--v-model="items.stock"/>-->
            {{items.stock}}
          </td>
          <td>
            <el-input-number style="width: 100px" class="input" size="mini" :min="0" :max="99999" :controls="false"
                             v-model="items.price"/>
          </td>
          <td>
            <el-input-number style="width: 100px" class="input" size="mini" :min="0" :max="99999" :controls="false"
                             v-model="items.market_price"/>
          </td>
          <td>
            <el-switch v-model="items.is_leader"/>
          </td>
          <td style="width: 400px">
            <template>
              <div v-if="items.is_leader" :class="{innerTable:(st%2==0)}">
                <el-table border :data="items.leader_price" ref="opentable">
                  <el-table-column label="启始门槛" align="center">
                    <template slot-scope="start_scope">
                      <el-input-number class="input" style="width: 80px" size="mini"
                                       :min="1" :max="99999" :disabled="true"
                                       :controls="false" v-model="start_scope.row.from"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="结束门槛" align="center">
                    <template slot-scope="end_scope">
                      <el-input-number v-if="end_scope.row.to<99999" style="width: 80px"
                                       @change="leaderChange(end_scope.$index,sindex,st,$event)"
                                       class="input" size="mini" :min="0" :max="99999"
                                       :controls="false" v-model="end_scope.row.to"/>
                      <span v-else><el-input :value="end_scope.row.to>=99999?'∞':end_scope.row.to" size="mini"
                                             disabled/></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="价格" align="center">
                    <template slot-scope="price_scope">
                      <el-input-number class="input" style="width: 80px" size="mini" :min="0" :max="99999"
                                       :controls="false" v-model="price_scope.row.price"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="handle_scope">
                      <el-button size="small" v-if="handle_scope.$index==2" @click="delPrice(sindex,st)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="text-align: left;margin-top: 10px">
                  <el-button size="mini" icon="el-icon-plus" @click="addPrice(sindex,st,items.leader_price)">
                    添加阶梯价
                  </el-button>
                  <span style="color: rgb(183,163,163)">最多只能添加三级阶梯价</span>
                </div>
              </div>
              <div v-else>未开启阶梯价</div>
            </template>
          </td>
          <td v-if="items.is_hang">
            <el-button size="small" type="primary" :disabled="!$checkActionAccess($ACCESS.PRICE_FORM_EDIT)" @click="saveUpdate(items,sindex,items.len,st)">保存</el-button>
          </td>
        </tr>
      </template>
    </table>
    <div class="page_view">
      <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next"
                     :page-size="pre_page" :total="count"></el-pagination>
    </div>
  </div>
</template>
<script>
import GoodsSearch from './search'

export default {
  props: {
    isPricing: ''
  },
  data () {
    return {
      pricingData: [], // 价格体系数据
      tableData: [],
      count: 0,
      page: 1,
      pre_page: 10,
      state: '',
      goods_name: '',
      category_id: ''
    }
  },
  components: {
    GoodsSearch
  },
  async created () {
    await this.getPricingData()
    this.getData()
  },
  methods: {
    // 结束门槛
    leaderChange (cindex, sindex, st, value) {
      this.tableData[st].nsku[sindex].leader_price[cindex + 1].from = value + 1
    },
    // 删除阶梯价
    delPrice (sindex, st) {
      this.tableData[st].nsku[sindex].leader_price.pop()
    },
    // 添加阶梯价
    addPrice (sindex, st, tdata) {
      if (tdata.length < 3) {
        let stindex = tdata.length - 1
        if (stindex < 0) {
          this.tableData[st].nsku[sindex].leader_price.push({from: 0, to: 1, price: 0})
        } else {
          let tmp = this.tableData[st].nsku[sindex].leader_price[stindex]
          this.tableData[st].nsku[sindex].leader_price[stindex] = {
            from: tmp.from,
            to: tmp.from + 1,
            price: tmp.price
          }
          this.tableData[st].nsku[sindex].leader_price.push({from: tmp.from + 2, to: 99999, price: 0})
        }
      }
    },
    // 搜索数据
    searchData (data) {
      const {code, state, goods_name, category_id} = data
      this.state = state
      this.goods_name = goods_name
      this.category_id = category_id
      this.getData()
    },
    // 获取参数
    getParams () {
      let opts = {
        is_pricing: this.isPricing,
        page: this.page,
        pre_page: this.pre_page
      }
      if (this.goods_name != '') {
        opts['goods_name'] = this.goods_name
      }
      if (this.category_id != '') {
        opts['category_id'] = this.category_id
      }
      if (this.state !== '') {
        opts['state'] = this.state
      }
      return opts
    },
    // 获取价格体系
    async getPricingData () {
      const {err, data} = await this.$service.goods.pricing.pricing_list_for_goods()
      if (err) return
      this.pricingData = data.result
    },
    // 获取数据
    async getData () {
      this.loading = true
      const {err, data} = await this.$service.goods.price_form.list(this.getParams())
      this.loading = false
      if (err) return
      let tArr = data.data
      tArr.forEach(item => {
        item.sku.forEach(sitem => {
          sitem.pricing_list = sitem.pricing_list ? JSON.parse(sitem.pricing_list) : []
        })
      })
      for (let item of tArr) {
        item.nsku = new Array()
        for (let sitem of item.sku) {
          let tlen = sitem.pricing_list.length
          sitem.pricing_list = sitem.pricing_list.filter(item => item.status == 11 || item.status === undefined).map(item => {
            const target = this.pricingData.find(p => p.price_type_id == item.price_type_id)
            if (target) {
              return {...item, price_type_name: target.price_type_name}
            }
            return item
          })
          if (tlen > 0) {
            for (let i = 0; i < sitem.pricing_list.length; i++) {
              item.nsku.push({
                is_hang: (i == 0),
                len: sitem.pricing_list.length,
                goods_id: sitem.goods_id,
                sku_id: sitem.sku_id,
                sku_name: sitem.sku_name,
                stock_weight: sitem.stock_weight,
                stock: sitem.stock,
                // is_leader: eval(sitem.is_leader),
                price: sitem.pricing_list[i].price,
                is_leader: eval(sitem.pricing_list[i].is_leader),
                leader_price: sitem.pricing_list[i].leader_price,
                market_price: sitem.pricing_list[i].market_price,
                price_type_id: sitem.pricing_list[i].price_type_id,
                price_type_name: sitem.pricing_list[i].price_type_name,
                status: sitem.pricing_list[i].status
              })
            }
            // item.nsku = item.nsku.filter(item => item.status == 11)
            // item.nsku = item.nsku.map((n, index) => {
            //   return {...n, len: item.nsku.length, is_hang: index == 0}
            // })
          } else {
            sitem['leader_price'] = sitem.leader_price ? JSON.parse(sitem.leader_price) : []
            if (sitem['leader_price'] == '') {
              sitem['leader_price'] = []
            }
            sitem['is_leader'] = (sitem['is_leader'] == 1)
            sitem['is_hang'] = true
            sitem['len'] = 0
            item.nsku.push(sitem)
          }
        }
      }
      this.tableData = tArr
      console.log(this.tableData)
      this.count = data.total
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData()
    },
    async saveUpdate (sjson, sindex, len, st) {
      let opts = {
        goods_id: sjson.goods_id,
        is_pricing: this.isPricing,
        sku_id: sjson.sku_id,
        sku_name: sjson.sku_name,
        stock: sjson.stock,
        stock_weight: sjson.stock_weight
      }
      if (this.isPricing == 1) {
        let tmpArr = new Array()
        let tArr = new Array()
        for (let i = sindex; i < (sindex + len); i++) {
          let tmpleader = this.tableData[st].nsku[i].leader_price ? this.tableData[st].nsku[i].leader_price : []
          if (this.tableData[st].nsku[i].price == 0) {
            this.$message.error('销售价不能为0！')
            return
          }
          if (this.tableData[st].nsku[i].market_price == 0) {
            this.$message.error('市场价不能为0！')
            return
          }

          if (this.tableData[st].nsku[i].market_price < this.tableData[st].nsku[i].price) {
            this.$message.error('销售价不能大于市场价！')
            return
          }
          for (let item of tmpleader) {
            if (this.tableData[st].nsku[i].is_leader) {
              if (item.price == 0) {
                this.$message.error('阶梯价不能为0！')
                return
              } else if (item.price > this.tableData[st].nsku[i].price) {
                this.$message.error('阶梯价不能超过销售价！')
                return
              }
            }
          }
          tmpArr.push({
            status: this.tableData[st].nsku[i].status,
            price: this.tableData[st].nsku[i].price,
            is_leader: this.tableData[st].nsku[i].is_leader,
            leader_price: tmpleader,
            market_price: this.tableData[st].nsku[i].market_price,
            price_type_id: this.tableData[st].nsku[i].price_type_id,
            price_type_name: this.tableData[st].nsku[i].price_type_name
          })
        }
        const tmpArrAll = this.tableData[st].sku.map(item => {
          return item.pricing_list
            .map(ii => {
              const {price_type_id} = ii
              return this.tableData[st].nsku.find(iii => iii.price_type_id == price_type_id)
            })
        })
        opts.pricing_list_all = tmpArrAll
        opts.pricing_list = tmpArr
      } else if (this.isPricing == 0) {
        let tmpleader = this.tableData[st].nsku[sindex].leader_price ? this.tableData[st].nsku[sindex].leader_price : []
        if (this.tableData[st].nsku[sindex].price == 0) {
          this.$message.error('销售价不能为0！')
          return
        }
        if (this.tableData[st].nsku[sindex].market_price == 0) {
          this.$message.error('市场价不能为0！')
          return
        }
        if (this.tableData[st].nsku[sindex].market_price < this.tableData[st].nsku[sindex].price) {
          this.$message.error('销售价不能大于市场价！')
          return
        }
        for (let item of tmpleader) {
          if (this.tableData[st].nsku[sindex].is_leader) {
            if (item.price == 0) {
              this.$message.error('阶梯价不能为0！')
              return
            } else if (item.price > this.tableData[st].nsku[sindex].price) {
              this.$message.error('阶梯价不能超过销售价！')
              return
            }
          }
        }
        opts.is_leader = (this.tableData[st].nsku[sindex].is_leader) ? 1 : 0
        opts.market_price = this.tableData[st].nsku[sindex].market_price
        opts.price = this.tableData[st].nsku[sindex].price
        opts.leader_price = tmpleader
      }
      this.loading = true
      const {err, data} = await this.$service.goods.price_form.update(opts)
      this.loading = false
      if (err) return
      this.$message.success('修改成功')
    }
  }
}
</script>
