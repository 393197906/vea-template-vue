<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>活跃用户</span>
      </div>
      <el-row>
        <el-col :span="8" style="border-right:1px solid #ddd">
          <div class="grid-content">
            <div class="amount">
              {{ data.user_activation_count }}
            </div>
            <div>
              累计用户
              <el-tooltip class="item" content="累计用户：店铺累计用户数。" placement="right" effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="8" style="border-right:1px solid #ddd">
          <div class="grid-content">
            <div class="amount">
              {{ data.today_user_activation_count }}
            </div>
            <div>
              今日活跃
              <el-tooltip class="item" content="今日活跃：店铺今天的活跃用户数。" placement="right" effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="amount">
              {{ data.days_user_activation_count }}
            </div>
            <div>
              近30日活跃
              <el-tooltip class="item" content="近30日活跃：店铺30天内的活跃用户数。" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span>日活跃趋势图</span>
      </div>
      <el-row>
        <el-col :span="8" style="border-right:1px solid #ddd">
          <div class="grid-content">
            <div class="amount">
              {{ data.yesterday_user_activation_count }}
            </div>
            <div>
              昨日
              <el-tooltip class="item" content="昨日：昨日店铺活跃数。" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="8" style="border-right:1px solid #ddd">
          <div class="grid-content">
            <div class="amount">
              {{ data.yesterday_this_time_user_activation_count }}
            </div>
            <div>
              昨日此时
              <el-tooltip class="item" content="昨日此时：昨日此时店铺活跃数。" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <div class="amount">
              {{ data.today_user_activation_count }}
            </div>
            <div>
              今日
              <el-tooltip class="item" content="今日：今日店铺活跃数。" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <div id="dayEchart" style="width: 100%;height: 400px;"></div>
        <!--<chart :options="option" style="width: 100%;"></chart>-->
      </el-row>
    </el-card>
    <el-card class="box-card" style="margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span>月活跃趋势图</span>
        <el-button type="primary" size="mini" style="float:right;margin-right:15px" @click="table_model = !table_model">
          {{table_model ? '图形模式' : '表格模式'}}
        </el-button>
      </div>
      <el-row>
        <el-col :span="12" style="border-right:1px solid #ddd">
          <div class="grid-content">
            <div class="amount">
              {{ data.month_data }}
            </div>
            <div>
              合计
              <el-tooltip class="item" content="合计：合计过去一月店铺活跃数。" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <div class="amount">
              {{ data.today_avg }}
            </div>
            <div>
              日均
              <el-tooltip class="item" content="日均：日均店铺活跃数。" placement="right"
                          effect="light">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="!table_model">
        <chart :options="option1" style="width: 100%;"></chart>
      </el-row>
      <el-row v-else>
        <div class="table_container">
          <el-table :data="tableData" style="margin-top: 30px;"
                    border
          >
            <el-table-column
              prop="date"
              label="日期"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="count"
              label="活跃用户"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>

      </el-row>
    </el-card>
  </div>
</template>
<script>
import chart from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

export default {
  data () {
    return {
      day: '',
      tableData: [],
      day_yData: [],
      month_xData: [],
      month_yData: [],
      data: {},
      table_model: false,
      option: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['00:00',
              '01:00',
              '02:00',
              '03:00',
              '04:00',
              '05:00',
              '06:00',
              '07:00',
              '08:00',
              '09:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '19:00',
              '20:00',
              '21:00',
              '22:00',
              '23:00']
          }
        ],
        yAxis: [
          {
            name: '活跃用户',
            type: 'value',
            minInterval: 1
          }
        ],
        series: []
      },
      option1: {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let dt = new Date()
            var relVal = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + params[0].name + '<br/>'
            relVal += params[0].seriesName + ' : ' + params[0].value + '<br/>'
            return relVal
          }
        },
        xAxis: [],
        yAxis: [
          {
            type: 'value',
            name: '活跃用户',
            minInterval: 1
          }
        ],
        series: []
      },
      dayEchart: {}
    }
  },
  components: {chart},
  created () {
    this.day = new Date().getDate()
    let dt = new Date()
    for (let i = 1; i <= this.day; i++) {
      this.month_xData.push(i)
      this.month_yData.push(0)
    }
    for (let j = 0; j < 24; j++) {
      this.day_yData.push(0)
    }
    this.option1.xAxis = [{
      type: 'category',
      boundaryGap: false,
      name: '日期',
      data: this.month_xData || []
    }]
    this.getData()
  },
  methods: {
    // 获取数据
    async getData () {
      const {err, data} = await this.$service.report.active()
      if (err) return
      this.data = data.result || ''
      data.result.this_month_data.forEach(item => {
        const day = parseInt(item.shijian.split('-')[2])
        if (this.month_xData.includes(day)) {
          this.month_yData[day - 1] = item.data_conunt
        }
      })
      data.result.today_user_activation_count_24.forEach(item => {
        const hour = parseInt(item.shijian.split(' ')[1])
        this.day_yData[hour] = item.data_conunt
      })
      this.option.series = [
        {
          name: '活跃用户',
          type: 'line',
          stack: '',
          data: this.day_yData
        }
      ]
      this.dayEchart = this.$echarts.init(document.getElementById('dayEchart'))
      this.dayEchart.setOption(this.option)
      let dt = new Date()
      this.month_xData.forEach((item, index) => {
        this.tableData.push({
          count: this.month_yData[index],
          date: `${dt.getFullYear()}-${dt.getMonth() + 1}-${index + 1}`
        })
      })
      this.option1.series = [
        {
          name: '活跃用户',
          type: 'line',
          stack: '',
          data: this.month_yData || []
        }
      ]
    }
  }
}
</script>
<style scoped>
  .item {
    color: #8c939d;
  }

  .grid-content {
    text-align: center;
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
</style>
