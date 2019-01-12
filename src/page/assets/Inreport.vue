<template>
  <div class="header">
   <el-collapse v-model="activeName" accordion>
     <span class="el-coll-name">展开/收起</span>
      <el-collapse-item>
        <div class="el-dropdown-warp">
              <h3>筛选项 ></h3>
              <el-dropdown>商品分类 : </el-dropdown>
              <el-dropdown>全部</el-dropdown>
              <el-dropdown>鸡产品</el-dropdown>
              <el-dropdown class="checked">鸭产品</el-dropdown>
              <el-dropdown>猪产品</el-dropdown>
              <el-dropdown>水产品</el-dropdown>
              <el-dropdown>牛,羊类</el-dropdown>
              <el-dropdown>调理品</el-dropdown>
              <el-dropdown>火锅丸类</el-dropdown>
              <el-dropdown>面点系列</el-dropdown>
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
          <el-table :data="tableData" border style="float:left;" >
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
      inputValue: '',
      option: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          x: 'left',
          y: 'center',
          width: 100
          // data: ["库存数量"]
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        grid: {
          borderWidth: 0,
          y: 80,
          y2: 60
        },
        xAxis: [
          {
            type: 'category',
            show: false,
            data: [
              'Line',
              'Bar',
              'Scatter',
              'K',
              'Pie',
              'Radar',
              'Chord',
              'Force',
              'Map',
              'Gauge',
              'Funnel'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            // name: "库存数量",
            type: 'bar',
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = [
                    '#C1232B',
                    '#B5C334',
                    '#FCCE10',
                    '#E87C25',
                    '#27727B',
                    '#FE8463',
                    '#9BCA63',
                    '#FAD860',
                    '#F3A43B',
                    '#60C0DD',
                    '#D7504B'
                  ]
                  return colorList[params.dataIndex]
                },
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{b}\n{c}'
                }
              }
            },
            data: [12, 21, 10, 4, 12, 5, 6, 5, 25, 23, 7]
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

.el-icon-span {
  padding-left: 10px;
}

.el-dropdown-warp-small {
  margin: 4px 10px 4px 82px;
  border-bottom: 1px dashed #ebeef5;
}

.el-dropdown-warp-centre {
  padding: 8px 10px 8px 87px;
  height: 30px;
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
  padding-left: 4px;
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

/* *******************************************  */
.table_warp-warp {
  float: left;
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
  float: left;
}

.el-table-column {
  border: 1px solid #c0c4cc !important;
}

.echarts {
  width: 100%;
}
</style>
