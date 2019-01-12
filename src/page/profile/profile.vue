<template>
  <div id="center">
    <el-alert class="time" title="今日实时" type="info" :closable="false">
      <el-tooltip class="item" content="今日实时数据的统计时间均为今日零时截至当前更新时间" placement="right" effect="light">
        <i class="el-icon-question"></i>
      </el-tooltip>
      <div class="name-time">
        <el-tag size="medlum" class="name-warp">（更新时间 ：{{ nowTime / 1000 | formatTime}}）</el-tag>
      </div>
    </el-alert>
    <div class="statistical">
      <ul>
        <!--付款订单数量-->
        <li>
          <div class="left">
            <strong class="js-order-amount">{{todayDate.order_paid_count}}</strong>
          </div>
          <div class="right">
            <p>
              付款订单数量
              <el-tooltip class="item" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    付款订单数：统计今日成功付款的线上订单、线下订单数，一个订单对应唯一一个订单号。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--付款金额-->
        <li>
          <div class="left">
            <strong class="js-weixin-fans-count">{{todayDate.order_pay_money_paid}}</strong>
          </div>
          <div class="right">
            <p>
              付款金额（元）
              <el-tooltip class="item" content="" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    付款金额（元）：统计今日，所有线上、线下付款订单金额之和。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--付款商品件数-->
        <li>
          <div class="left">
            <strong class="js-goods-release-count">{{todayDate.goods_number_sum_paid}}</strong>
          </div>
          <div class="right">
            <p>
              付款商品件数
              <el-tooltip class="item" content="" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    付款商品件数：统计今日，所有线上、线下付款订单的商品件数之和（货到付款在确认收货后计入总数量）。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--发货订单数-->
        <li>
          <div class="left">
            <strong class="js-order-total">{{yesterdayData.order_shipping_count}}</strong>
          </div>
          <div class="right">
            <p>
              发货订单数
              <el-tooltip class="item" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    发货订单数：统计昨日发货订单数量，昨日的订单，今日发货，此处统计的数量不增加，只统计发货时间是昨日的数量。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>

        <!--取消订单数-->
        <li>
          <div class="left">
            <strong class="js-order-total">{{todayDate.order_cancel_count}}</strong>
          </div>
          <div class="right">
            <p>
              取消订单数
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    取消订单数：统计时间内，所有线上、线下退款，关闭的订单数。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>

      </ul>
    </div>
    <div class="statistical">
      <ul>
        <!--取消订单金额-->
        <li>
          <div class="left">
            <strong class="js-month-sales">{{todayDate.order_cancel_money}}</strong>
          </div>
          <div class="right">
            <p>取消订单金额
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    取消订单金额：统计时间内，所有线上、线下退款，关闭订单金额总和。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--客单价-->
        <li>
          <div class="left">
            <strong class="js-order-amount">{{todayDate.order_customer_price}}</strong>
          </div>
          <div class="right">
            <p>
              客单价
              <el-tooltip class="item" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    客单价：统计今日成功付款的线上订单、线下订单金额除以购买的客户数。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--下单会员数-->
        <li>
          <div class="left">
            <strong class="js-weixin-fans-count">{{todayDate.order_user_sum_create}}</strong>
          </div>
          <div class="right">
            <p>
              下单会员数
              <el-tooltip class="item" content="" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div>
                    下单会员数：统计今日下过订单的会员总数。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--下单商品数量-->
        <li>
          <div class="left">
            <strong class="js-goods-release-count">{{todayDate.goods_number_sum_create}}</strong>
          </div>
          <div class="right">
            <p>
              下单商品数量
              <el-tooltip class="item" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    下单商品数量：统计今日，所有订单的商品件数之和（货到付款在确认收货后计入总数量）。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--新增会员-->
        <li>
          <div class="left">
            <strong class="js-goods-release-count">{{todayDate.new_shop_member_count}}</strong>
          </div>
          <div class="right">
            <p>
              新增会员
              <el-tooltip class="item" content="" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div>
                    新增会员：今日店铺新增的会员数。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 昨日经营 -->
    <el-alert title="昨日经营概况" type="info" :closable="false"></el-alert>
    <div class="statistical">
      <ul>
        <!--付款订单数量-->
        <li>
          <div class="left">
            <strong class="js-weixin-fans-count">{{yesterdayData.order_paid_count}}</strong>
          </div>
          <div class="right">
            <p>
              付款订单数量
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    付款订单数：统计今日成功付款的线上订单、线下订单数，一个订单对应唯一一个订单号。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--付款金额（元）-->
        <li>
          <div class="left">
            <strong class="js-goods-release-count">{{yesterdayData.order_pay_money_paid}}</strong>
          </div>
          <div class="right">
            <p>
              付款金额(元)
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    付款金额(元)：统计昨日，所有线上、线下已付款、交易成功的订单金额之和。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--付款商品件数-->
        <li>
          <div class="left">
            <strong class="js-order-amount">{{yesterdayData.goods_number_sum_paid}}</strong>
          </div>
          <div class="right">
            <p>
              付款商品件数
              <el-tooltip class="item" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    付款商品件数：统计昨天，所有线上、线下付款订单的商品件数之和（货到付款在确认收货后计入总数量）。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--发货订单数-->
        <li>
          <div class="left">
            <strong class="js-order-total">{{yesterdayData.order_shipping_count}}</strong>
          </div>
          <div class="right">
            <p>
              发货订单数
              <el-tooltip class="item" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    发货订单数：统计昨日发货订单数量，昨日的订单，今日发货，此处统计的数量不增加，只统计发货时间是昨日的数量。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--取消订单数-->
        <li>
          <div class="left">
            <strong class="js-month-sales">{{yesterdayData.order_cancel_count}}</strong>
          </div>
          <div class="right">
            <p>取消订单数
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    取消订单数：统计时间内，所有线上、线下退款，关闭的订单数。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div class="statistical">
      <ul>
        <!--取消订单金额-->
        <li>
          <div class="left">
            <strong class="js-order-amount">{{yesterdayData.order_cancel_money}}</strong>
          </div>
          <div class="right">
            <p>
              取消订单金额
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    取消订单金额：统计时间内，所有线上、线下退款，关闭订单金额总和。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--客单价-->
        <li>
          <div class="left">
            <strong class="js-goods-release-count">{{yesterdayData.order_customer_price}}</strong>
          </div>
          <div class="right">
            <p>
              客单价
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    客单价：统计今日成功付款的线上订单、线下订单金额除以购买的客户数。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--下单会员数-->
        <li>
          <div class="left">
            <strong class="js-weixin-fans-count">{{yesterdayData.order_user_sum_create}}</strong>
          </div>
          <div class="right">
            <p>
              下单会员数
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div>
                    下单会员数：统计今日下过订单的会员总数。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--下单商品数量-->
        <li>
          <div class="left">
            <strong class="js-order-total">{{yesterdayData.goods_number_sum_create}}</strong>
          </div>
          <div class="right">
            <p>
              下单商品数量
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div style="width: 350px;">
                    下单商品数量 ：统计今日，所有订单的商品件数之和（货到付款在确认收货后计入总数量）。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
        <!--新增会员-->
        <li>
          <div class="left">
            <strong class="js-month-sales">{{yesterdayData.new_shop_member_count}}</strong>
          </div>
          <div class="right">
            <p>新增会员
              <el-tooltip class="item" placement="right" effect="light">
                <i class="el-icon-question"></i>
                <template slot="content">
                  <div>
                    新增会员：今日店铺新增的会员数。
                  </div>
                </template>
              </el-tooltip>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <el-alert class="time" title="近7天订单趋势" type="info" :closable="false">
      <el-tooltip class="item" content="总订单量统计的订单包括：普通订单、线下订单，包括所有状态的订单" placement="right" effect="light">
        <i class="el-icon-question"></i>
      </el-tooltip>
    </el-alert>
    <div class="charts">
      <el-row>
        <chart :options="option"></chart>
      </el-row>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

Vue.component('chart', ECharts)
export default {
  data () {
    return {
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [
            '金额',
            '商品数量',
            '订单数量'
          ],
          padding: [20, 0, 0, 0]
        },
        color: ['#fbb8a2', '#8ee0c7', '#37a2da'],
        // toolbox: {
        //   show: true,
        //   feature: {
        //     mark: {show: true},
        //     dataView: {show: true, readOnly: false},
        //     magicType: {
        //       show: true,
        //       type: ["line", "bar", "stack", "tiled"]
        //     },
        //     restore: {show: true},
        //     saveAsImage: {show: true}
        //   }
        // },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }

        ],
        yAxis: [
          {
            type: 'value',
            name: '数量'
          },
          {
            type: 'value',
            name: '金额'
          }
        ],
        series: [
          {
            name: '金额',
            type: 'line',
            yAxisIndex: 1,
            data: []
          },
          {
            name: '商品数量',
            type: 'line',
            data: []
          },
          {
            name: '订单数量',
            type: 'line',
            data: []
          }
        ]
      },
      nowTime: '', //  更新时间
      yesterdayData: {}, //  昨天
      todayDate: {}, //  今天
      general_chart: {}, //  趋势图
      money_data: [], //  金额
      quantity_data: [], //  数量
      order_quantity: [], //  订单数量
      params: {
        start_date: '', //  昨日
        end_date: '', //  今日
        week_date: '' //  七天
      }
    }
  },
  created () {
    const nowDate = new Date()
    this.nowTime = nowDate.getTime()
    this.getDay()
    this.getData({
      start_date: this.params.start_date,
      end_date: this.params.start_date,
      day: 1
    })
    this.getData({
      start_date: this.params.end_date,
      end_date: this.params.end_date
    })
    this.tendency({
      start_date: this.params.week_date,
      end_date: this.params.end_date
    })
  },
  methods: {
    // 获取昨天和今天的日期和近一星期的日期
    getDay () {
      let date = new Date()
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000)
      this.params.start_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

      let date1 = new Date()
      date1.setTime(date1.getTime())
      this.params.end_date = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()

      let date2 = new Date()
      date2.setTime(date2.getTime() - 24 * 60 * 60 * 1000 * 7)
      this.params.week_date = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
    },
    // 获取数据
    async getData (params) {
      const {err, data} = await this.$service.report.list(params)
      if (err) return
      if (parseInt(data.code) === 200) {
        if (params.day && params.day === 1) {
          this.yesterdayData = data.result
        } else {
          this.todayDate = data.result
        }
      } else {
        this.$Message.error(data.msg)
      }
    },
    //  趋势图
    async tendency (params) {
      const {err, data} = await this.$service.report.general_tendency(params)
      if (err) return
      if (data.code == 200) {
        this.option.xAxis[0].data = Object.keys(data.result).sort()
        const temp_value = Object.values(data.result).reverse()
        temp_value.forEach((item, i) => {
          this.money_data.push(parseInt(item.order_money))
          this.order_quantity.push(parseInt(item.order_count))
          this.quantity_data.push(parseInt(item.order_goods_sum))
        })
        this.option.series[0].data = this.money_data
        this.option.series[1].data = this.quantity_data
        this.option.series[2].data = this.order_quantity
      } else {
        this.$Message.error(data.msg)
      }
    }
  }
}
</script>

<style scoped>
  @import "./profile.css";
</style>

<style>
  .el-alert__content .el-alert__title{
    font-weight: 500 !important;
  }
</style>
