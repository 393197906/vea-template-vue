
<template>
  <div class="order_box">
    <el-dialog title="同意退货退款" :visible.sync="yesDilogVisible" class="yesDilog" width="350px">
      <el-form>
        <el-form-item label="退款金额">
          <el-input-number v-model="refundMoney" :min="0" ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="yesDilogVisible = false">取 消</el-button>
        <el-button type="primary" @click="comfirmRefund">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="拒绝退款" :visible.sync="refuseDilogVisible" class="yesDilog" width="350px">
      <p>确定拒绝退款？</p>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="refuseDilogVisible = false">取消</el-button>
        <el-button type="primary" @click="refuseRefund">拒绝退款</el-button>
      </div>
    </el-dialog>
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
    <OrderAddress :orderId="orderId" :addDilogShow.sync="addDilogShow" :refresh.sync="_getOrderData" :order="order" />

    <ul >
      <li class="order_view">
        <div class="order_title">订单状态</div>
        <el-steps :active="active" finish-status="success" style="margin-top:20px">
          <el-step title="用户申请退款"></el-step>
          <el-step title="用户发货"></el-step>
          <el-step title="商家收货"></el-step>
          <el-step title="商家退款处理"></el-step>
          <el-step title="退款完成"></el-step>
        </el-steps>
        <div class="order_main">
          <p style="margin:20px"><i class="el-icon-warning" style="margin-right:10px"></i>订单状态:
            <span>{{ orderStatu }}</span>
          </p>
          <template v-if="order.check_status == 0 && order.order_status == 0">
            <el-button type="primary" size="mini" @click="requestCheck(1)" style="margin-left:30px">通过审核</el-button>
            <el-button type="primary" size="mini" @click="requestCheck(2)">拒绝审核</el-button>
          </template>
          <template v-if="order.ship_status == 1 && order.order_status == 1">
            <el-button type="primary" size="mini" @click="comfirmReceipt" style="margin-left:30px">签收</el-button>
            <el-button type="primary" size="mini" @click="refuseReceipt">拒签</el-button>
          </template>
          <template v-if="order.ship_status == 2 && order.order_status == 1">
            <el-button type="primary" size="mini" @click="yesDilogVisible = true" style="margin-left:30px">同意退款</el-button>
            <el-button type="primary" size="mini" @click="refuseDilogVisible = true">拒绝退款</el-button>
          </template>
        </div>
      </li>
      <li class="order_view">
        <div class="order_title">商品信息</div>
        <div class="order_main order_table">
           <el-table
            :data="goods_data"
            border
            style="width: 100%">
            <el-table-column
              prop="pic_cover_micro"
              label="商品图片"
              align="center">
              <template  slot-scope="scope">
                <img :src="scope.row.pic_cover_micro">
              </template>
            </el-table-column>
            <el-table-column
              prop="goods_name"
              label="商品名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="price"
              align="center"
              label="价格">
            </el-table-column>
            <el-table-column
              prop="num"
              align="center"
              label="数量">
            </el-table-column>
            <el-table-column
              prop="goods_info.adjust_money"
              align="center"
              label="调整价格">
            </el-table-column>
            <el-table-column
              prop="goods_info.goods_money"
              align="center"
              label="小计">
            </el-table-column>
          </el-table>
        </div>
      </li>
       <li class="order_view" v-if="">
        <div class="order_title">退货订单信息</div>
        <div class="order_main order_table">
           <el-table
            :data="return_data"
            border
            style="width: 100%">
            <el-table-column
              prop="order_no"
              label="退货订单编号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="refund_order_number"
              label="退货快递编号"
              align="center">
            </el-table-column>
            <el-table-column
              prop="business_name"
              align="center"
              label="商家收货人">
            </el-table-column>
            <el-table-column
              prop="business_mobile"
              align="center"
              label="商家号码">
            </el-table-column>
            <el-table-column
              prop="total_money"
              align="center"
              label="退款金额">
            </el-table-column>
          </el-table>
        </div>
      </li>
      <li class="order_view">
        <div class="order_title">订单信息</div>
        <div class="order_main">
          <div class="order_ul clearfix">
            <div class="order_li">
              <span>订单编号：</span>
              <span>{{order.order_no}}</span>
            </div>
            <div class="order_li">
              <span>订单状态：</span>
              <span>{{order.order_status_info}}</span>
            </div>
            <div class="order_li">
              <span>商品金额：</span>
              <span>{{order.goods_money}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li">
              <span>会员名称：</span>
              <span>{{order.customer_name}}</span>
            </div>
            <div class="order_li">
              <span>运费：</span>
              <span>{{order.shipping_money}}</span>
            </div>
            <div class="order_li">
              <span>店铺名称：</span>
              <span>{{order.shop_name}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li">
              <span>手机号码：</span>
              <span>{{order.customer_mobile}}</span>
            </div>
            <div class="order_li">
              <span>收货人姓名：</span>
              <span>{{order.customer_name}}</span>
            </div>
            <div class="order_li">
              <span>邮编：</span>
              <span>{{order.customer_zip}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li order_li_row">
              <span>订单备注：</span>
              <span>{{order.remark}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li order_li_row">
              <span>收货地址：</span>
              <span>{{order.customer_province_info}}{{order.customer_city_info}}{{order.customer_district_info}}</span>
            </div>
          </div>
        </div>
      </li>

       <!-- <li class="order_view">
        <div class="order_title">操作日志</div>
        <div class="order_main order_table">
           <el-table
            :data="handle_data"
            border
            style="width: 100%">
            <el-table-column
              prop="order_status_text"
              label="订单状态"
              align="center">
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作事项"
              align="center">
            </el-table-column>
            <el-table-column
              prop="user_name"
              align="center"
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="action_time"
              align="center"
              label="操作时间">
            </el-table-column>
          </el-table>
        </div>
      </li> -->
    </ul>
  </div>
</template>
<script>
import OrderAddress from '@/components/order/OrderAddress'
export default {
  data () {
    return {
      order: '',
      orderId: 0,
      return_data: [],
      goods_data: [],
      handle_data: [],
      active: 1,
      dialogVisible: false,
      yesDilogVisible: false,
      text: '',
      loading: false,
      formLabelWidth: '150px',
      addDilogShow: false,
      refuseDilogVisible: false
    }
  },
  components: {
    OrderAddress
  },
  created () {
    this.orderId = this.$route.query.orderId
    this._getOrderData()
  },
  computed: {
    receiverInfo () {
      return this.order.receiver_address + ' ' + this.order.receiver_name + ' ' + this.order.receiver_mobile
    },
    orderStatu () {
      if (this.order.order_status != 3 && this.order.order_status != 4) {
        if (this.order.check_status == 1 && this.order.ship_status == 0) {
          this.active = 0
          return '用户未发货'
        } else if (this.order.check_status == 1 && this.order.ship_status == 1) {
          this.active = 1
          return '用户已发货'
        } else if (this.order.check_status == 2) {
          this.active = 0
          return '审核不通过'
        } else if (this.order.check_status == 0) {
          this.active = 0
          return '等待审核中'
        } else if (this.order.ship_status == 2 && this.order.order_status == 1 && this.order.refund_status == 0) {
          this.active = 2
          return '商家已签收'
        } else if (this.order.ship_status == 3) {
          this.active = 2
          return '商家已拒签'
        } else if (this.order.order_status == 2 && this.order.refund_status == 1) {
          this.active = 4
          return '退款成功'
        } else if (this.order.refund_status == 2) {
          this.active = 3
          return '商家拒绝退款'
        }
      }
    }
  },
  methods: {
    /**
    *   修改地址
    */
    addNoteDialog () {
      this.text = this.order.seller_memo
      this.dialogVisible = true
    },
    async addNote () {
      this.dialogVisible = false
      if (this.text == '') return
      const {err, data} = await this.$service.shopOrder.ordermanager.orderNoteUpdate({
        id: this.orderId,
        remark: this.text
      })
      this.$message({
        type: 'success',
        message: data.message
      })
      this._getOrderData()
      if (err) return
    },

    async _getOrderData () {
      const {err, data} = await this.$service.shopOrder.ordermanager.returnDetail({
        id: this.orderId
      })
      this.order = data.data
      this.return_data.push(data.data)
      this.goods_data = data.data.goods
      if (err) return
    },

    // 确认退款
    async comfirmRefund () {
      const {err, data} = await this.$service.shopOrder.ordermanager.comfirmRefund({
        id: this.orderId
      })
      this.yesDilogVisible = false
      this.$message({
        type: 'success',
        message: data.message
      })
      this._getOrderData()
      this.active = 4
      if (err) return
    },
    // 拒绝退款
    async refuseRefund () {
      const {err, data} = await this.$service.shopOrder.ordermanager.refuseRefund({
        id: this.orderId
      })
      this.refuseDilogVisible = false
      this.$message({
        type: 'success',
        message: data.message
      })
      this._getOrderData()
      this.active = 4
      if (err) return
    },

    // 退款请求审核
    async requestCheck (statu) {
      const {err, data} = await this.$service.shopOrder.ordermanager.checkstatus({
        id: this.orderId,
        check_status: statu
      })
      this.$message({
        type: 'success',
        message: data.message
      })
      this._getOrderData()
      if (statu == 2) {
        this.active = 0
      }
      if (err) return
    },

    // 商家是否签收货物
    async comfirmReceipt () {
      const {err, data} = await this.$service.shopOrder.ordermanager.confirmreceipt({
        id: this.orderId
      })
      this.$message({
        type: 'success',
        message: data.message
      })
      this._getOrderData()
      this.active = 2
      if (err) return
    },

    async refuseReceipt () {
      const {err, data} = await this.$service.shopOrder.ordermanager.confirmrefuse({
        id: this.orderId
      })
      this.$message({
        type: 'success',
        message: data.message
      })
      this._getOrderData()
      this.active = 4
      if (err) return
    }

  }

}
</script>
<style scoped>
@import "./order_style.css";

  .yesDilog .el-input {
    width: 150px;
  }
  .addressForm  .el-select {
    width: 150px;
  }
  .el-dialog__body {
    padding:0 20px 20px 20px;
  }

  .order_main .el-button {
    margin: 10px;
  }
</style>
