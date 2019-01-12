<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="会员新增统计">
      <div class="toptime">
        <div class="block">
          <span>时间： </span>
          <el-date-picker
            v-model="analyTime"
            size="small"
            type="daterange"
            unlink-panels="true"
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
        <el-button type="primary" size="small" @click="search">搜索</el-button>
      </div>
      <el-alert title="会员新增统计" type="success" :closable="false">&nbsp;</el-alert>

      <el-row
        style="width:100%; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
        <el-col :span="8" style="height:100px; border-right:1px solid #eee; text-align: center">
          <div class="grid-content bg-purple">
            <dl>
              <dt style="font-size:14px; line-height:14px; color:#666; margin-top:20px;">统计新增会员的数量</dt>
              <dt style="font-size:28px; color: #f60; font-weight:500; line-height:28px; margin-top:10px;">
                {{user_list.new_shop_member_count}}
              </dt>
            </dl>
          </div>
        </el-col>
        <el-col :span="8" style="height:100px; border-right:1px solid #eee; text-align: center">
          <div class="grid-content bg-purple">
            <dl>
              <dt style="font-size:14px; line-height:14px; color:#666; margin-top:20px;">成交会员数</dt>
              <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:10px;">
                {{user_list.order_user_count_success_finish}}
              </dt>
            </dl>
          </div>
        </el-col>
        <el-col :span="8" style="height:100px; text-align: center">
          <div class="grid-content bg-purple">
            <dl>
              <dt style="font-size:14px; line-height:14px; color:#666; margin-top:20px;">未成交会员数</dt>
              <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:10px;">
                {{user_list.order_user_count_close_finish}}
              </dt>
            </dl>
          </div>
        </el-col>
      </el-row>

      <el-row
        style="width:100%;border-bottom: 1px solid #eee;">
        <el-col :span="8" style="height:100px; border-right:1px solid #eee; text-align: center">
          <div class="grid-content bg-purple">
            <dl>
              <dt style="font-size:14px; line-height:14px; color:#666; margin-top:20px;">收藏过本店铺或者本店商品的客户数</dt>
              <!--<dt style="font-size:16px; color:#666; line-height:16px;"></dt>-->
              <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:10px;">
                {{user_list.collection_user_count}}
              </dt>
            </dl>
          </div>
        </el-col>
        <el-col :span="8" style="height:100px; border-right:1px solid #eee; text-align: center">
          <div class="grid-content bg-purple">
            <dl>
              <dt style="font-size:14px; color:#666; line-height:14px; margin-top:20px;">关注本店铺的会员数</dt>
              <dt style="font-size:28px; color:#f60; font-weight:500; line-height:28px; margin-top:10px;">
                {{user_list.shop_attention_count}}
              </dt>
            </dl>
          </div>
        </el-col>
        <el-col :span="8" style="height:100px; text-align: center">

        </el-col>
      </el-row>

      <div style="height:400px; width:1100px; margin:0 auto; transform: translateY(10px)"
           v-loading="!formatData.length">
        <chart :options="options"/>
      </div>
    </el-tab-pane>
      <el-tab-pane label="会员消费排行">
        <div class="toptime">
          <div class="block">
            <span>时间：</span>
            <el-date-picker size="small" v-model="date1" type="daterange"
                            unlink-panels="true"
                            value-format="yyyy-MM-dd"
                            start-placeholder="请选择开始日期" end-placeholder="请选择结束日期"/>
          </div>
          <!--<div class="coding">-->
          <!--<span>会员等级：</span>-->
          <!--<el-select v-model="commodity" clearable size="small" placeholder="&#45;&#45;请选择分类&#45;&#45;">-->
          <!--<el-option-->
          <!--v-for="item in commodity_select"-->
          <!--:key="item.value"-->
          <!--:label="item.label"-->
          <!--:value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</div>-->
          <button type="button" class="el-button el-button--primary el-button--small" @click="listSearch">
            <i class="el-icon-search"></i>
            <span>搜索</span>
          </button>
        </div>
        <div class="common-title">
          <div class="ftitle">
            <h3>商品销售排行</h3>
            <h5>
              (&nbsp;共
              <span data-total-record="true">{{total_count}}</span>
              条记录&nbsp;)
            </h5>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="iphone" align="center" label="手机号码">
          </el-table-column>
          <el-table-column prop="user" label="会员信息" width="380" align="center">
            <template slot-scope="scope">
              <div class="pull-left">
                <img :src="scope.row.avatar" class="user-avatar" width="60" height="60"/>
              </div>
              <div class="ng-binding user-message w250">
                <p class="name">
                  {{scope.row.user_name}}
                  <i class="el-icon-date"></i>
                </p>
                <span class="mail">
                  <i class="fa fa-envelope-o"></i>
                  ：{{scope.row.email}}
                </span>
                <br/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="valid" label="有效订单数">
          </el-table-column>
          <el-table-column prop="disable" label="有效订单金额（元）">
          </el-table-column>
          <el-table-column prop="grade" label="无效订单数">
          </el-table-column>
        </el-table>

        <el-pagination
          background
          :page-size="pre_page"
          :page="page"
          layout="prev, pager, next"
          :total="total_count"
          @current-change="pageChange">
        </el-pagination>
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
      page: 1,
      pre_page: 10,
      total_count: 1,
      commodity: '',
      date1: [],
      checkedDay: 0,
      radio: '今天',
      analyTime: [],
      user_list: [],
      tableData: [],
      tableData1: [],
      newUser: [], // 新增会员统计
      orderUser: [], // 成交会员
      countUser: [], //  未成交会员
      collection: [], // 收藏本店铺
      attentionCount: [], // 关注本店铺的
      formatData: [] // 日期数组
    }
  },
  created () {
    this.userList()
    this.userTrend()
    this.userRank()
  },
  computed: {
    options () {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ['#ff7f50', '#87cefa', '#32cd32', '#ff69b4', '#6a99ee' ],
        legend: {
          data: ['新增会员', '成交会员', '未成交会员', '收藏过本店铺', '关注本店铺的会员'],
          padding: [20, 0, 0, 0]
        },
        grid: {
          left: '3%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            name: '日期',
            type: 'category',
            data: this.formatData
          }
        ],
        yAxis:
            [
              {
                name: '数量',
                type: 'value'
              }
            ],
        series:
            [
              {
                name: '新增会员',
                type: 'bar',
                data: this.newUser
              },
              {
                name: '成交会员',
                type: 'bar',
                data: this.orderUser
              },
              {
                name: '未成交会员',
                type: 'bar',
                data: this.countUser
              },
              {
                name: '收藏过本店铺',
                type: 'bar',
                data: this.collection
              },
              {
                name: '关注本店铺的会员',
                type: 'bar',
                data: this.attentionCount

              }
            ]
      }
    }
  },
  methods: {
    pageChange (val) {
      this.page = val
      this.userRank()
    },
    // 商品概况最近日期改变
    groupChange (val) {
      this.analyTime[0] = this.getDay(val)
      this.analyTime[1] = this.getDay(0)
      Vue.set(this.$refs.change1.value, 0, this.getDay(val))
      Vue.set(this.$refs.change1.value, 1, this.getDay(0))
    },
    listSearch () {
      this.userRank()
    },
    search () {
      this.userList()
    },
    // 获取格式化时间
    getDay (day) {
      let date = new Date()
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000 * day)
      const m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return date.getFullYear() + '-' + m + '-' + d
    },
    async userList () {
      this.analyTime = this.analyTime || []
      const {err, data} = await this.$service.report.user_analysis(
        {
          start_date: this.analyTime[0] || this.getDay(0),
          end_date: this.analyTime[1] || this.getDay(0)
        }
      )
      if (err) return
      this.user_list = data.result
    },
    async userTrend () {
      const {err, data} = await this.$service.report.user_trend(
        {
          start_date: this.getDay(7),
          end_date: this.getDay(0)
        }
      )
      if (err) return
      const arr = data.result
      this.formatData = Object.keys(arr).sort()
      this.formatData.forEach(item => {
        this.newUser.push(arr[item].new_shop_member_count)
        this.orderUser.push(arr[item].order_user_count_success_finish)
        this.countUser.push(arr[item].order_user_count_close_finish)
        this.collection.push(arr[item].collection_user_count)
        this.attentionCount.push(arr[item].shop_attention_count)
      })
    },
    // 销售排行
    async userRank () {
      this.date1 = this.date1 || []
      const {err, data} = await this.$service.report.user_rank(
        {
          page: this.page,
          pre_page: this.pre_page,
          start_date: this.date1[0] || this.$formatTime(parseInt(Date.now() / 1000), `yyyy-MM-dd`),
          end_date: this.date1[1] || this.$formatTime(parseInt(Date.now() / 1000), `yyyy-MM-dd`)
        }
      )
      if (err) return
      const tableList = data.result
      const showList = tableList.map(item => {
        const {avatar, order_money, email, invalid_order_count, order_count, phone, user_name} = item
        return {
          avatar: avatar,
          email: email,
          iphone: phone,
          user_name: user_name,
          valid: order_count,
          disable: order_money,
          grade: invalid_order_count
        }
      })
      this.tableData = showList
      this.total_count = data.total_count
    }
  }
}
</script>
<style scoped>
  @import "./member.css";
</style>
