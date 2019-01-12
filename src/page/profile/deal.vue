<template>
  <div id="center">
    <el-tabs type="border-card">
      <el-tab-pane label="交易概况">
        <div class="toptime">
          <div class="block">
            <span>时间：</span>
            <el-date-picker
              v-model="analyTime"
              size="small"
              type="daterange"
              unlink-panels="true"
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
          <!--<div class="simple-form-field">-->
          <!--<a class="inline-item date active" href="javascript:void(0);">今天</a>-->
          <!--<em class="ft-bar">|</em>-->
          <!--<span class="inline-text">最近：</span>-->
          <!--<a class="inline-item date" href="javascript:void(0);">1个月</a>-->
          <!--<a class="inline-item date" href="javascript:void(0);">3个月</a>-->
          <!--<a class="inline-item date" href="javascript:void(0);">1年</a>-->
          <!--</div>-->
        </div>
        <el-row
          style="width:100%; background:#fff; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
          <el-col :span="6" style="height:100px; border-right:1px solid #eee; text-align: center">
            <div class="grid-content bg-purple">
              <dl>
                <dt style="font-size:14px; line-height:14px; color:#666; margin-top:20px;">下单买家数</dt>
                <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:10px;">
                  {{analyDate.order_user_sum_create}}
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6" style="height:100px; border-right:1px solid #eee; text-align: center">
            <div class="grid-content bg-purple">
              <dl>
                <dt style="font-size:14px; line-height:14px; color:#666; margin-top:20px;">下单笔数</dt>
                <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:10px;">
                  {{analyDate.order_count_create}}
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6" style="height:100px; border-right:1px solid #eee; text-align: center">
            <div class="grid-content bg-purple">
              <dl>
                <dt style="font-size:14px; line-height:14px; color:#666; margin-top:20px;">下单金额（元）</dt>
                <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:10px;">
                  {{analyDate.order_money_create}}
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6" style="height:100px;  text-align: center">
            <div class="grid-content bg-purple">
              <dl>
                <dt style="font-size:14px; line-height:14px; color:#666; margin-top:20px;">付款买家数</dt>
                <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:10px;">
                  {{analyDate.order_user_sum_paid}}
                </dt>
              </dl>
            </div>
          </el-col>
        </el-row>

        <el-row
          style="width:100%; background:#fff; border-bottom: 1px solid #eee;">

          <el-col :span="6" style="height:100px; border-right:1px solid #eee; text-align: center">
            <div class="grid-content bg-purple">
              <dl>
                <dt style="font-size:14px; line-height:14px; color:#666; margin-top:10px;">付款订单数
                  <el-tooltip class="item" content="付款订单数：统计今日成功付款的线上订单、线下订单数，一个订单对应唯一一个订单号。" placement="right"
                              effect="light">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </dt>
                <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:5px;">
                  {{analyDate.order_count_paid}}
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6" style="height:100px; border-right:1px solid #eee; text-align: center">
            <div class="grid-content bg-purple">
              <dl>
                <dt style="font-size:14px; line-height:14px; color:#666; margin-top:10px;">付款金额（元）
                  <el-tooltip class="item" content="付款金额(元)：统计今日，所有线上、线下付款订单金额之和。" placement="right"
                              effect="light">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </dt>
                <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:5px;">
                  {{analyDate.order_pay_money_paid}}
                </dt>
              </dl>
            </div>
          </el-col>
          <el-col :span="6" style="height:100px; border-right:1px solid #eee; text-align: center">
            <div class="grid-content bg-purple">
              <dl>
                <dt style="font-size:14px; color:#666; line-height:14px; margin-top:20px;">付款件数</dt>
                <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:10px;">
                  {{analyDate.goods_number_sum_paid}}
                </dt>
              </dl>
            </div>
          </el-col>
        </el-row>

        <div style="height:400px; width:1100px; margin:0 auto; transform: translateY(10px)">
          <chart :options="option"></chart>
        </div>

      </el-tab-pane>
      <el-tab-pane label="销售统计">
        <div class="explanation_warp">
          <el-collapse accordion v-model="block">
            <div class="explanation">
              <el-collapse-item name="1">
                <template slot="title" style="height: 20px;">
                  <div class="title explain-checkZoom">
                    <i class="fa fa-bullhorn"></i>
                    <h4>温馨提示</h4>
                  </div>
                </template>
                <ul class="explain-panel">
                  <li>
                    <span>符合以下任何一种条件的订单即为有效订单：1）采用在线支付方式支付并且已付款；2）采用货到付款方式支付并且交易已完成。</span>
                  </li>
                </ul>
                <ul class="explain-panel">
                  <li>
                    <span>统计图展示了符合搜索条件的订单中的下单总金额和下单数量在时间段内的走势情况及与前一个时间段的趋势对比。</span>
                  </li>
                </ul>
                <!--<ul class="explain-panel">-->
                <!--<li>-->
                <!--<span>统计表显示了符合搜索条件的全部有效订单记录并可以点击"导出"将订单记录导出为Excel文件数。</span>-->
                <!--</li>-->
                <!--</ul>-->
              </el-collapse-item>
            </div>
          </el-collapse>
        </div>
        <div class="toptime">
          <div class="block">
            <span>时间: </span>
            <el-date-picker
              v-model="analyTime2"
              size="small"
              ref="change2"
              unlink-panels="true"
              type="daterange"
              @change="dateChange2"
              range-separator="-"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期">
            </el-date-picker>
          </div>
          <div class="block">
            <el-radio-group v-model="checkedDay2" size="small" style="margin-left: 15px;" @change="groupChange2">
              <el-radio-button label="0">今日</el-radio-button>
              <el-radio-button label="30">一个月</el-radio-button>
              <el-radio-button label="90">三个月</el-radio-button>
              <el-radio-button label="365">一年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="block" style="margin-left: 15px;">
            <span>订单状态：</span>
            <el-select v-model="pramas2.order_status" size="small" placeholder="请选择" clearable="">
              <el-option
                v-for="(item, index) in status"
                :key="item.statu"
                :label="item.statu_info"
                :value="item.statu"
              >
              </el-option>
            </el-select>
          </div>
          <el-button type="primary" size="small" @click="searchDate2">搜索</el-button>
        </div>

        <div class="balance-bill column3">
          <dl>
            <dd class="m-b-5">
              <span class="money" id="sum-count">{{saleDate.order_money_create}}</span>
            </dd>
            <dd>
              <span>总下单金额
                <el-tooltip class="item" placement="right" effect="light">
                  <i class="el-icon-question"></i>
                  <template slot="content">
                    <div style="width: 350px;">
                      总下单金额：统计今日，所有线上、线下付款订单金额之和。
                    </div>
                  </template>
                </el-tooltip>
              </span>
            </dd>
          </dl>
          <dl>
            <dd class="m-b-5">
              <span class="money">{{saleDate.order_count_create}}</span>
            </dd>
            <dd>
              <span>总下单数量
                <el-tooltip class="item" placement="right" effect="light">
                  <i class="el-icon-question"></i>
                    <template slot="content">
                      <div style="width: 350px;">
                        总下单数量：统计今日成功付款的线上订单、线下订单数，一个订单对应唯一一个订单号。
                      </div>
                    </template>
                 </el-tooltip>
              </span>
            </dd>
          </dl>
          <dl>
            <dd class="m-b-5">
              <span class="money">{{saleDate.goods_number_sum_create}}</span>
            </dd>
            <dd>
              <span>总下单商品数
                <el-tooltip class="item" placement="right" effect="light">
                  <i class="el-icon-question"></i>
                    <template slot="content">
                    <div style="width: 350px;">
                      总下单商品数：统计今日，所有订单的商品件数之和（货到付款在确认收货后计入总数量）。
                    </div>
                  </template>
                </el-tooltip>
              </span>
            </dd>
          </dl>
        </div>
        <div role="alert" class="el-alert el-alert--success">
          <div class="el-alert__content">
            <span class="el-alert__title">下单金额统计(前30天数据)</span>
            <i class="el-alert__closebtn el-icon-close" style="display: none;"></i>
          </div>
        </div>
        <div style="height:400px; width:1100px; margin:0 auto; transform: translateY(10px)">
          <chart :options="moneyOption"></chart>
        </div>
        <div role="alert" class="el-alert el-alert--success">
          <div class="el-alert__content">
            <span class="el-alert__title">下单量统计(前30天数据)</span>
            <i class="el-alert__closebtn el-icon-close" style="display: none;"></i>
          </div>
        </div>
        <div style="height:400px; width:1100px; margin:0 auto; transform: translateY(10px)">
          <chart :options="orderOption"></chart>
        </div>
      </el-tab-pane>
    </el-tabs>
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
      block: '1',
      buyData: '',
      checkedDay: 0,
      checkedDay2: 0,
      analyTime: [],
      analyTime2: [],
      tableData: [],
      saleDate: '',
      pramas: {
        start_date: '',
        end_date: ''
      },
      pramas2: {
        start_date: '',
        end_date: '',
        order_status: ''
      },
      status: [
        {statu: '', statu_info: '所有'},
        {statu: 0, statu_info: '待付款'},
        {statu: 1, statu_info: '待发货'},
        {statu: 2, statu_info: '待收货'},
        {statu: 3, statu_info: '已收货'},
        {statu: 4, statu_info: '已完成'},
        {statu: 5, statu_info: '已关闭'}
      ],
      option: {
        // grid: {
        //   x: 200,
        //   y: 90,
        //   x2: 40,
        //   y2: 20,
        //   height: 200
        // },
        tooltip: {
          trigger: 'axis'
        },
        color: ['#fbb8a2', '#8ee0c7', '#37a2da'],
        legend: {
          data: ['付款人数', '金额', '件数']
          // padding: [
          //   40, // 上
          //   0, // 右
          //   0, // 下
          //   0 // 左
          // ]
        },
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
            name: '付款人数',
            type: 'line',
            data: []
          },
          {
            name: '金额',
            type: 'line',
            yAxisIndex: 1,
            data: []
          },
          {
            name: '件数',
            type: 'line',
            data: []
          }
        ]
      },
      moneyOption: {
        // grid: {
        //   x: 200,
        //   y: 90,
        //   x2: 40,
        //   y2: 20,
        //   height: 200
        // },
        tooltip: {
          trigger: 'axis'
        },
        color: ['#fbb8a2'],
        calculable: true,
        xAxis: [
          {
            name: '金额',
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '日期'
          }
        ],
        series: [
          {
            name: '金额',
            type: 'line',
            data: []
          }
        ]
      },
      orderOption: {
        // grid: {
        //   x: 200,
        //   y: 90,
        //   x2: 40,
        //   y2: 20,
        //   height: 200
        // },
        tooltip: {
          trigger: 'axis'
        },
        color: ['#8ee0c7'],
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
            name: '下单量'
          }
        ],
        series: [
          {
            name: '下单量',
            type: 'line',
            data: []
          }
        ]
      },
      analyDate: {}
    }
  },
  created () {
    const init_params = {
      start_date: this.getDay(0),
      end_date: this.getDay(0)
    }
    this.getAnalysisDate(init_params)
    this.getAnalysisTrend({
      start_date: this.getDay(30),
      end_date: this.getDay(0)
    })
    this.getSaleDate(init_params)
    this.getOrderData({
      start_date: this.getDay(30),
      end_date: this.getDay(0)
    })
    this.getMoneyData({
      start_date: this.getDay(30),
      end_date: this.getDay(0)
    })
  },
  watch: {},
  methods: {
    // 搜索按钮
    searchDate () {
      this.getAnalysisDate(this.pramas)
    },
    searchDate2 () {
      this.getSaleDate(this.pramas2)
      // const {start_date, end_date} = this.pramas2;
      // this.getMoneyData({
      //   start_date: start_date,
      //   end_date: end_date
      // });
      // this.getOrderData({
      //   start_date: start_date,
      //   end_date: end_date
      // })
    },
    // 日期改变
    dateChange (val) {
      this.pramas.start_date = val[0]
      this.pramas.end_date = val[1]
      this.checkedDay = ''
    },
    dateChange2 (val) {
      this.pramas2.start_date = val[0]
      this.pramas2.end_date = val[1]
      this.checkedDay2 = ''
    },
    //  今天 一个月 三个月 一年
    groupChange (val) {
      this.pramas.start_date = this.getDay(val)
      this.pramas.end_date = this.getDay(0)
      Vue.set(this.$refs.change1.value, 0, this.getDay(val))
      Vue.set(this.$refs.change1.value, 1, this.getDay(0))
    },
    groupChange2 (val) {
      this.pramas2.start_date = this.getDay(val)
      this.pramas2.end_date = this.getDay(0)
      Vue.set(this.$refs.change2.value, 0, this.getDay(val))
      Vue.set(this.$refs.change2.value, 1, this.getDay(0))
    },
    getDay (day) {
      let date = new Date()
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000 * day)
      const m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return date.getFullYear() + '-' + m + '-' + d
    },
    // 获取交易概况
    async getAnalysisDate (params) {
      const {err, data} = await this.$service.report.analysis(params)
      if (err) return
      this.analyDate = data.result
    },
    // 获取交易概况趋势图数据
    async getAnalysisTrend (params) {
      const {err, data} = await this.$service.report.analysis_trend(params)
      if (err) return
      const trend_data = data.result
      this.option.xAxis[0].data = Object.keys(trend_data).sort()
      let payCount = []
      let money = []
      let count = []
      const trend_value = Object.values(trend_data).reverse()
      trend_value.forEach(item => {
        payCount.push(item.order_user_sum_paid)
        money.push(item.order_pay_money_paid)
        count.push(item.goods_number_sum_paid)
      })
      this.option.series[0].data = payCount
      this.option.series[1].data = money
      this.option.series[2].data = count
    },
    // 获取销售统计数据
    async getSaleDate (params) {
      const {err, data} = await this.$service.report.analysis_sales(params)
      if (err) return
      this.saleDate = data.result
    },
    // 获取销售下单量
    async getOrderData (params) {
      const {err, data} = await this.$service.report.analysis_order(params)
      if (err) return
      const order_data = data.result
      this.orderOption.xAxis[0].data = Object.keys(order_data).sort()
      const order_value = Object.values(order_data).reverse()
      let order_y = []
      order_value.forEach(item => {
        order_y.push(item.order_count_create)
      })
      this.orderOption.series[0].data = order_y
    },
    // 获取销售下单金额
    async getMoneyData (params) {
      const {err, data} = await this.$service.report.analysis_money(params)
      if (err) return
      const money_data = data.result
      this.moneyOption.xAxis[0].data = Object.keys(money_data).sort()
      const money_value = Object.values(money_data).reverse()
      let money_y = []
      money_value.forEach(item => {
        money_y.push(item.order_money_create)
      })
      this.moneyOption.series[0].data = money_y
    },
    showToggle () {
      this.isShow = !this.isShow
    }
  }
}
</script>
<style scoped>
  @import "./deal.css";
</style>

<style>
  .explanation .el-collapse-item__wrap {
    background: #ffffdc;
    border: 0;
  }

  .explanation .el-collapse-item__header {
    background: #ffffdc;
    border: 0;
    line-height: 20px;
    height: 26px;
  }

  .explanation_warp .el-collapse {
    border: 0;
  }

  .explanation .el-collapse-item__arrow {
    color: #BA8941;;
    line-height: 26px;
    font-weight: 600;
  }

  .explanation .el-collapse-item__content {
    padding-bottom: 0;
  }
</style>
