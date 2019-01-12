<template>
  <div class="ns-main">
    <div class="toptime">
      <el-radio-group v-model="check_day" size="small" @change="dayChange">
        <el-radio-button label="0">今日</el-radio-button>
        <el-radio-button label="6">一周</el-radio-button>
        <el-radio-button label="29">一个月</el-radio-button>
        <el-radio-button label="89">三个月</el-radio-button>
        <!--<el-radio-button label="365">一年</el-radio-button>-->
      </el-radio-group>
      <div class="block">
        <span>时间：</span>
        <el-date-picker
          v-model="select_time"
          unlink-panels="true"
          size="small"
          type="daterange"
          @change="timeChange"
          range-separator="-"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="请选择开始日期"
          end-placeholder="请选择结束日期">
        </el-date-picker>
      </div>
    </div>
    <!--<transition name="el-zoom-in-top">-->
    <div class="ns-card">
      <!--销售金额-->
      <div class="ns-card-item">
        <div>
          <p v-if="result.sales_amount!==undefined">￥{{result.sales_amount | formatMoney}}</p>
          <el-tooltip content="该时间段内已支付订单（包含货到付款订单）的总金额" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>销售金额</p>
        </div>
      </div>
      <!--应收款金额-->
      <div class="ns-card-item">
        <div>
          <p v-if="result.receivables!==undefined">￥{{result.receivables| formatMoney}}</p>
          <el-tooltip content="筛选时间内形成应收款的全部金额" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>应收款金额</p>
        </div>
      </div>
      <!--毛利润-->
      <div class="ns-card-item">
        <div>
          <p v-if="result.profit!==undefined">￥{{result.profit| formatMoney}}</p>
          <el-tooltip content="该时间段内销售金额与销售成本的差值" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>毛利润</p>
        </div>
      </div>
      <!--库存金额-->
      <div class="ns-card-item">
        <div>
          <p v-if="result.total_Money!==undefined">￥{{result.total_Money | formatMoney}}</p>
          <el-tooltip content="仓库中待出售（可售库存与占用库存总数）的商品总额" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>库存金额</p>
        </div>
      </div>
      <!--客单价-->
      <div class="ns-card-item">
        <div>
          <p v-if="result.customer_price!==undefined">￥{{result.customer_price| formatMoney}}</p>
          <el-tooltip content="该时间段内总销售额与购买用户家数的比值" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>客单价</p>
        </div>
      </div>
      <!--库存商品SKU数-->
      <div class="ns-card-item">
        <div>
          <p>{{result.count_sku}}</p>
          <el-tooltip content="仓库中待出售（可售库存与占用库存总数）的商品SKU数量" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>库存商品SKU数</p>
        </div>
      </div>
      <!--总用户家数-->
      <div class="ns-card-item">
        <div>
          <p>{{result.count_store}}</p>
          <el-tooltip content="该时间段内所筛选出来的总用户数" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>总用户家数</p>
        </div>
      </div>
      <!--购买用户家数-->
      <div class="ns-card-item">
        <div>
          <p>{{result.shopping}}</p>
          <el-tooltip content="该时间段内筛选出来的用户中进行过订单交易的用户总数" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>购买用户家数</p>
        </div>
      </div>
      <!--新用户注册家数-->
      <div class="ns-card-item">
        <div>
          <p>{{result.new_store}}</p>
          <el-tooltip content="该时间段内新注册的用户总数" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>新用户注册家数</p>
        </div>
      </div>
      <!--销售商品数-->
      <div class="ns-card-item">
        <div>
          <p>{{result.sales_goods}}</p>
          <el-tooltip content="该时间段内已付款订单（包含货到付款订单）商品销售数量总计" placement="top" effect="light">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <p>销售商品数</p>
        </div>
      </div>
    </div>
    <!--</transition>-->
    <div class="goods-prompt">
      <h3>
        <i class="i-circular"></i>交易提示<span>您需要立即处理的交易订单</span>
      </h3>
      <el-row style="border-top:1px solid #f0f0f0">
        <el-col :span="8" style="border-right:1px solid #f0f0f0">
          <div class="grid-content">
            <div class="amount">
              {{tips.send_order}}
            </div>
            <div>
              待发货订单数
              <el-tooltip class="item" content="待发货订单数。" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="8" style="border-right:1px solid #f0f0f0">
          <div class="grid-content">
            <div class="amount">
              {{tips.up_sku}}
            </div>
            <div>
              上架商品SKU数
              <el-tooltip class="item" content="上架商品SKU数。" placement="right" effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="amount">
              {{tips.down_sku}}
            </div>
            <div>
              未上架商品SKU数
              <el-tooltip class="item" content="未上架商品SKU数。" placement="right" effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
      </el-row>
      <!--内容-->
    </div>
    <transition name="el-zoom-in-top">
      <div class="goods-prompt" v-if="this.order_time_arr.length">
        <h3>
          <i class="i-circular"></i>统计<span>常用数据统计</span>
          <div style="display: inline-block;float: right;padding-right: 10px">
            <el-radio-group size="mini" v-model="order_type">
              <el-radio-button label="orderNumber">订单数量</el-radio-button>
              <el-radio-button label="orderMoney">订单金额</el-radio-button>
            </el-radio-group>
            <el-button type="text" style="margin-left: 20px" @click="exportData">导出</el-button>
          </div>
        </h3>
        <div class="welcome-chart-container">
          <!--订单数量报表-->
          <chart ref="chart" v-if="order_type==='orderNumber'" :options="order_number_option"/>
          <chart ref="chart" v-else :options="order_money_option"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import {formatCurrency} from '@/util/util'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/title'

Vue.component('chart', ECharts)
export default {
  name: 'welcome',
  data: function () {
    return {
      check_day: '0', // 选择日期
      select_time: '', // 选择时间
      result: {}, // 数据集
      tips: {}, // 交易提示数据集
      order_type: 'orderNumber', // 数据报表类型
      order_time_arr: [],
      order_number_arr: [],
      order_money_arr: []
    }
  },
  filters: {
    formatMoney: function (value) {
      if (value === undefined) return
      return formatCurrency(Math.round(value)).split('.')[0]
    }
  },
  computed: {
    order_number_option () {
      return {
        color: ['#37a2da'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [
            '订单数量'
          ]
        },
        calculable: true,
        grid: {
          left: '50px',
          right: '100px',
          bottom: '100px'
        },
        xAxis: [
          {
            name: '日期',
            type: 'category',
            boundaryGap: false,
            data: this.order_time_arr,
            axisLabel: {
              interval: 0,
              rotate: -40
            }
          }
        ],
        yAxis: [
          {
            name: '数量',
            type: 'value'
          }
        ],
        series: [
          {
            name: '订单数量',
            type: 'line',
            data: this.order_number_arr
          }
        ]
      }
    },
    order_money_option () {
      return {
        color: ['#da7340'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [
            '订单金额'
          ]
        },
        grid: {
          left: '50px',
          right: '100px',
          bottom: '100px'
        },
        calculable: true,
        xAxis: [
          {
            name: '日期',
            type: 'category',
            boundaryGap: false,
            data: this.order_time_arr,
            axisLabel: {
              interval: 0,
              rotate: -40
            }
          }
        ],
        yAxis: [
          {
            name: '金额',
            type: 'value'
          }
        ],
        series: [
          {
            name: '订单金额',
            type: 'line',
            data: this.order_money_arr
          }
        ]
      }
    }
  },
  async created () {
    this.dayChange(this.check_day)
    // 获取交易提示数据
    const {data, err} = await this.$service.getWelcomeTrading()
    if (err) return
    this.tips = data.result
  },
  methods: {
    async exportData () {
      let [startTime, endTime] = this.select_time
      if (startTime === endTime) {
        endTime = `${endTime.split(' ')[0]} 23:59:59`
      }
      const {data, err} = await this.$service.getWelcomeOrderExport({start_time: startTime, end_time: endTime})
      if (err) return
      if (!data.result.length) {
        this.$message.warning('没有需要导出的数据')
        return
      }
      const json2excel = await import('yt-json2excel/src/index')
      json2excel.default('订单数据', data.result.map(item => {
        const {order_status: orderStatus, ...rest} = item
        return rest
      }), [{
        order_no: '订单编号',
        store_name: '用户名称',
        phone: '手机号',
        order_money: '订单金额',
        create_time: '下单时间',
        order_status_info: '订单状态'
      }])
    },
    // 搜索
    async search (start, end) {
      const params = {start_time: start, end_time: end}
      const results = await Promise.all([
        this.$service.getWelcomeData(params),
        this.$service.getWelcomeStatistics(params)
      ])
      for (let item of results) {
        if (item.err) return
      }
      this.result = results[0].data.result
      // 处理图表数据
      const statisticsData = results[1].data.result || {}
      const [orderNumberArr, orderMoneyArr, orderTimeArr] = Object.keys(statisticsData).reduce((container, item) => {
        const {count_order: countOrder, many_order: manyOrder, stat_date: staDate} = statisticsData[item]
        container[0].push(countOrder)
        container[1].push(manyOrder)
        container[2].push(staDate)
        return container
      }, [[], [], []])
      this.order_time_arr = Object.keys(statisticsData)
      this.order_number_arr = orderNumberArr
      this.order_money_arr = orderMoneyArr
    },
    // 时间框改变
    timeChange (time) {
      let [start, end] = time
      // if (start === end) {
      end = `${end.split(' ')[0]} 23:59:59`
      // }
      this.check_day = ''
      this.search(start, end)
    },
    // 日期选择改变
    dayChange (day) {
      day = parseInt(day)
      // 默认0
      let {start, end} = (() => {
        const time = parseInt(Date.now() / 1000)
        const day = this.$formatTime(time, 'yyyy-MM-dd')
        return {
          start: `${day} 00:00:00`,
          end: `${day} 23:59:59`
        }
      })()
      if (day) {
        const time = parseInt(Date.now() / 1000)
        const today = this.$formatTime(time, 'yyyy-MM-dd')
        end = `${today} 23:59:59`
        start = this.$formatTime(parseInt(Date.now() / 1000) - day * 24 * 3600, 'yyyy-MM-dd') + ' 00:00:00'
      }
      this.select_time = [start, end]
      this.search(start, end)
    }

  }
}
</script>
<style>
  .welcome-chart-container .echarts {
    width: 100%;
    height: 400px;
  }
</style>
<style scoped>

  .item {
    color: #8c939d;
  }

  .grid-content {
    text-align: center;
    padding: 15px 0;
  }

  .amount {
    color: #3a8ee6;
    font-size: 20px;
    height: 52px;
    line-height: 52px;
  }

  .table_container {
    max-height: 500px;
    overflow-y: auto;
  }

  .ns-card {
    background-color: #fff;
    padding: 10px 30px;

  }

  .ns-card:after {
    content: "020";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .ns-card-item {
    width: 20%;
    box-sizing: border-box;
    float: left;
    padding: 10px 0;
  }

  .ns-card-item div {
    box-sizing: border-box;
    background-color: #3a8ee6;
    width: 88%;
    margin: 0 auto;
    text-align: center;
    padding: 12px;
    position: relative;
  }

  .ns-card-item div i {
    position: absolute;
    right: 3px;
    top: 3px;
    color: #e9e9e9;
  }

  .ns-card-item div p:first-child {
    color: #fff;
    font-size: 30px;
    font-weight: bold;
  }

  .ns-card-item div p:last-child {
    margin-top: 5px;
    color: #e9e9e9;
  }

  .toptime {
    background: #fff;
    padding: 8px 10px;
    border-bottom: 1px solid #f0f0f0;
  }

  .block {
    display: inline-block;
    margin-left: 20px;
  }

  .goods-prompt {
    background: #fff;
    margin: 5px 0;
  }

  .goods-prompt h3 {
    color: #333;
    padding-left: 10px;
    margin: 0;
    font-size: 14px;
    font-weight: normal;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .i-circular {
    display: inline-block;
    background: #126ae4;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    margin: -1px 5px 0 0;
    vertical-align: middle;
  }

  .goods-prompt h3 span {
    padding-left: 10px;
    font-size: 12px;
    color: #999;
    font-weight: normal;
  }

  .goods-prompt h3 {
    color: #333;
    padding-left: 10px;
    margin: 0;
    line-height: 40px;
    font-size: 14px;
    font-weight: normal;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>
