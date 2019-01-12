<template>
  <div class="header">
   <el-collapse v-model="activeName" accordion>
     <span class="el-coll-name">展开/收起</span>
      <el-collapse-item>
        <div class="el-dropdown-bottom">
          <h3>时间段 ></h3>
          <ul class="borul">
            <li>今日</li>
            <li class="selected">最近7天</li>
            <li>最近30天</li>
            <div class="block">
              <span class="demonstration">自定义 :</span>
              <el-date-picker v-model="value6"
                              unlink-panels="true"
                              type="datetimerange" size="mini" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00']">
              </el-date-picker>
            </div>
          </ul>
        </div>
        <!-- <p class="dashed"></p> -->
        <div class="el-dropdown-warp-centre line">
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
    <div class="table-pager">
      <div class="table_warp-warp">
        <div class="table_warp">
          <el-table :data="tableData" border style="float:left;" align="center">
            <el-table-column prop="date" label="订单编号"  align="center"> </el-table-column>
            <el-table-column prop="name" label="交易状态"  align="center"> </el-table-column>
            <el-table-column prop="name" label="配送方式"  align="center"> </el-table-column>
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
    <div class="option-right">
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
      dynamicTags: ['支付宝', '商家配送', '已发货', '最近7天'],
      inputVisible: false,
      option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'left',
          y: 'center',
          width: 100,
          data: ['提现金额', '剩余金额']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: [
              '2018-2-6',
              '2018-2-7',
              '2018-2-8',
              '2018-2-9',
              '2018-2-10',
              '2018-2-11',
              '2018-2-12'
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
            name: '提现金额',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: '平均值' }]
            }
          },
          {
            name: '剩余金额',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6],
            markPoint: {
              data: [
                {
                  name: '年最高',
                  value: 182.2,
                  xAxis: 7,
                  yAxis: 183,
                  symbolSize: 18
                },
                { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: '平均值' }]
            }
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
      ]
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
  padding: 4px;
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

.el-dropdown-warp-centre {
  padding-bottom: 5px;
  margin-left: 87px;
  margin-top: 25px;
}

.goodsH3 {
  margin: 1px;
  padding-left: 3px;
}

.el-dropdown-bottom {
  height: 35px;
  padding-left: 10px;
  padding-top: 20px;
  padding-bottom: 10px;
  border-top: 1px dashed #ebeef5;
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

/* *******************************************  */

.table_warp-warp {
  float: left;
  width: 100%;
}

.table-pager {
  width: 100%;
  background: #fff;
  padding-top: 30px;
  height: 465px;
  margin-bottom: 5px;
}

.option-right {
  width: 100%;
  background: #fff;
}

.echarts {
  width: 100%;
}
</style>
