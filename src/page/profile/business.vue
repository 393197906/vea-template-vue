<template>
  <div>
    <div class="toptime">
      <div class="block">
        <span>时间：</span>
        <el-date-picker
          v-model="analyTime"
          size="small"
          unlink-panels="true"
          type="daterange"
          @change="dateChange"
          range-separator="-"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          start-placeholder="请选择开始日期"
          ref="change1"
          end-placeholder="请选择结束日期">
        </el-date-picker>
      </div>
      <el-radio-group v-model="checkedDay" size="small" style="margin-left: 15px;" @change="groupChange">
        <el-radio-button label="0">今日</el-radio-button>
        <el-radio-button label="30">一个月</el-radio-button>
        <el-radio-button label="90">三个月</el-radio-button>
        <el-radio-button label="365">一年</el-radio-button>
      </el-radio-group>
      <el-button type="primary" size="small" @click="searchDate">搜索</el-button>
    </div>
    <el-alert title="昨日经营概况" type="info" :closable="false"></el-alert>
    <div class="balance-bill column3">
      <dl class="p-l-0 p-r-0">
        <dd class="text-l">
					<span class="f14 m-r-5 m-l-20">
						营业额
						<el-tooltip class="item" placement="right" effect="light">
							<i class="el-icon-question"></i>
              <template slot="content">
              <div>
                营业额：选择的时间内的有效订单总金额。
              </div>
            </template>
						</el-tooltip>
					</span>
        </dd>
        <dd class="m-b-5">
          <span class="money" id="sales_amount">{{yesterdayData.order_money_create}}</span>
        </dd>
        <dd class="m-auto m-t-10">
          <p class="text-c">
						<span class="l-h-18">
							微信：
							<span id="online_payment">{{yesterdayData.order_money_wechat}}</span>
							元
						</span>
            <span class="m-r-10 l-h-18">
							支付宝：
							<span id="online_payment">{{yesterdayData.order_money_alipay}}</span>
							元
						</span>
            <span class="l-h-18">
							货到付款：
							<span id="online_payment">{{yesterdayData.order_money_cash_delivery}}</span>
							元
						</span>
          </p>
        </dd>
      </dl>
      <dl class="p-l-0 p-r-0">
        <dd class="text-l">
					<span class="f14 m-r-5 m-l-20">
						支出
						<el-tooltip class="item" placement="right" effect="light">
							<i class="el-icon-question"></i>
              <template slot="content">
                <div>
                  支出：选择的时间内的所有支出金额总价。
                </div>
              </template>
						</el-tooltip>
					</span>
        </dd>
        <dd class="m-b-5">
          <span class="money" id="payment">{{yesterdayData.outlay}}</span>
        </dd>
        <dd class="m-t-10">
          <p class="text-c">
            <!--<span class="m-r-15 l-h-18">
                            佣金：
                            <span id="online_payment">0.00</span>
                            元
                        </span>-->
            <span class="l-h-18">
							在线支付费率的费用：
							<span id="online_payment">{{yesterdayData.online_pay_fee}}</span>
							元
						</span>
          </p>
          <p class="text-c">
						<span class="m-r-15 l-h-18">
							物流：
							<span id="online_payment">{{yesterdayData.order_shipping_money_create}}</span>
							元
						</span>
          </p>
        </dd>
      </dl>
      <dl class="p-l-0 p-r-0">
        <dd class="text-l">
					<span class="f14 m-r-5 m-l-20">
						预计净收入
						<el-tooltip class="item" placement="right" effect="light">
							<i class="el-icon-question"></i>
              <template slot="content">
                <div style="width: 350px;">
                  预计净收入：选择的时间内店铺净收入金额；计算公式：营业额-支出。
                </div>
              </template>
						</el-tooltip>
					</span>
        </dd>
        <dd class="m-b-5">
          <span class="money" id="income">{{yesterdayData.prediction_income_money}}</span>
        </dd>
        <dd class="m-t-10">
          <p class="text-c">
            <!--<span class="m-r-15 l-h-18">
                            扣除支出的本日收入
                            <span id="online_payment">237.87</span>
                            元
                        </span>-->
          </p>
        </dd>
      </dl>
    </div>
    <el-alert title="订单数据" type="info" :closable="false"></el-alert>
    <div class="balance-bill column3">
      <dl class="p-l-0 p-r-0">
        <dd class="text-l">
					<span class="f14 m-r-5 m-l-20">
						有效订单数
						<el-tooltip class="item" placement="right" effect="light">
							<i class="el-icon-question"></i>
              <template slot="content">
                <div style="width: 350px;">
                  有效订单数：选择的时间内交易成功、已付款未发生退款或退款未完成、货到付款已发货的订单数、线下订单未退款数。
                </div>
              </template>
						</el-tooltip>
					</span>
        </dd>
        <dd class="m-b-5">
          <span class="money" id="payment_count">{{todayData.order_valid_count}}</span>
        </dd>
        <dd class="m-auto m-t-10">
          <p class="text-c">
						<span class="m-r-15 l-h-18">
							在线支付自提：
							<span id="online_payment">{{todayData.online_pay_order_mention_valid_count}}</span>
							单
						</span>
            <span class="l-h-18">
							在线支付物流：
							<span id="online_payment">{{todayData.online_pay_order_logistics_valid_count}}</span>
							单
						</span>
            <span class="l-h-18">
							货到付款自提：
							<span id="online_payment">{{todayData.offline_pay_order_mention_valid_count}}</span>
							单
						</span>
            <span class="l-h-18">
							货到付款物流：
							<span id="online_payment">{{todayData.offline_pay_order_logistics_valid_count}}</span>
							单
						</span>
          <p class="text-c">
            <!--<span class="l-h-18">
							有效订单总数：
							<span id="online_payment">{{}}</span>
							单
						</span>-->
          </p>
        </dd>
      </dl>
      <dl class="p-l-0 p-r-0">
        <dd class="text-l">
					<span class="f14 m-r-5 m-l-20">
						无效订单数：
						<el-tooltip class="item" placement="right" effect="light">
							<i class="el-icon-question"></i>
              <template slot="content">
                <div>
                  无效订单数：选择的时间内交易关闭和退款的订单数。
                </div>
              </template>
						</el-tooltip>
					</span>
        </dd>
        <dd class="m-b-5">
          <span class="money" id="cancel_count">{{todayData.order_invalid_count}}</span>
        </dd>
        <dd class="m-t-10">
          <p class="text-c">
						<span class="m-r-15 l-h-18">
							在线支付自提：
							<span id="online_payment">（ {{todayData.online_pay_order_mention_invalid_count}} ）</span>
						</span>
            <span class="l-h-18">
							在线支付物流：
							<span id="online_payment">（ {{todayData.online_pay_order_logistics_invalid_count}} ）</span>
						</span>
          </p>
          <p class="text-c">
						<span class="m-r-15 l-h-18">
							货到付款自提：
							<span id="online_payment">（ {{todayData.offline_pay_order_mention_invalid_count}} ）</span>
						</span>
            <span class="l-h-18">
							货到付款物流：
							<span id="online_payment">（ {{todayData.offline_pay_order_logistics_invalid_count}} ）</span>
						</span>
            <!--<span class="l-h-18">
							无效订单总数：
							<span id="online_payment">（ 0 ）</span>
						</span>-->
          </p>
        </dd>
      </dl>
      <dl class="p-l-0 p-r-0">
        <dd class="text-l">
					<span class="f14 m-r-5 m-l-20">
						预计损失
						<el-tooltip class="item" placement="right" effect="light">
							<i class="el-icon-question"></i>
              <template slot="content">
                <div style="width: 350px;">
                  预计损失：选择的时间内无效订单给商家带来的损失； 计算公式：无效订单金额累计； 线下预计损失：选择的时间内退款和关闭的订单给商家带来的损失；计算公式：退款订单和关闭订单金额累计。
                </div>
              </template>
						</el-tooltip>
					</span>
        </dd>
        <dd class="m-b-5">
          <span class="money" id="losses">{{todayData.order_invalid_money}}</span>
        </dd>
        <dd class="m-t-10">
          <p class="text-c">
						<span class="l-h-18">
							在线支付自提：
							<span id="online_payment">{{todayData.online_pay_order_mention_invalid_money}}</span>
							元
						</span>
            <span class="l-h-18">
							在线支付物流：
							<span id="online_payment">{{todayData.online_pay_order_logistics_invalid_money}}</span>
							元
						</span>
          </p>
          <p class="text-c">
						<span class="l-h-18">
							货到付款自提：
							<span id="online_payment">{{todayData.offline_pay_order_mention_invalid_money}}</span>
							元
						</span>
            <span class="l-h-18">
							货到付款物流：
							<span id="online_payment">{{todayData.offline_pay_order_logistics_invalid_money}}</span>
							元
						</span>
            <!--<span class="l-h-18">
							预计损失销售额：
							<span id="online_payment">0.00</span>
							元
						</span>-->
          </p>
        </dd>
      </dl>
    </div>

    <!--<el-alert title="有效订单数据明细" type="info" :closable="false"></el-alert>-->
    <!--<div class="balance-bill-end column4">-->
    <!--<dl class="bottom-line">-->
    <!--<dt>在线支付普通订单</dt>-->
    <!--<dd>-->
    <!--<span class="money" id="online_normal_count">28</span>-->
    <!--<span class="unit">单</span>-->
    <!--</dd>-->
    <!--</dl>-->
    <!--<dl class="bottom-line">-->
    <!--<dt>线上货到付款普通订单</dt>-->
    <!--<dd>-->
    <!--<span class="money" id="online_cod_count">21</span>-->
    <!--<span class="unit">单</span>-->
    <!--</dd>-->
    <!--</dl>-->
    <!--<dl class="bottom-line">-->
    <!--<dt>自由购订单</dt>-->
    <!--<dd>-->
    <!--<span class="money" id="online_freebuy_count">0</span>-->
    <!--<span class="unit">单</span>-->
    <!--</dd>-->
    <!--</dl>-->
    <!--<dl class="bottom-line">-->
    <!--<dt>堂内点餐订单</dt>-->
    <!--<dd>-->
    <!--<span class="money" id="online_reachbuy_count">0</span>-->
    <!--<span class="unit">单</span>-->
    <!--</dd>-->
    <!--</dl>-->
    <!--<dl>-->
    <!--<dt>线下收银订单</dt>-->
    <!--<dd>-->
    <!--<span class="money" id="offline_cash_count">2</span>-->
    <!--<span class="unit">单</span>-->
    <!--</dd>-->
    <!--</dl>-->
    <!--<dl>-->
    <!--<dt>神码收银订单</dt>-->
    <!--<dd>-->
    <!--<span class="money" id="online_cashier_count">0</span>-->
    <!--<span class="unit">单</span>-->
    <!--</dd>-->
    <!--</dl>-->
    <!--<dl>-->
    <!--<dt>提货券订单</dt>-->
    <!--<dd>-->
    <!--<span class="money" id="gift_card_count">1</span>-->
    <!--<span class="unit">单</span>-->
    <!--</dd>-->
    <!--</dl>-->
    <!--</div>-->

  </div>
</template>

<script>
import Vue from 'vue'

export default {
  data () {
    return {
      buyData: '',
      checkedDay: 0,
      analyTime: [],
      params: {
        start_date: '',
        end_date: ''
      },
      yesterdayData: {},
      todayData: {}
    }
  },
  created () {
    const day = this.getDay(0)
    const init_params = {
      start_date: day,
      end_date: day
    }
    this.getData(init_params)
    const yestody = this.getDay(1)
    this.getData({
      start_date: yestody,
      end_date: yestody,
      day: 1
    })
  },
  methods: {
    //  搜索
    searchDate () {
      this.getData(this.params)
    },

    //  时间日期查询
    dateChange (val) {
      this.params.start_date = val[0]
      this.params.end_date = val[1]
      this.checkedDay = ''
    },

    //  今天 一个月 三个月 一年
    groupChange (val) {
      this.params.start_date = this.getDay(val)
      this.params.end_date = this.getDay(0)
      Vue.set(this.$refs.change1.value, 0, this.getDay(val))
      Vue.set(this.$refs.change1.value, 1, this.getDay(0))
    },

    getDay (day) {
      let date = new Date()
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000 * day)
      const m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return date.getFullYear() + '-' + m + '-' + d
    },
    async getData (params) {
      const {err, data} = await this.$service.report.business_data(params)
      if (err) return
      if (data.code == 200) {
        if (params.day && params.day === 1) {
          this.yesterdayData = data.result
        } else {
          this.todayData = data.result
        }
      } else {
        this.$message.error(data.message)
      }
    }
  }
}
</script>

<style scoped>
  @import "./business.css";
</style>
