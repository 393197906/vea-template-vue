<template>
  <div>
    <div class="listTop clearfix">
      <div class="block">
        <span>下单时间:</span>
        <el-date-picker
          size="small"
          v-model="buyData"
          @change="dateChange"
          type="daterange"
          unlink-panels="true"
          range-separator="-"
          value-format="timestamp"
          :start="pramas.start_time"
          :end="pramas.end_time"
          start-placeholder="请选择开始日期"
          end-placeholder="请选择结束日期">
        </el-date-picker>
      </div>
      <div class="coding">
        <span>订单编号:</span>
        <el-input placeholder="请输入订单编号" size="small" v-model="pramas.order_no" clearable></el-input>
      </div>
      <div class="coding" style="margin-left: 10px">
        <span>商品名称:</span>
        <el-input placeholder="请输入商品名称" size="small" v-model="pramas.goods_name" clearable></el-input>
      </div>
      <div class="MoreSearch">
        <el-button @click="optionShow = !optionShow" size="small" type="info" icon="el-icon-more">更多搜索
        </el-button>
      </div>
      <div class="MoreSearch">
        <el-button @click="searchOrder" size="small" type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary" size="small" plain icon="el-icon-upload2" @click="exportData">导出</el-button>
      </div>
    </div>
    <transition name="fade">
      <div v-if="optionShow" class="clearfix moreSearch">
        <div class="searchItem">
          <span>收货人姓名:</span>
          <el-input size="small" placeholder="请输入内容" v-model="pramas.receiver_name" clearable></el-input>
        </div>
        <div class="searchItem">
          <span>收货人手机号:</span>
          <el-input placeholder="请输入内容" size="small" v-model="pramas.phone" clearable></el-input>
        </div>
        <div class="searchItem">
          <span>支付方式:</span>
          <el-select v-model="pramas.payment_type" size="small" placeholder="请选择" clearable>
            <el-option
              v-for="(item,index) in payWay"
              :key="index"
              :label="item.type_info"
              :value="item.payment_type"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </transition>
    <common-tabs :default-menu.sync="activeIndex" :menu-options.sync="tabs" @stateChange="stateChange"></common-tabs>
    <OrderTable :orderData.sync="orderList" @callList="callLists" isRefund="false" v-loading="loading"
                @refresh="_orderList"/>
    <div class="page-box">
      <el-pagination
        class="text-align"
        background
        layout="prev, pager, next"
        :page-size="pramas.pre_page"
        :current-page="pramas.page"
        @current-change="handleCurrentChange"
        :total="total_count">
      </el-pagination>
    </div>
   </div>

</template>

<script>
import {OrderBus} from '@/page/order/order_bus'
import OrderItemHeader from '@/components/order/OrderItemHeader.vue'
import OrderTable from '@/components/order/orderTable.vue'
import commonTabs from '@/components/common/CommonTab.vue'

let num = 0
export default {
  data () {
    return {
      tabs: [
        {status: '', label: '全部'},
        {status: '0', label: '待付款'},
        {status: '1', label: '待发货'},
        {status: '2', label: '待收货'},
        {status: '3', label: '已收货'},
        {status: '4', label: '已完成'},
        {status: '5', label: '已关闭'}
      ],
      payWay: [
        {payment_type: '', type_info: '所有'},
        {payment_type: '1', type_info: '微信支付'},
        {payment_type: '2', type_info: '支付宝支付'},
        {payment_type: '4', type_info: '货到付款'}
      ],
      buyData: '',
      orderList: [],
      activeIndex: '',
      optionShow: false,
      loading: false,
      order: {},
      total_count: 0,
      pramas: {
        page: 1,
        pre_page: 10,
        start_time: '',
        end_time: '',
        phone: '',
        order_status: '',
        payment_type: '',
        receiver_name: '',
        order_no: '',
        goods_name: ''
      }
    }
  },
  name: 'list',
  components: {
    OrderItemHeader,
    OrderTable,
    commonTabs
  },
  destroyed () {
    num = -1
  },
  created () {
    num = 0;
    (async function t () {
      await new Promise(resolve => {
        setTimeout(async () => {
          if (num) {
            this._orderList()
            num = 0
          }
          if (num !== -1) {
            await t()
          }
          res(1)
        }, 5000)
      })
    })()
    // 新订单提示
    OrderBus.$on('newOrder', () => {
      num++
    })
    // //获取route数据
    // const {
    //   start_time,
    //   end_time,
    //   page,
    //   phone,
    //   payment_type,
    //   receiver_name,
    //   order_no,
    //   order_status
    // } = this.$route.query;
    // this.pramas.start_time = start_time || "";
    // this.pramas.end_time = end_time || "";
    // this.pramas.phone = phone || "";
    // this.pramas.order_status = order_status;
    // this.pramas.payment_type = payment_type || "";
    // this.pramas.order_no = order_no || "";
    // this.pramas.page = parseInt(page) || 1;
    // this.activeIndex = order_status >= 0 ? order_status + "" : "";
    this._orderList()
  },
  activated () {
    this._orderList()
  },
  methods: {
    // 日期改变
    dateChange (val) {
      if (val) {
        this.pramas.start_time = val[0] / 1000
        this.pramas.end_time = val[1] / 1000
      } else {
        this.pramas.start_time = ''
        this.pramas.end_time = ''
      }
    },
    // 页码改变
    handleCurrentChange (val) {
      this.pramas.page = val
      this._orderList()
    },

    // 查找订单
    searchOrder () {
      this.pramas.page = 1
      this._orderList()
    },
    // 选择订单状态
    stateChange (key) {
      this.activeIndex = key
      this.pramas.order_status = key
      this.pramas.page = 1
      this.orderList = []
      this.total_count = 0
      this._orderList()
    },
    // 订单列表 导出
    async exportData () {
      this.loading = true
      const {err, data} = await this.$service.shopOrder.ordermanager.list(
        {...this.pramas, page: 1, pre_page: 3000, export: 1}
      )
      this.loading = false
      if (err) return
      if (!data.result || !data.result.length) {
        this.$message.warning('没有需要导出的数据')
      } else {
        window.location.href = data.result
      }
    },
    // 订单列表
    async _orderList () {
      this.loading = true
      const {err, data} = await this.$service.shopOrder.ordermanager.list(
        this.pramas
      )
      if (err) return
      this.loading = false
      data.result.map((item) => {
        item.refund_money = Number(item.refund_money)
      })
      this.orderList = data.result
      this.total_count = data.total_count || 0
    },

    // 添加备注后调用列表
    callLists () {
      this._orderList()
    }
  }
}
</script>

<style scoped>
  .text-align {
    text-align: center;
  }

  .orderList:after {
    display: block;
    content: ".";
    clear: both;
    line-height: 0;
    visibility: hidden;
  }

  .listTop {
    line-height: 54px;
    background: #fff;
    padding-left: 10px;
  }

  .block {
    float: left;
  }

  .block span {
    margin-right: 8px;
  }

  .coding {
    float: left;
    margin: 0 40px;
  }

  .searchItem {
    float: left;
    margin: 0 15px 15px 0;
  }

  .searchItem .el-input {
    width: 150px;
  }

  .coding .el-input {
    width: 150px;
    margin-left: 8px;
  }

  .MoreSearch {
    float: left;
    margin-right: 10px;
  }

  .listing_information {
    width: 100%;
  }

  .listing_information th {
    height: 50px;
    text-align: center;
    font-weight: 500;
  }

  .listing_information td {
    padding: 20px 0;
    text-align: center;
    border: 1px solid #eee;
  }

  .order-box {
    margin-bottom: 10px;
  }

  .order-img {
    width: 60px;
    height: 60px;
    vertical-align: middle;
    margin-right: 10px;
  }

  .order-header {
    height: 40px;
    line-height: 40px;
    background-color: #e4f3ff;
    box-sizing: border-box;
    padding: 0 10px;
  }

  .order-header span {
    margin-left: 20px;
  }

  .order-body {
    box-sizing: border-box;
    border-left: 1px solid #e5e5e5;
  }

  .order-item {
    height: 100px;
    line-height: 100px;
    padding: 0 10px;
    box-sizing: border-box;
    border-right: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  .clearfix:after {
    content: "";
    display: block;
    clear: both;
  }

  .moreSearch {
    background: #fff;
    padding-left: 10px;
    line-height: 54px;
  }

  .el-menu {
    border-top: 1px solid #e6e6e6;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }
</style>
