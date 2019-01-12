<template>
  <div>
    <div class="explanation_warp">
      <el-collapse accordion>
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
                <span>销售数量：统计非交易关闭的线上、线下订单中的商品总数量，比如一笔订单中A商品购买两件，那销售数量即是2，销售额是销售数量*当时购买A商品的单价</span>
              </li>
            </ul>
            <ul class="explain-panel">
              <li>
                <span>有效下单量：选择的时间内交易成功、已付款未发生退款或退款未完成、货到付款已发货的订单数、线下订单未退款数</span>
              </li>
            </ul>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
    <div class="toptime">
      <div style="display:inline-block;margin-left: 15px;">
        <span>时间： </span>
        <el-date-picker
          v-model="kindTime"
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
      <div class="coding">
        <span>商品分类：</span>
        <el-cascader
          size="small"
          class="input"
          v-model="goods_category"
          :options="category_list"
          placeholder="请选择商品分类"
          :change-on-select="true"
          clearable
          :props="props"
        ></el-cascader>
        <!--<el-button size="small">导出</el-button>-->
      </div>
      <el-button type="primary" size="small" @click="searchKindDate">搜索</el-button>
    </div>
    <el-alert title="类目分析概况" type="info" :closable="false"></el-alert>
    <el-tabs v-model="activeName2" type="card">

      <el-tab-pane label="类目下单金额排行" name="first">
        <div class="charts">
          <div style="height:400px; width:1100px; margin:0 auto; transform: translateY(10px)">
            <chart :options="option_money"></chart>
          </div>
        </div>
        <el-alert title="类目分析明细数据" type="info" :closable="false"></el-alert>

        <div class="common-title">
          <div class="ftitle">
            <h3>类目分析明细统计</h3>
            <h5>
              (&nbsp;共
              <span data-total-record="true">{{kind_total_count}}</span>
              条记录&nbsp;)
            </h5>
          </div>
        </div>
        <el-table :data="table_data">
          <el-table-column prop="category_id" align="center" label="分类ID"></el-table-column>
          <el-table-column prop="category_name" align="center" label="分类名称"></el-table-column>
          <el-table-column prop="goods_money" align="center" label="下单金额排行"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="类目下单量排行" name="second">

        <div class="charts">
          <div style="height:400px; width:1100px; margin:0 auto; transform: translateY(10px)">
            <chart :options="option_count"></chart>
          </div>
        </div>
        <el-alert title="类目分析明细数据" type="info" :closable="false"></el-alert>
        <div class="common-title">
          <div class="ftitle">
            <h3>类目分析明细统计</h3>
            <h5>
              (&nbsp;共
              <span data-total-record="true">{{kind_total_count}}</span>
              条记录&nbsp;)
            </h5>
          </div>
        </div>
        <el-table :data="table_data">
          <el-table-column prop="category_id" align="center" label="分类ID"></el-table-column>
          <el-table-column prop="category_name" align="center" label="分类名称"></el-table-column>
          <el-table-column prop="goods_order_count" align="center" label="下单量排行"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="类目下单商品数" name="third">
        <div class="charts">
          <div style="height:400px; width:1100px; margin:0 auto; transform: translateY(10px)">
            <chart :options="option_order_count"></chart>
          </div>
        </div>
        <el-alert title="类目分析明细数据" type="info" :closable="false"></el-alert>

        <div class="common-title">
          <div class="ftitle">
            <h3>类目分析明细统计</h3>
            <h5>
              (&nbsp;共
              <span data-total-record="true">{{kind_total_count}}</span>
              条记录&nbsp;)
            </h5>
          </div>
        </div>
        <el-table :data="table_data">
          <el-table-column prop="category_id" align="center" label="分类ID"></el-table-column>
          <el-table-column prop="category_name" align="center" label="分类名称"></el-table-column>
          <el-table-column prop="goods_order_count" align="center" label="下单商品数排行"></el-table-column>
        </el-table>
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
  name: 'kindAnalyze',
  data () {
    return {
      kindTime: [],
      table_data: [],
      goods_category: [],
      category_list: [],
      props: {
        label: 'category_name',
        value: 'category_id',
        children: 'children'
      },
      params: {
        start_date: '',
        end_date: '',
        category_id: ''
      },
      checkedDay: 0,
      order_countData: [],
      countData: [],
      moneyData: [],
      activeName2: 'first',
      pickData: '',
      kind_total_count: 0,

      option_money: {
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        xAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.01],
            data: []
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        series: [
          {
            name: '金额',
            type: 'bar',
            data: []
          }
        ]
      },
      option_count: {
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        xAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.01]
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        series: [
          {
            name: '金额',
            type: 'bar',
            data: []
          }
        ]
      },
      option_order_count: {
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        xAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.01]
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        series: [
          {
            name: '金额',
            type: 'bar',
            data: []
          }
        ]
      }
    }
  },
  created () {
    this.commodity_category()
    this.getcategory()
  },
  methods: {
    //  类目分析下单金额排行
    async commodity_category (params) {
      const {err, data} = await this.$service.report.commodity_category(params)
      if (err) return
      this.order_countData = []
      this.countData = []
      this.moneyData = []
      this.category_names = []
      if (data.result && data.result.length > 0) {
        this.table_data = data.result
        data.result.forEach(item => {
          const {category_name, category_id, goods_count, goods_money, goods_order_count} = item
          this.category_names.push(category_name)
          this.order_countData.push(goods_order_count)
          this.countData.push(goods_count)
          this.moneyData.push(goods_money)
        })
        this.kind_total_count = data.result.length
        this.option_money.yAxis[0].data = this.category_names
        this.option_count.yAxis[0].data = this.category_names
        this.option_order_count.yAxis[0].data = this.category_names

        this.option_money.series[0].data = this.moneyData
        this.option_count.series[0].data = this.countData
        this.option_order_count.series[0].data = this.order_countData
      }
    },
    // 获取分类
    async getcategory () {
      const {err, data} = await this.$service.goods.goods_common_api.category()
      if (err) return
      this.category_list = data.result
    },
    // 获取格式化时间
    getDay (day) {
      let date = new Date()
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000 * day)
      const m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return date.getFullYear() + '-' + m + '-' + d
    },
    // 最近日期改变
    groupChange (val) {
      this.params.start_date = this.getDay(val)
      this.params.end_date = this.getDay(0)
      Vue.set(this.$refs.change1.value, 0, this.getDay(val))
      Vue.set(this.$refs.change1.value, 1, this.getDay(0))
    },
    // 日期改变
    dateChange (val) {
      this.params.start_date = val[0]
      this.params.end_date = val[1]
      this.checkedDay = ''
    },
    // 检索分类数据
    searchKindDate () {
      this.params.category_id = this.goods_category[this.goods_category.length - 1]
      this.commodity_category(this.params)
    }
  }
}
</script>
<style scoped>
  @import "./commodity.css";
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

  .page-box {
    background: #fff;
    height: 60px;
    line-height: 60px;
    padding-top: 20px;
  }

  .text-align {
    text-align: center;
  }
</style>
