<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="商品概况">
        <div class="toptime">
          <div class="block">
            <span>时间： </span>
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
        </div>
        <div class="matrix">
          <ul>
            <li>
              <div class="matrix-name">商品发布</div>
              <div class="matrix-block">
                <p class="name">上架商品数</p>
                <p class="count" id="onsale">{{todayData.goods_up_shelf_count}}</p>
              </div>
              <div class="matrix-block">
                <p class="name">下架商品数</p>
                <p class="count" id="offsale">{{todayData.goods_drop_shelf_count}}</p>
              </div>
              <div class="matrix-block">
                <p class="name">销售过多少个商品</p>
                <p class="count" id="waitaudit">{{todayData.goods_number_sum_no_cancel}}</p>
              </div>
            </li>
          </ul>
        </div>
        <el-alert title="商品销售趋势 （前30天数据）" type="info" :closable="false"></el-alert>
        <div class="charts">
          <div style="height:400px; width:1100px; margin:0 auto; transform: translateY(10px)">
            <chart :options="option"></chart>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品销量排行">
        <div class="explanation_warp">
          <el-collapse accordion v-model="accordion">
            <div class="explanation">
              <el-collapse-item name="1">
                <template slot="title">
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
              </el-collapse-item>
            </div>
          </el-collapse>
        </div>

        <div class="toptime">
          <div class="ipt">
            <span>关键词：</span>
            <el-input placeholder="商品名称" size="small" v-model="rankParams.goods_name"></el-input>
          </div>
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
          <el-button type="primary" size="small" @click="searchRankDate">搜索</el-button>
          <!--<el-button size="small">导出</el-button>-->
        </div>
        <div class="common-title">
          <div class="ftitle">
            <h3>商品销售排行</h3>
            <h5>
              (&nbsp;共
              <span data-total-record="true">{{rankTotal_count}}</span>
              条记录&nbsp;)
            </h5>
          </div>
        </div>
        <!-- 列表 -->
        <el-table :data="tableData">
          <el-table-column sortable prop="goods_id" align="center" label="编号"></el-table-column>
          <el-table-column prop="goods_name" align="center" label="商品名称"></el-table-column>
          <el-table-column sortable prop="goods_num" align="center" label="销售数量"></el-table-column>
          <el-table-column sortable prop="goods_money" align="center" label="销售额（元）"></el-table-column>
          <el-table-column sortable prop="goods_customer_price" align="center" label="平均单价"></el-table-column>
        </el-table>
        <!--  分页  -->
        <div class="page-box">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="rankParams.page"
            background
            :page-size="rankParams.pre_page"
            layout="prev, pager, next"
            :total="rankTotal_count">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="类目分析">
        <kindAnalyze></kindAnalyze>
        <!--<el-alert title="明细数据" type="info" :closable="false"></el-alert>-->
        <!--<div class="common-title">
          <div class="ftitle">
            <h3>行业分析明细统计</h3>
            <h5>
              (&nbsp;共
              <span data-total-record="true">16</span>
              条记录&nbsp;)
            </h5>
          </div>
        </div>-->
      </el-tab-pane>
      <!--<el-tab-pane label="访问购买率">-->
      <!--<div class="explanation m-b-10">-->
      <!--<div class="title explain-checkZoom" title="">-->
      <!--<i class="fa fa-bullhorn"></i>-->
      <!--<h4>温馨提示</h4>-->
      <!--</div>-->
      <!--<ul class="explain-panel">-->
      <!--<li>-->
      <!--<span>销售数量：统计非交易关闭的线上、线下订单中的商品总数量，包含的订单有普通订单、自由购订单、堂内点餐订单、线下订单、提货券订单。比如一笔订单中A商品购买两件，那销售数量即是2，销售额是销售数量*当时购买A商品的单价</span>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</div>-->
      <!--<div class="toptime">-->
      <!--<div class="ipt">-->
      <!--<span>关键词： </span>-->
      <!--<el-input placeholder="请输入内容" size="small"></el-input>-->
      <!--</div>-->
      <!--<div class="coding">-->
      <!--<span>商品分类: </span>-->
      <!--<el-input placeholder="请输入内容" size="small" clearable></el-input>-->
      <!--</div>-->
      <!--<button type="button" class="el-button el-button&#45;&#45;primary el-button&#45;&#45;small">-->
      <!--<i class="el-icon-search"></i>-->
      <!--<span>搜索</span>-->
      <!--</button>-->
      <!--</div>-->
      <!--<div class="common-title">-->
      <!--<div class="ftitle">-->
      <!--<h3>访问购买率</h3>-->
      <!--<h5>-->
      <!--(&nbsp;共-->
      <!--<span data-total-record="true">12</span>-->
      <!--条记录&nbsp;)-->
      <!--</h5>-->
      <!--</div>-->
      <!--</div>-->
      <!--<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">-->
      <!--<el-table-column prop="date" label="编号" align="center" sortable width="180">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="address" label="商品名称" :formatter="formatter">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="name" label="销售数量" sortable width="180">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="name" label="销售额（元）" sortable width="180">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="name" label="均价（元）" sortable width="180">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="address" label="地址" :formatter="formatter">-->
      <!--</el-table-column>-->
      <!--</el-table>-->
      <!--<el-pagination background layout="prev, pager, next" :total="1000">-->
      <!--</el-pagination>-->
      <!--</el-tab-pane>-->
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
import kindAnalyze from '@/page/profile/kindAnalyze'

Vue.component('chart', ECharts)
export default {
  components: {
    kindAnalyze
  },
  data () {
    return {
      block: '1',
      accordion: '1',
      checkedDay: 0,
      analyTime: [],
      goods_category: [],
      category_list: [],
      radio: '今天',
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [
            '支付数',
            '下单数'
          ],
          padding: [
            20, // 上
            0, // 右
            0, // 下
            0 // 左
          ]
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
        color: ['#ffd85c', '#37a2da'],
        calculable: true,
        xAxis: [
          {
            name: '日期',
            type: 'category',
            boundaryGap: false,
            data: []
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
            name: '支付数',
            type: 'line',
            data: []
          },
          {
            name: '下单数',
            type: 'line',
            data: []
          }
        ]
      },
      tableData: [{}],
      todayData: {}, //  今天
      payment: [], //  支付数
      singular: [],
      props: {
        label: 'category_name',
        value: 'category_id',
        children: 'children'
      }, //  下单数
      params: {
        start_date: '',
        end_date: ''
      },
      rankParams: {
        page: 1,
        pre_page: 10,
        goods_name: '',
        category_id: '',
        orderby_type: ''
      },
      rankTotal_count: 0
    }
  },
  created () {
    this.getcategory()
    const init_params = {
      start_date: this.getDay(0),
      end_date: this.getDay(0)
    }
    this.getData(init_params)
    this.tendency({
      start_date: this.getDay(30),
      end_date: this.getDay(0)
    })
    this.salesData(this.rankParams)
  },
  methods: {
    // 商品概况搜索
    searchDate () {
      this.getData(this.params)
    },
    // 商品销售排行搜索
    searchRankDate () {
      this.rankParams.page = 1
      this.rankParams.category_id = this.goods_category[this.goods_category.length - 1]
      this.salesData(this.rankParams)
    },
    // 商品概况数据获取
    async getData (params) {
      const {err, data} = await this.$service.report.commodity_list(params)
      if (err) return
      if (params.day && params.day === 1) {
        this.yesterdayData = data.result
      } else {
        this.todayData = data.result
      }
    },
    // 商品概况日期改变
    dateChange (val) {
      this.params.start_date = val[0]
      this.params.end_date = val[1]
      this.checkedDay = ''
    },
    // 商品概况最近日期改变
    groupChange (val) {
      this.params.start_date = this.getDay(val)
      this.params.end_date = this.getDay(0)
      Vue.set(this.$refs.change1.value, 0, this.getDay(val))
      Vue.set(this.$refs.change1.value, 1, this.getDay(0))
    },
    // 获取格式化时间
    getDay (day) {
      let date = new Date()
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000 * day)
      const m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return date.getFullYear() + '-' + m + '-' + d
    },

    // 商品销售趋势图
    async tendency (params) {
      const {err, data} = await this.$service.report.commodity_trend(params)
      if (err) return
      this.option.xAxis[0].data = Object.keys(data.result).sort()
      const tendency_val = Object.values(data.result).reverse()
      tendency_val.forEach((item, i) => {
        this.singular.push(item.order_count)
        this.payment.push(item.order_paid_count)
      })
      this.option.series[0].data = this.payment
      this.option.series[1].data = this.singular
    },

    //  商品销量排行
    async salesData (params) {
      const {err, data} = await this.$service.report.commodity_sales(params)
      if (err) return
      this.tableData = data.result
      this.rankTotal_count = data.total_count
    },
    // 获取分类
    async getcategory () {
      const {err, data} = await this.$service.goods.goods_common_api.category()
      if (err) return
      this.category_list = data.result
    },
    // 更改页码
    handleCurrentChange (val) {
      this.rankParams.page = val
      this.salesData(this.rankParams)
    },
    showToggle () {
      this.isShow = !this.isShow
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

  .el-table th:hover {
    color: #409EFF;
    border-bottom: 1px solid #409EFF;
  }
</style>
