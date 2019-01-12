<template>
  <div class="header">
   <el-collapse v-model="activeName" accordion>
      <!-- <span class="el-coll-name">展开/收起</span> -->
      <el-collapse-item name="1">
        <template slot="title"><span style="float:right;margin-right:10px;user-select:none">{{activeName == 1 ? '收起' : '展开'}}</span></template>
        <div class="el-dropdown-warp">
          <h3>筛选项 ></h3>
          <el-dropdown>支付方式 : </el-dropdown>
          <el-dropdown>全部</el-dropdown>
          <el-dropdown>微信</el-dropdown>
          <el-dropdown class="checked">支付宝</el-dropdown>
          <el-dropdown>货到付款</el-dropdown>
          <el-dropdown>银联</el-dropdown>
        </div>
        <div class="el-dropdown-warp-small">
          <el-dropdown>配送方式 : </el-dropdown>
          <el-dropdown>全部</el-dropdown>
          <el-dropdown>冷链物流</el-dropdown>
          <el-dropdown class="checked">商家配送</el-dropdown>
          <el-dropdown>自提</el-dropdown>
        </div>
        <div class="el-dropdown-warp-small">
          <el-dropdown>交易状态 : </el-dropdown>
          <el-dropdown>全部</el-dropdown>
          <el-dropdown>待付款</el-dropdown>
          <el-dropdown>待发货</el-dropdown>
          <el-dropdown>已发货</el-dropdown>
          <el-dropdown class="checked">已收货</el-dropdown>
          <el-dropdown>已关闭</el-dropdown>
        </div>
        <div class="el-dropdown-warp-centre">
          <div class="commodity">
            <h3 class="goodsH3">商品名称 :</h3>
            <el-input v-model="input" placeholder="请输入订单编号" size="mini"></el-input>
          </div>
          <div class="commodity">
            <h3 class="goodsH3">购买人 :</h3>
            <el-input v-model="input" placeholder="请输入购买人" size="mini"></el-input>
          </div>
          <div class="commodity">
            <h3 class="goodsH3">手机号 :</h3>
            <el-input v-model="input" placeholder="请输入手机号" size="mini"></el-input>
          </div>
        </div>
        <div class="el-dropdown-bottom">
          <h3>时间段 ></h3>
          <ul class="borul">
            <li>今日</li>
            <li class="selected">最近7天</li>
            <li>最近30天</li>
            <div class="block">
              <span class="demonstration">自定义 :</span>
              <el-date-picker
                unlink-panels="true"
                v-model="value6" type="datetimerange" size="mini" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00']">
              </el-date-picker>
            </div>
          </ul>
        </div>
        <div class="el-dropdown-warp-label line" style="padding:25px 0px 0px 87px">
          <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
              {{tag}}
          </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm">
          </el-input>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="official-warp">
      <div class="official">
        <ul>
          <li><span>全部订单</span><strong>10</strong></li>
          <li><span>待付款订单</span><strong>10</strong></li>
          <li><span>待发货订单</span><strong>10</strong></li>
          <li><span>已发货订单</span><strong>10</strong></li>
          <li><span>已收货订单</span><strong>10</strong></li>
          <li><span>已关闭订单</span><strong>10</strong></li>
          <li><span>订单价</span><strong>120</strong></li>
          <li><span>客单价</span><strong>120</strong></li>
        </ul>
      </div>
    </div>
    <div class="table-pager">
      <div class="table_warp-warp">
        <div class="table_warp">
          <el-table :data="tableData" border style="float:left;" align="center">
            <el-table-column prop="date" label="订单编号" align="center"> </el-table-column>
            <el-table-column prop="name" label="交易状态" align="center"> </el-table-column>
            <el-table-column prop="name" label="配送方式" align="center"> </el-table-column>
            <el-table-column prop="name" label="销售金额" align="center"> </el-table-column>
            <el-table-column prop="name" label="购买人" align="center"> </el-table-column>
            <el-table-column prop="name" label="手机号" align="center"> </el-table-column>
            <el-table-column prop="address" label="支付方式" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="block" style="float:left;width:100%;">
            <el-pagination layout="prev, pager, next" :total="1000" style="width:100%;float:left;text-align:center;padding-top:10px;"> </el-pagination>
        </div>
      </div>
    </div>
    <div class="cartogram">
      <div class="option-right">
        <el-row>
          <chart :options="option"></chart>
        </el-row>
      </div>
      <div class="cartogram-and">
        <div class="cartogram-left">
          <el-row>
            <chart :options="optioni"></chart>
          </el-row>
        </div>
        <div class="cartogram-right">
          <el-row>
            <chart :options="optionl"></chart>
          </el-row>
        </div>
      </div>
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
      activeName: '',
      dynamicTags: ['支付宝', '商家配送', '已发货', '最近7天'],
      option: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 70,
          y: 120,
          x2: 55,
          y2: 20,
          white: 490,
          height: 350
        },
        legend: {
          top: 50,
          textStyle: { color: '#333' },
          data: [
            '全部订单',
            '待付款订单',
            '待发货订单',
            '待收货订单',
            '已收货订单',
            '已关闭订单',
            '客单价',
            '订单价'
          ]
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [
              '2018-1-1',
              '2018-1-2',
              '2018-1-3',
              '2018-1-4',
              '2018-1-5',
              '2018-1-6',
              '2018-1-7'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '全部订单',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '待付款订单',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '待发货订单',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '待收货订单',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '已收货订单',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          },
          {
            name: '已关闭订单',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          },
          {
            name: '客单价',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1110, 1220]
          },
          {
            name: '订单价',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      },
      tableData: [
        {
          date: '16523564256564',
          name: '已发货',
          address: '商家配送',
          a: '2000'
        },
        {
          date: '16523564256564',
          name: '已发货',
          address: '商家配送'
        },
        {
          date: '16523564256564',
          name: '已发货',
          address: '商家配送'
        },
        {
          date: '16523564256564',
          name: '已发货',
          address: '商家配送'
        },
        {
          date: '16523564256564',
          name: '已发货',
          address: '商家配送'
        },
        {
          date: '16523564256564',
          name: '已发货',
          address: '商家配送'
        },
        {
          date: '16523564256564',
          name: '已发货',
          address: '商家配送'
        }
      ],
      optioni: {
        title: {
          text: '支付方式统计',
          x: 'left',
          padding: 15,
          textStyle: {
            color: '#6a6a6a',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 15,
            fontFamily: 'sans-serif'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          padding: 15,
          x: 'right',
          width: 100,
          textStyle: { color: '#333' },
          data: ['货到付款', '支付宝', '微信']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: '',
            type: 'pie',
            radius: '75%',
            center: ['50%', '50%'],
            data: [
              { value: 920, name: '支付宝' },
              { value: 900, name: '微信' },
              { value: 900, name: '货到付款' }
            ],
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ['#91dae8', '#8ec334', '#ff9a62']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      },
      optionl: {
        title: {
          text: '配送方式统计',
          x: 'left',
          padding: 15,
          textStyle: {
            color: '#6a6a6a',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 15,
            fontFamily: 'sans-serif'
          }
        },
        grid: {
          height: 273
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'right',
          width: 100,
          padding: 15,
          textStyle: { color: '#333' },
          data: ['冷链物流', '商家配送', '自提']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: '',
            type: 'pie',
            radius: '75%',
            center: ['50%', '50%'],
            data: [
              { value: 1220, name: '冷链物流' },
              { value: 900, name: '商家配送' },
              { value: 310, name: '自提' }
            ],
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ['#6d7ebd', '#e9d757', '#e26c6b']
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.el-collapse {
  margin-bottom: 5px;
}

.el-coll-name {
  color: #888;
  float: right;
  line-height: 48px;
  margin-right: 20px;
  text-align: center;
}

.el-dropdown-warp {
  padding: 7.5px;
  padding-left: 10px;
  border-bottom: 1px dashed #ebeef5;
}

.el-dropdown {
  padding-left: 10px;
  padding-right: 20px;
}

.el-dropdown:hover {
  cursor: pointer;
}

.checked {
  color: #409eff;
}

.selected {
  color: #fff !important;
  background: #409eff !important;
}

h3,
.demonstration {
  float: left;
  color: #606266;
  font-size: 14px;
  line-height: 25px;
  padding-right: 20px;
}

.header ul li {
  padding-left: 10px;
  padding-right: 20px;
}

.el-icon-span {
  padding-left: 10px;
}

.el-dropdown-warp-small {
  height: 30px;
  margin: 7.5px 10px 7.5px 87px;
  border-bottom: 1px dashed #ebeef5;
}

.el-dropdown-warp-centre {
  margin: 8px 10px 8px 93px;
  height: 30px;
  border-bottom: 1px dashed #ebeef5;
  padding-bottom: 5px;
}

.commodity {
  float: left;
  margin-right: 2%;
}

.el-input {
  width: 200px;
}

.goodsH3 {
  margin: 1px;
  padding-left: 3px;
}

.el-dropdown-bottom {
  height: 35px;
  padding-left: 10px;
  border-bottom: 1px dashed #ebeef5;
}

.dashed {
  height: 5px;
  margin: 0 10px 0 10px;
  border-bottom: 1px dashed #c0c4cc;
}

.borul li {
  color: #606266;
  font-size: 14px;
  width: 80px;
  line-height: 28px;
  float: left;
  background: #e4e4e4;
  border-radius: 5px;
  text-align: center;
  margin-right: 25px;
}

.borul li:hover {
  cursor: pointer;
}

.el-tag {
  background: #fff;
  margin-right: 30px;
}

/* *************************************  */
.official-warp {
  color: #606266;
  margin-bottom: 5px;
}

.official {
  width: 100%;
  height: 95px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}

@media (max-width: 1840px) {
  .official ul li {
    width: 8.8% !important;
  }
}

@media (max-width: 1660px) {
  .official ul li {
    width: 8.55% !important;
  }
}

@media (max-width: 1520px) {
  .official ul li {
    width: 8.3% !important;
  }
}

@media (max-width: 1365px) {
  .official ul li {
    width: 8.1% !important;
  }
}

@media (max-width: 1300px) {
  .official ul li {
    width: 7.8% !important;
  }
}

.official ul li {
  height: 65px;
  border: 1px dashed #e4e4e4;
  float: left;
  margin-top: 14.5px;
  width: 9.15%;
  margin-left: 1.226%;
}

.official ul li span {
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 25px;
  line-height: 35px;
}

strong {
  width: 100%;
  color: #1c8fef;
  font-size: 28px;
  font-weight: 600;
  display: inline-block;
  text-align: center;
}

/* *******************************************  */
.table_warp-warp {
  width: 100%;
  float: left;
}

.table-pager {
  width: 100%;
  background: #fff;
  padding-top: 30px;
  height: 465px;
  margin-bottom: 5px;
}

.el-table-column {
  border: 1px solid #c0c4cc !important;
}

.cartogram-and .echarts {
  width: 100%;
  height: 273px;
}

.echarts {
  width: 100%;
  height: 545px;
}

.cartogram {
  width: 100%;
  height: 545px;
  clear: both;
}

.option-right {
  width: 49.69%;
  background: #fff;
  float: left;
}
.cartogram-and {
  width: 50%;
  float: left;
  height: 546px;
}

.cartogram-left {
  height: 50%;
  width: 100%;
  margin-bottom: 5px;
  background: #fff;
}

.cartogram-right {
  height: 48.9%;
  width: 100%;
  background: #fff;
}
</style>
