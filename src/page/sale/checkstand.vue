<template>
  <div class="container" :style="{height:`${containerHeight}px`}">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-card class="box-card" id="customerInfo" :body-style="{padding:'5px'}">
          <el-row>
            <el-col :span="2">
              <el-button type="primary" size="small" @click="centerDialogVisible = true">选择客户</el-button>
            </el-col>
            <el-col :span="22" style="line-height: 32px">
              <el-row v-if="user_selected.length>0">
                <el-col :span="6">
                  门店名称： {{user_selected[0].store_name}}
                </el-col>
                <el-col :span="6">
                  负责人： {{user_selected[0].store_person}}
                </el-col>
                <el-col :span="6">
                  渠道类型： {{user_selected[0].channel_name}}
                </el-col>
                <el-col :span="6">
                  店铺地址： {{user_selected[0].store_address}}
                </el-col>
              </el-row>
              <div v-else style="color:red">还未选择客户信息!</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <!--左侧已选商品列表 开始-->
      <el-col :span="8" class="overy">
        <el-card :body-style="{padding:'2px'}">
          <div slot="header">
            <span>购物车</span>
            <el-button style="color:#f56c6c;float: right; padding: 3px 0" type="text" @click="clearCart">清空</el-button>
          </div>
          <goods-table ref="cart" :height='height' :table-data.sync="tableData" :selected-good.sync="selectedGoods"
                       :can-edit="true" @stockHandel="stockHandel"></goods-table>
        </el-card>
      </el-col>
      <!--左侧已选商品列表 结束-->
      <!--右侧待选商品列表 开始-->
      <el-col :span="16" class="overy">
        <el-card v-loading="loading" :body-style="{padding:'10px'}">
          <div slot="header" style="position: relative">
            <span>商品列表</span>
            <GoodsSearch style="position: absolute;top:-17px;right:-15px" :searchType="stype"
                         @searchData="searchData"
                         ref="search"/>
          </div>
          <div :style="{height:`${height-76}px`}">
            <div class="grid-content bg-purple-light">
              <el-row :gutter="5">
                <el-col :span="4" v-for="item in goodlist" :key="item.goods_id">
                  <div class="cgood" @click="showGoodPrice(item)">
                    <div class="cgoodCon" :style="{height:`${height/4}px`}">
                      <img v-if="item.image" :src="item.image"/>
                      <img v-if="item.pic_cover_small" :src="item.pic_cover_small"/>
                      <el-tooltip v-if="item.goods_name.length>18" effect="dark" :content="item.goods_name "
                                  placement="bottom">
                        <h5>{{item.goods_name |sublen(18)}}</h5>
                      </el-tooltip>
                      <h5 v-else>{{item.goods_name}}</h5>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="prev">
              <el-pagination background layout="prev, pager, next" :current-page="pramas.page"
                             :page-size="pramas.pre_page"
                             :total="total_count" @current-change="cGoodsPage"></el-pagination>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--右侧待选商品列表 结束-->
    </el-row>
    <!--底部配送方式、支付方式选择 开始-->
    <el-card class="closing" :body-style="{padding:0}">
      <el-row>
        <el-col :span="7">
          <!-- 自提 -->
          <div class="closing_p">
            <h5 style="float:left;">配送方式</h5>
            <el-radio-group v-model="distriType">
              <el-radio :label="1">物流配送</el-radio>
              <el-radio :label="2">上门自提</el-radio>
            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="7">
          <!-- 付款方式 -->
          <div class="closing_p">
            <h5 style="float:left;">付款方式</h5>
            <el-radio-group v-model="payType">
              <el-radio :label="4">货到付款</el-radio>
            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="4" :offset="6">
          <div class="payment_warp" v-if="$checkActionAccess($ACCESS.ORDERDESK_CREATE)">
            <el-button type="primary" class="payment" @click="settle" style="font-size: 18px; "
                       :loading="storeSearchLoading">结算
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!--底部配送方式、支付方式选择 结束-->
    <!--选择客户弹出框 开始-->
    <el-dialog top="20px" title="选择客户" :visible.sync="centerDialogVisible" width="60%" center>
      <el-form :inline="true" :model="userPage" class="demo-form-inline">
        <el-form-item label="门店名称">
          <el-input size="mini" v-model="userPage.store_name" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input size="mini" v-model="userPage.store_person" placeholder="请输入负责人"></el-input>
        </el-form-item>
        <el-form-item label="渠道类型">
          <el-cascader clearable
                       :props="{value: 'channel_id', label: 'channel_name'}"
                       :options="channelItems" change-on-select size="mini" v-model="userPage.channel_id">
          </el-cascader>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input size="mini" @change="inputPhone" v-model="userPage.store_phone" placeholder="请输入负责人手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getUserList" :loading="storeSearchLoading">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="userlist" border>
        <el-table-column prop="store_name" align="center" label="门店名称"/>
        <el-table-column prop="store_person" align="center" label="负责人"></el-table-column>
        <el-table-column prop="channel_name" align="center" label="渠道类型"></el-table-column>
        <el-table-column prop="store_address" align="center" label="店铺地址">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.store_address.length>12" effect="dark" :content="scope.row.store_address"
                        placement="top">
              <span>{{scope.row.store_address |sublen(12)}}</span>
            </el-tooltip>
            <span v-else>{{scope.row.store_address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="scope.row!=user_selected[0]" @click="suser(scope.row)">选择
            </el-button>
            <span v-else>已选择</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-pagination class="text-align" background layout="prev, pager, next" @current-change="cUserPage"
                       :current-page="userPage.page" :page-size="userPage.pre_page" :total="userTotal">
        </el-pagination>
      </div>
    </el-dialog>
    <!--选择客户弹出框 结束-->
    <!--确认订单弹出框 开始-->
    <el-dialog top="20px" title="确认订单" align="center" :visible.sync="dialogVisible" width="45%">
        <span>
          <div>
            <h5 class="confirmTitle">订单信息</h5>
             <goods-table v-if="dialogVisible" :table-data.sync="tableData"
                          :can-edit="false"/>
          </div>
          <div class="rest">
            <h5 class="confirmTitle">其他信息</h5>
            <el-row>
              <el-col :span="24">
                <div class="sform">留言备注:
                  <el-input
                    size="small"
                    class="leaveWord"
                    placeholder="请输入留言内容"
                    v-model="leaveWord"
                    clearable>
                  </el-input>
                </div>
              </el-col>
              <el-col :span="8"><div class="sform">客户信息: <span>{{user_selected.length==0?'':user_selected[0].store_name}}</span></div></el-col>
              <el-col :span="8"><div class="sform">付款方式: <span> {{payType==4?'货到付款':''}}</span></div></el-col>
              <el-col :span="8"><div class="sform">配送方式: <span>{{distriType==1?'物流配送':'上门自提'}}</span></div></el-col>
              <el-col :span="8"><div class="sform">运费:
                <el-input class="wid80" size="medium" placeholder="请输入运费" @change="inprice" v-model="postprice"
                          :disabled="distriType!=1">
                  <template slot="append">元</template>
                </el-input>
              </div></el-col>
              <el-col :span="16"><div class="sform">配送地址:
                <el-select v-model="userAddress" size="medium" placeholder="请选择配送地址" class="wid80">
                  <el-option v-for="item in uaoptions" :key="item.id" :label="item.address"
                             :value="item.id"></el-option>
                </el-select>
              </div></el-col>
            </el-row>
          </div>
        </span>
      <div class="footer_warp">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="orderConfirm" :loading="storeSearchLoading" class="wid150">确 定</el-button>
          <el-button @click="dialogVisible = false" class="wid150">取 消</el-button>
        </span>
      </div>
    </el-dialog>
    <!--确认订单弹出框 结束-->
    <!--选择商品弹出框 开始-->
    <el-dialog align="center" :visible.sync="dialogstandard" width="50%">
        <span>
          <div class="v">
            <h5 class="goodsInfoTitle">商品信息</h5>
             <el-table v-if="selectedData.sku" :data="selectedData.sku" border class="selectTable">
                <el-table-column label="商品名称" align="center" min-width="45">
                  <template slot-scope="scope">
                    <el-tooltip v-if="selectedData.goods_name.length>20" effect="dark"
                                :content="selectedData.goods_name">
                      <span>{{selectedData.goods_name |sublen(20)}}</span>
                    </el-tooltip>
                      <span v-else>{{selectedData.goods_name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="sku_name" align="center" label="规格" min-width="11"></el-table-column>
               <el-table-column align="center" label="库存" min-width="11">
                 <template slot-scope="scope">
                    <div class="cell" v-if="scope.row.stock>0">{{scope.row.stock}}</div>
                    <div class="cell" v-else style="color:red">无货</div>
                  </template>
               </el-table-column>
                <el-table-column prop="price" align="center" label="销售价" min-width="11"></el-table-column>
                <el-table-column prop="market_price" align="center" label="市场价" min-width="11"></el-table-column>
               <!--阶梯价与渠道价-->
               <!--<el-table-column label="阶梯价" align="center" type="expand" width="70">-->
               <!--<template slot-scope="scope">-->
               <!--<div v-if="scope.row.is_leader">-->
               <!--<el-table border :data="scope.row.leader_price">-->
               <!--<el-table-column prop="from" align="center" label="启始门槛"></el-table-column>-->
               <!--<el-table-column prop="to" align="center" label="结束门槛">-->
               <!--<template slot-scope="scope">-->
               <!--<span>{{scope.row.to>99999?'∞':scope.row.to}}</span>-->
               <!--</template>-->
               <!--</el-table-column>-->
               <!--<el-table-column prop="price" label="价格"></el-table-column>-->
               <!--</el-table>-->
               <!--</div>-->
               <!--<div v-else style="text-align: center">没有开启阶梯价</div>-->
               <!--</template>-->
               <!--</el-table-column>-->
                <el-table-column fixed="right" label="操作" align="center" min-width="11">
                <template slot-scope="scope">
                  <el-button type="info" plain size="small" v-if="scope.row.stock==0" disabled>添加</el-button>
                  <el-button type="primary" size="small" v-else
                             @click="addCart(selectedData.goods_id,selectedData.goods_name,selectedData.picture,scope.row)">
                    添加</el-button>
                </template>
              </el-table-column>
              </el-table>
          </div>
        </span>
      <div class="footer_warp">
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogstandard = false" style="width: 150px;">关 闭</el-button>
        </span>
      </div>
    </el-dialog>
    <!--选择商品弹出框 结束-->
  </div>

</template>

<script>
import GoodsSearch from '@/page/goods/price_form/component/search.vue'
import GoodsTable from '@/page/sale/components/priceTable.vue'
import lodash from 'lodash'

export default {
  data () {
    return {
      height: 0,
      containerHeight: 0,
      centerDialogVisible: false, // 选择客户
      storeSearchLoading: false, // 查询loading
      dialogVisible: false, //  结算弹框
      dialogstandard: false,
      user_selected: [], // 已经选择的客户信息
      userlist: [], // 用户选择列表
      userTotal: 0,
      channelItems: [],
      userPage: {
        pre_page: 6,
        page: 1,
        store_name: '',
        store_phone: '',
        store_person: '',
        channel_id: []
      },
      distriType: 1, // 配送方式
      payType: 4, // 付款方式
      total_count: 0,
      goodlist: [],
      stype: 'checkstand',
      postprice: 0, // 运费
      tableData: [],
      otherForm: {},
      pramas: {
        pre_page: 18,
        page: 1,
        goods_name: '',
        category_id: '',
        state: 1,
        filter_stock: 1
      },
      selectedData: {},
      selectedGoods: [], // 已经加入购物车的商品
      userAddress: '', // 选择的的客户地址
      uaoptions: [], // 客户的地址信息
      leaveWord: '' //  留言
    }
  },
  created () {
    // 获取中间部分高度
    this.containerHeight = window.innerHeight - 70
    this.height = window.innerHeight - 178
    this._goodsList()
    this.getChannel()
    this.getUserList()
  },
  watch: {
    user_selected (val) {
      this._goodsList()
    },
    dialogstandard (val) {
      if (!val) {
        this.selectedData = {}
      }
    }
  },
  components: {
    GoodsSearch, GoodsTable
  },
  methods: {
    // 手机号码验证
    inputPhone (cval) {

      // if (!cval) return
      // if (!/^[0-9]+$/.test(cval)) {
      //   this.userPage.store_phone = ''
      //   this.$message({
      //     type: 'error',
      //     message: '负责人手机号码必须是数字！'
      //   })
      // }
    },
    clearCart () {
      if (!this.tableData.length) return
      this.$confirm('确定要清空购物车吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.selectedGoods = []
          this.tableData = []
        })
    },
    // 库存改变handel
    stockHandel (status) {
      this.storeSearchLoading = status
    },
    // 输入运费验证
    inprice (val) {
      const nVal = parseFloat(val)
      if (!nVal) {
        this.postprice = 0
        this.$message({
          type: 'error',
          message: '运费必须输入数字！'
        })
      }
      if (nVal < 0) {
        this.postprice = 0
        this.$message({
          type: 'error',
          message: '运费必须输入数字！'
        })
      }
    },
    // 确认订单
    async orderConfirm () {
      this.storeSearchLoading = true
      let goodsInfo = this.tableData.map((item) => {
        return {
          goods_id: item.goods_id,
          sku_id: item.sku_id,
          num: item.goods_num,
          price: item.orgin,
          goods_picture: item.picture,
          sales_price_total: item.goods_total
        }
      })
      const obj = {
        address_id: this.userAddress,
        payment_type: this.payType,
        shipping_type: this.distriType,
        post_price_total: this.postprice,
        goods_data: JSON.stringify(goodsInfo),
        store_id: (this.user_selected.length > 0) ? this.user_selected[0].id : '',
        member_id: (this.user_selected.length > 0) ? this.user_selected[0].user_id : '',
        seller_memo: this.leaveWord
      }
      const {err, data} = await this.$service.shopmanager.checkstand.createorder(obj)
      this.storeSearchLoading = false
      if (err) return
      this.dialogVisible = false
      this.tableData = []
      this.selectedGoods = []
      this.postprice = 0
      this.$message({
        type: 'success',
        message: '订单已创建！'
      })
    },
    // 商品列表分页
    cGoodsPage (val) {
      this.pramas.page = val
      this._goodsList()
    },
    //  获取渠道类型
    async getChannel () {
      const {err, data} = await this.$service.channel.list()
      if (err) return
      this.channelItems = data.result
    },
    // 点击结算
    settle () {
      this.postprice = 0 // 运费清零
      if (this.user_selected.length == 0) {
        this.$message({
          type: 'error',
          message: '请选择客户！'
        })
        return
      }

      if (this.tableData.length == 0) {
        this.$message({
          type: 'error',
          message: '请选择商品！'
        })
        return
      }
      // 验证
      let validate = true
      for (let item of this.tableData) {
        const {goods_num, goods_total} = item
        if (!goods_num || !goods_total) {
          validate = false
          break
        }
      }
      if (!validate) {
        this.$message.error('购物车商品数量和金额不能为空')
        return
      }
      this.dialogVisible = true
    },
    // 加入购物车
    addCart (gId, gName, pictureId, row) {
      if (!parseInt(row.stock)) {
        this.$message.error('库存不足不可添加')
        return
      }
      let tmpStr = gId + '' + row.sku_id
      if (this.$inArray(tmpStr, this.selectedGoods) > -1) {
        // 再次选择 数量加1 总价加一
        const hadIndex = this.tableData.findIndex(item => item.sku_id == row.sku_id)
        const cloneData = lodash.cloneDeepWith(this.tableData)
        cloneData[hadIndex].goods_num = parseInt(this.tableData[hadIndex].goods_num) + 1
        // cloneData[hadIndex].goods_total = parseInt(this.tableData[hadIndex].goods_num) + 1
        this.tableData = cloneData
        this.$refs.cart.inNum(hadIndex, {target: {value: cloneData[hadIndex].goods_num}})
        this.$message.success('更新购物车成功')
        return
      }
      let obj = row
      obj['goods_name'] = gName
      obj['goods_num'] = 1
      obj['goods_total'] = row.price
      obj['real_price'] = row.price
      obj['orgin_price'] = row.price
      obj['orgin'] = row.price
      obj['picture'] = pictureId
      obj.leader_price = obj.leader_price.map((item, index) => {
        item.orgin_price = item.price
        return item
      })
      this.selectedGoods.push(tmpStr)
      this.tableData.push(obj)
      this.$refs.cart.inNum(this.tableData.length - 1, {target: {value: 1}})
      this.$message.success('添加购物车成功')
    },
    // 弹出商品价格
    async showGoodPrice (obj) {
      if (this.user_selected.length == 0) {
        this.$message({
          type: 'error',
          message: '请选择客户！'
        })
        return
      }
      this.selectedData = await this.getSelectedTable(obj.goods_id)
      if (this.selectedData.sku && this.selectedData.sku.length > 1) {
        this.dialogstandard = true
      } else {
        this.addCart(this.selectedData.goods_id, this.selectedData.goods_name, this.selectedData.picture, this.selectedData.sku[0])
      }
    },
    // 获取待选商品sku信息
    async getSelectedTable (gId) {
      const obj = {
        id: gId,
        store_id: (this.user_selected.length > 0) ? this.user_selected[0].id : '',
        member_id: (this.user_selected.length > 0) ? this.user_selected[0].user_id : ''
      }
      const {err, data} = await this.$service.shopmanager.checkstand.goodsku(obj)
      if (err) return
      data.data.sku.forEach(sitem => {
        sitem.leader_price = sitem.leader_price ? JSON.parse(sitem.leader_price) : []
      })
      return data.data
    },
    // 选中用户
    suser (row) {
      this.user_selected = [row]
      this.getUserAddress(row.id, row.user_id)
      this.selectedGoods = [] // 清空购物车数据
      this.tableData = [] // 清空购物车数据
      this.centerDialogVisible = false
    },
    // 取消选中用户
    cUserPage (val) {
      this.userPage.page = val
      this.getUserList()
    },
    // 获取用户列表信息
    async getUserList () {
      this.storeSearchLoading = true
      const params = {
        ...this.userPage,
        channel_id: this.userPage.channel_id[this.userPage.channel_id.length - 1] || ''
      }
      const {err, data} = await this.$service.store.store_list(params)
      this.storeSearchLoading = false
      if (err) return
      this.userlist = data.result
      this.userTotal = data.total_count || 1
    },
    // 获取客户地址信息
    async getUserAddress (storeId, memberId) {
      this.loading = true
      const {err, data} = await this.$service.shopmanager.checkstand.getAddress({
        member_id: memberId,
        store_id: storeId
      })
      this.loading = false
      if (err) return
      this.uaoptions = data.result.data
      this.userAddress = data.result.default_id
    },
    // 获取商品列表
    async _goodsList () {
      this.loading = true
      if (this.user_selected.length > 0) {
        const params = {
          ...this.pramas,
          store_id: (this.user_selected.length > 0) ? this.user_selected[0].id : '',
          member_id: (this.user_selected.length > 0) ? this.user_selected[0].user_id : ''
        }
        const {err, data} = await this.$service.shopmanager.checkstand.goodlist(params)
        if (err) return
        this.loading = false
        this.total_count = data.total_count ? data.total_count : 0
        this.goodlist = data.data ? data.data : []
      } else {
        const {err, data} = await this.$service.goods.goods_common_api.goodsList(this.pramas)
        if (err) return
        this.loading = false
        this.total_count = data.total_count ? data.total_count : 0
        this.goodlist = data.result ? data.result : []
      }
      this.$goTop()
    },
    // 搜索商品
    searchData (data) {
      const {goods_name, category_id} = data
      this.pramas.goods_name = goods_name
      this.pramas.category_id = category_id
      this._goodsList()
    }
  }
}
</script>

<style scoped>
  .cart {
    height: calc(100% - 3px);
  }

  .container {
    position: relative;
  }

  .wid150 {
    width: 150px;
  }

  .overy {
    overflow-y: auto;
    margin-top: 10px;
  }

  .wid80 {
    width: 80%;
  }

  .goodsInfoTitle {
    text-align: left;
    width: 100%;
    font-size: 16px;
    color: #666;
    margin-bottom: 10px;
  }

  .random-user li {
    width: 14.5%;
    height: 137px;
    float: left;
    margin-left: 1.87%;
    margin-bottom: 25px;
    text-align: center;
    background: #FFF;
    border: 1px solid #E0E0E0;
    cursor: pointer;
  }

  .random-user li > h5 {
    color: #666;
    margin-top: 20px;
    line-height: 30px;
  }

  .random-user li > span {
    color: #666;
    margin-top: 20px;
    line-height: 30px;
  }

  .random-user li > p {
    color: #666;
    line-height: 30px;
  }

  .prev {
    width: 100%;
    float: left;
    text-align: center;
  }

  .total ul li {
    width: 25%;
    float: left;
    padding: 20px 0;
    color: #606266;
    text-align: center;
    cursor: pointer;
  }

  /* 结算 */

  .closing {
    width: 100%;
    height: 55px;
    line-height: 55px;
    position: absolute;
    bottom: -10px;
    left: 0
  }

  .closing_p {
    float: left;
    padding-right: 10px;
  }

  .closing_p > h5 {
    color: #666;
    font-size: 18px;
    padding-left: 10px;
    margin-right: 20px;
  }

  .payment_warp {
    float: right;
    margin-right: 10px;
  }

  .payment {
    width: 200px;
  }

  /*  确认订单 */

  .rest {
    margin-top: 20px;
  }

  .rest .sform {
    width: 100%;
    text-align: left;
    line-height: 50px;
  }

  .confirmTitle {
    text-align: left;
    width: 100%;
    font-size: 18px;
    color: #666;
    margin-bottom: 10px;
  }

  .footer_warp {
    margin-top: 20px;
    text-align: center;
  }

  .cgoodCon {
    clear: both;
    text-align: center;
    height: 130px;
    overflow: hidden;
    font-size: 12px;
    box-sizing: border-box;
    padding: 5px;
  }

  .cgoodCon:hover {
    cursor: pointer;
    /*box-shadow: 3px 3px 3px rgba(178, 179, 178, 0.59)*/
  }

  .cgoodCon img {
    max-width: 72%;
    height: 72%
  }

  .selectTable {
    max-height: 400px;
    overflow-y: auto;
  }

  /* 备注 */
  .leaveWord {
    width: 80%;
    margin-left: 5px;
  }
</style>
