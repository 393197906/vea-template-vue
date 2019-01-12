<template>
  <div>
    <table class="table" border="1" cellspacing="0">
      <thead>
      <tr>
        <th>商品信息</th>
        <th width="10%">商品清单</th>
        <th width="10%">买家</th>
        <th width="20%">收货信息</th>
        <th width="14%">订单金额</th>
        <th width="9%">交易状态</th>
        <th width="9%">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="!orderData || orderData.length===0">
        <td colspan="7">
          暂无数据
        </td>
      </tr>
      <template v-for="(item,index) in orderData" :index="index">
        <tr>
          <td colspan="8" class="order_info">
            <span>订单编号：{{item.order_no}}（订单ID：{{item.order_id}}）</span>
            <span>交易号：{{item.out_trade_no}} </span>
            <span>下单时间：{{item.create_time | formatTime}}</span>
          </td>
        </tr>
        <template v-for="(itemGoods,indexGoods) in item.goods" :index="indexGoods">
          <tr>
            <td class="goods_name">
              <div class="clearfix">
                <div class="goods_pic">
                  <img :src="itemGoods.pic_data" alt="">
                </div>
                <div class="goods_title">{{itemGoods.goods_name}}</div>
              </div>

            </td>
            <td>
              <div><p>{{itemGoods.price}}元</p>
                <p>{{itemGoods.num}}{{itemGoods.sku_name}}</p></div>
            </td>
            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <div>{{item.user_name}}</div>
            </td>
            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <div>
                <p>{{item.receiver_name}}</p>
                <p>{{item.receiver_mobile}}</p>
                <p>{{item.receiver_province_info}}{{item.receiver_city_info}}{{item.receiver_district_info}}</p>
              </div>
            </td>
            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <div>
                <p>总金额：{{item.pay_money}}</p>
                <p v-if="item.refund_money>0">退货后金额：{{item.afterReturnMoney}}</p>
                <p>含快递：{{item.shipping_money||"0.00"}}</p>
                <p>{{item.payment_type_info}}</p>
              </div>
            </td>
            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <div>{{item.order_status_info}}</div>
            </td>
            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <p v-if="$checkActionAccess($ACCESS.ORDER_DETAIL)">
                <span class="editBut" @click="data_detail(item.order_id)">订单详情</span>
              </p>
                <p>
                  <span class="editBut" v-if="item.order_status==0 && $checkActionAccess($ACCESS.ORDER_PRICE_CHANGE)" @click="changeOrder(item)">修改价格</span>
                </p>
                <p v-if="item.order_status == 1 && $checkActionAccess($ACCESS.ORDER_OUT_BILL)">
                <span class="editBut" @click="order_ship(item.order_id,item.bussiness_address)" style="color:#51A351"
                      >生成出库单</span>
                </p>
                <p v-if="$checkActionAccess($ACCESS.ORDER_NOTE_ADD)">
                <span class="editBut"  @click="addNoteDialog(item.order_id,item.seller_memo)"
                      style="color:#8e8c8c">添加备注</span>
                </p>
                <p  v-if="item.order_status == 1 && $checkActionAccess($ACCESS.ORDER_ADDRESS_CHANGE)">
                <span class="editBut" @click="changeAddressDialog(item.order_id,item)" style="color:#51A351">修改地址</span>
                </p>
              <p v-if="$checkActionAccess($ACCESS.ORDER_DELETE)">
                <span style="color:red" type="primary" class="editBut" v-if="item.order_status==5"
                      @click="deleteOrder(item.order_id,index)">删除订单</span>
              </p>
              <p> <el-button
                type="primary"
                size="mini"
                style="margin:10px 10px 10px 20px;"
                v-if="item.order_status!==5 && $checkActionAccess($ACCESS.ORDER_PRINT)"
                @click="printNext(item)"
              >打印订单 (<i class="print-cor">{{item.print_num}}</i>) 次
              </el-button></p>
            </td>
          </tr>
        </template>
      </template>
      </tbody>
    </table>
    <OrderAddress :orderId="orderId" :addDilogShow.sync="addDilogShow" @refresh="refresh" :order="order"
                  ref='orderAddress'/>
    <OrderShip :orderId="orderId" :shipDialogVisible.sync="shipDialogVisible" @refresh="refresh" ref='orderShip'/>
    <OrderChange :changeDialogVisible.sync="changeDialogVisible" @closeChangeDilog="closeChangeDilog" @refresh="refresh"
                 ref='orderChange'/>
    <el-dialog
      title="备注信息"
      :visible.sync="dialogVisible"
      width="40%"
      center
    >
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 8}"
        placeholder="请输入内容"
        v-model="text">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addNote" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 打印-->
    <div style="width:100%;height:100%;text-align:center;display: none">
      <div class="order_view" id="print_order">
        <div class="header">优鲜供应链销售订单</div>
        <div class="order_main no_border_main" style="width: 80%;display: inline-block;">
          <div class="order_ul clearfix">
            <div class="order_li">
              <span>订单编号：</span>
              <span>{{order.order_no}}</span>
            </div>
            <div class="order_li">
              <span>下单时间：</span>
              <span>{{order.created_at }}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li" style="width: 33.3%">
              <span><strong>收货人：</strong></span>
              <span>{{order.receiver_name}}</span>
            </div>
            <div class="order_li" style="width: 33.3%">
              <span><strong>收货人电话：</strong></span>
              <span>{{order.receiver_mobile}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li order_li_row" style="width: 100%;">
              <span><strong>收货地址：</strong></span>
              <span>{{order.province_name}}{{order.city_name}}{{order.district_name}}{{order.receiver_address}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li_row order_li" style="width: 100%;">
              <span><strong>买家留言：</strong></span>
              <span>{{order.buyer_message}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li" style="width: 33.3%">
              <span><strong>用户名称：</strong></span>
              <span>{{order.stroe_name}}</span>
            </div>
            <div class="order_li" style="width: 33.3%">
              <span><strong>配送方式：</strong></span>
              <span>{{order.shipping_type_info}}</span>
            </div>
            <div class="order_li" style="width: 33.3%">
              <span><strong>打印次数：</strong></span>
              <span>第{{order.print_num + 1}}次打印</span>
            </div>
          </div>
        </div>
        <div class="qrcode_img">
          <img src="../../images/yxapp.jpg" style="width:113px;height:101px">
          <p style="font-size:12px"><strong>下载优鲜供应链APP</strong></p>
          <p style="font-size:12px"><strong>享更多优惠</strong></p>
        </div>
        <div>
          <div class="table_div1 clearfix">
            <span style="width:35%"><strong>商品名称</strong></span>
            <span style="width:15%"><strong>数量</strong></span>
            <!--<span style="width:14%"><strong>优惠价</strong></span>-->
            <!--<span style="width:15%"><strong>优惠类型</strong></span>-->
            <span style="width:17%"><strong>计价单位</strong></span>
            <span style="width:15%"><strong>原售价</strong></span>
            <span style="border-right:1px solid #000;width:18%"><strong>总价</strong></span>
          </div>
          <div :key="item.order_goods_id" v-for="item in goods_data" class="clearfix">
            <div class="table_div">
              <span style="width:35%">{{item.goods_name}}</span>
              <span style="width:15%">{{item.num}}</span>
              <!--<span style="width:14%">{{// item.adjust_money}}</span>-->
              <!--<span style="width:13%">{{// item.price}}</span>-->
              <span style="width:17%">{{item.sku_name}}</span>
              <span style="width:15%">{{item.price}}</span>
              <span style="border-right:1px solid #000;width:18%">{{item.goods_money}}</span>
            </div>
          </div>
          <div>
            <div class="table_div1 clearfix" style="border-right: 1px solid black;">
              <span style="width:35%">优惠前金额: {{ order.goods_money | money }}</span>
              <span style="width:15%">优惠金额: {{ order.promotion_money | money }}</span>
              <span style="width:17%">实际金额: {{ order.pay_money | money }}</span>
              <span style="width:33%"><strong>应付金额: {{ order.pay_money | money }}</strong></span>
            </div>
            <div class="table_div1 clearfix" style="border-bottom: 1px solid black;border-right: 1px solid black;">
              <span style="width:67%">物流运费: {{ order.shipping_money | money }}</span>
              <span style="width:33%;border-top: none;">支付方式: {{order.payment_type_info}}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <div style="border-bottom: 1px solid #000;padding: 3px 0" class="clearfix">
            <span>商家：{{order.shop_name}}</span>
            <span>商家电话:{{order.company_phone}}</span>
            <span>商家地址:{{order.bussiness_address?order.bussiness_address.province_id_info+'-'+order.bussiness_address.city_id_info+'-'+order.bussiness_address.district_id_info+'-'+order.bussiness_address.address:''}}</span>
          </div>
          <div style="border-bottom: 1px solid #000;padding: 3px 0" class="clearfix">
            <span>运营方：优鲜供应链</span>
            <span>中国冷冻食材电商服务开拓者</span>
            <span>投诉电话 : 400-017-0006</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import OrderAddress from '@/components/order/OrderAddress'
import OrderShip from '@/components/order/OrderShip'
import OrderChange from '@/components/order/OrderChange.vue'
import PrintJs from 'print-js'
import 'print-js/dist/print.min.css'
export default {
  props: {
    orderData: Array
  },
  components: {
    OrderAddress,
    OrderShip,
    OrderChange
  },
  data () {
    return {
      orderId: '',
      order: {},
      addDilogShow: false,
      dialogVisible: false,
      shipDialogVisible: false,
      changeDialogVisible: false,
      text: '',
      idNow: '',
      formLabelWidth: '150px'
    }
  },
  computed:{
    printJS(){
      console.log(printJS,'printJS')
      return{
        printJS
      }
    }
  },
  methods: {
    closeChangeDilog () {
      this.changeDialogVisible = false
    },
    refresh () {
      this.$emit('refresh')
    },
    //  打印订单次数
    async printNext (item) {
      this.loading = true
      const result = await this.$service.shopOrder.ordermanager.orderDetail({
        id: item.order_id
      })
      this.loading = false
      if (result.err) return
      this.order = result.data.result
      console.log(this.order ,'this.order')
      const {err, data} = await this.$service.shopOrder.ordermanager.orderPrint(item.order_id)
      if (err) return
      console.log(data)
      printJS({
        printable: 'print_order',
        type: 'html',
        documentTitle:'',
        targetStyles: ['*']
      })
      this.$emit('callList')
    },
    // 打开发货窗口
    order_ship (id) {
      this.orderId = id
      this.$refs.orderShip.getShipData(id)
    },
    // 修改地址弹窗
    changeAddressDialog (id, item) {
      this.orderId = id
      this.order = item
      this.$refs.orderAddress._addressInit(item)
      this.addDilogShow = true
    },
    // 订单价格修改
    changeOrder (item) {
      this.$refs.orderChange.changeDataInit(item)
      this.changeDialogVisible = true
    },
    // 订单详情
    data_detail (id) {
      this.$router.push({
        path: `/order/list/detail/${id}`,
        query: {
          orderId: id
        }
      })
    },
    // 添加备注
    addNoteDialog (id, text) {
      this.idNow = id
      this.text = text
      this.dialogVisible = true
    },
    async addNote () {
      this.dialogVisible = false
      if (this.text == '') return
      const {err, data} = await this.$service.shopOrder.ordermanager.orderNoteUpdate({
        id: this.idNow,
        remark: this.text
      })
      this.$emit('callList')
      if (err) return
      this.$message({
        type: 'success',
        message: data.message
      })
    },
    // 删除订单
    deleteOrder (id, i) {
      this.$confirm('确定要删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.shopOrder.ordermanager.orderDelete({
            id: id
          })
          this.orderData.splice(i, 1)
          this.$emit('refresh')
          this.$message({
            type: 'success',
            message: data.message
          })
        })
        .catch(() => {
        })
    }
  }
}
</script>
<style scoped>
  .table {
    font-size: 12px;
    text-align: center;
    width: 100%;
    background: #FFF;
    border: none;
    color: #495060;
  }

  .table thead {
    background: linear-gradient(#fbfbfb, #ececec);
  }

  .table th {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: none;
    background-color: #FFF;
    color: #909399;
  }

  .table td {
    line-height: 24px;
    padding: 10px 0;
    border: 1px solid #DDD;
  }

  .table td > div {
    text-align: left;
    display: inline-block
  }

  .table .order_info {
    text-align: left;
    padding: 0 0 0 10px;
    background: #f0f0f0;
    line-height: 30px;

  }

  .table .order_info > span {
    display: inline-block;
    padding-right: 20px;
  }

  .table .goods_name {
    color: #108cee;
    padding-left: 10px;
    text-align: left;
  }

  .table .goods_name > div {
    display: block;
  }

  .goods_name .goods_pic {
    float: left;
    width: 60px;
    height: 60px;
  / / background: #108cee;
  }

  .goods_name .goods_pic img {
    width: 100%;
    height: 100%;
  }

  .goods_name .goods_title {
    float: left;
    padding-left: 22px;
    width: calc(100% - 100px)
  }

  .ivu-btn {
    padding: 3px 17px;
  }

  .editBut {
    color: #108cee;
    cursor: pointer;
  }

  .addressForm .el-input {
    width: 458px;
  }

  .el-select {
    width: 150px;
  }
  #print_order {
    position: relative;
    padding: 0;
  }

  #print_order .order_li {
    display: inline-block;
    float: left;
    width: 50%;
    text-align: left;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .no_border_main {
    border: none !important;
    margin-top: 3px;
  }

  .no_border_main .order_ul {
    border-bottom: none;
    padding: 6px 0;
    text-align: right;
  }

  #print_order {
    height: 100%;
    padding-bottom: 3px;
    text-align: left
  }

  #print_order .footer {
    width: 100%;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
  }

  #print_order .footer span {
    float: left;
    width: 33.3%;
    text-align: center;
    box-sizing: border-box;
    padding-left: 0;
  }

  .table_div span,
  .table_div1 span {
    float: left;
    border: 1px solid #000;
    box-sizing: border-box;
    text-align: center;
    height: 25px;
    line-height: 25px;
    border-right: none;
    font-size: 12px;
    border-bottom: none;
  }

  .table_div1 span {
    border-bottom: none;
  }

  .order_money {
    width: calc(100% - 2px);
    height: 25px;
    line-height: 25px;
    text-align: center;
    border: 1px solid #000;
    font-size: 13px;
  }

  .clearfix {
   clear:both;
    zoom: 1;
  }

  .header {
    font-size: 18px;
    text-align: center;
    width: 100%;
    font-weight: 600;
  }

  .qrcode_img {
    position: absolute;
    right: 5px;
    top: 5px;
    text-align: center;
  }

  .print-cor {
    color: #e6a23c;
    padding: 0 5px;
  }

  .num_cor {
    color: #1c8fef;
    cursor: pointer;
    text-decoration: underline;
  }
  strong {
    font-weight: bold;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }
</style>
