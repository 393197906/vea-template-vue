<template>
  <div>
    <div class="search-box">
      <div class="searcher">
        <div class="capital-search">
          <span style="float:left;margin-right: 10px;width: 65px;">下单时间:</span>
          <div class="type-class">
            <el-date-picker
              size="small"
              type="daterange"
              unlink-panels="true"
              value-format="yyyy-MM-dd "
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model="capital_time"
              :clearable="false"
              @change="capitalTimeSearch">
            </el-date-picker>
          </div>
        </div>
        <div class="capital-search capital-search-fl">
          <span style="float:left;margin-right: 10px;width: 65px;">订单编号:</span>
          <div class="type-class">
            <el-input v-model="params.order_no" size="small" placeholder="请输入订单编号"/>
          </div>
        </div>
        <div class="capital-search">
          <span style="float:left;margin-right: 10px;width: 65px;">订单重量:</span>
          <div class="type-class">
            <el-input size="small" v-model="params.order_weight_min" style="width:85px;" placeholder="(小)"
                      clearable></el-input>
            ~
            <el-input size="small" v-model="params.order_weight_max" style="width:85px;" placeholder="（大）"
                      clearable></el-input>
          </div>
        </div>
        <!--<div class="capital-search capital-search-fl" style="width: 310px">-->
          <!--<span style="float:left;margin-right: 10px;width: 95px;">负责人手机号:</span>-->
          <!--<div class="type-class">-->
            <!--<el-input v-model="params.phone" size="small" placeholder="请输入负责人手机号"/>-->
          <!--</div>-->
        <!--</div>-->
        <div class="capital-search capital-search-fl">
          <span style="float:left;margin-right: 10px;width: 65px;">配送方式:</span>
          <div class="type-class">
            <el-select size="small" v-model="params.shipping_type" style="width: 185px;" placeholder="请选择活动类型">
              <el-option
                v-for="item in active_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="capital-search"></div>
        <div class="capital-search-btn">
          <el-button size="small" type="primary" icon="el-icon-search" @click="capitalSearch">搜索</el-button>
          <el-button size="small" type="primary" plain icon="el-icon-upload2" @click="exportData">导出</el-button>
          <el-button size="small" type="text" plain @click="emptyFilter(params)">清空筛选条件
          </el-button>
        </div>
      </div>
    </div>
    <el-table :data="tableData" border
              :summary-method="getSummaries"
              show-summary>
      <el-table-column label="序号" type="index" width="50" align="center"/>
      <el-table-column label="日期" align="center">
        <template slot-scope="scope">
          <p>{{formatTime(scope.row.create_time)}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="order_no" label="订单编号" align="center">
        <template slot-scope="scope">
          <span class="order_no" @click="orderDetail(scope.row.order_id)">{{scope.row.order_no}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="order_weight" label="订单重量" align="center"></el-table-column>
      <el-table-column prop="pay_money" label="订单金额" align="center"></el-table-column>
      <el-table-column prop="shipping" label="配送方式" align="center">
      </el-table-column>
      <el-table-column prop="order_weight_ex" label="配送重量" align="center">
      </el-table-column>
      <el-table-column prop="shipping_money" label="配送金额" align="center"></el-table-column>
    </el-table>
    <!--分页start-->
    <div class="page-box">
      <el-pagination
        id="page-box"
        background
        layout="prev, pager, next"
        @size-change="pagingEachPageChange"
        @current-change="pagingEachSizeChange"
        :current-page="params.page"
        :page-size="params.pre_page"
        :total="page_total">
      </el-pagination>
    </div>
    <el-dialog title="订单详情" :visible.sync="orderVisible" width="85%">
      <order-detail :isDialog="true" :com-id="order_id" v-if="orderVisible" style="height: 500px;overflow-y: scroll"></order-detail>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeDetail">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
import {formatTime} from '@/util/util.js'
import orderDetail from '@/page/order/Detail.vue'

export default {
  components: {orderDetail},
  name: 'active-order-info',
  data () {
    return {
      orderVisible: false,
      capital_time: [], // 时间
      tableData: [],
      active_type: [
        {
          label: '物流配送',
          value: '1'
        },
        {
          label: '上门自提',
          value: '2'
        }
      ],
      total_order_money: '',
      total_order_weight: '', // 订单总重量
      total_order_weight_ex: '',
      total_shipping_money: '',
      page_total: 1,
      params: {
        page: 1, //  页数
        pre_page: 10, //  条数
        start_time: '', //  开始时间
        end_time: '', //  结束时间
        order_no: '', //  订单编号
        order_weight_min: '', // 小
        order_weight_max: '', // 大
        shipping_type: '',
        phone: ''
      },
      now_active_name: []
    }
  },
  created () {
    this.getCapitalWaters()
    this.height = window.innerHeight - 357 + 'px'
  },
  methods: {
    formatTime: formatTime,
    // 清空筛选条件
    emptyFilter (val) {
      this.capital_time = []
      this.params.start_time = ''
      this.params.end_time = ''
      this.params.order_no = ''
      this.params.order_weight_min = ''
      this.params.order_weight_max = ''
      this.params.shipping_type = ''
      this.params.phone = ''
      this.getCapitalWaters()
    },
    // 点击商品详情确定按钮
    closeDetail () {
      this.orderVisible = false
      this.order_id = ''
      this.getFlow()
    },
    // 时间
    capitalTimeSearch (val) {
      let start = `${val[0]} 00:00:00`
      let end = `${val[1]} 23:59:59`
      this.params.start_time = new Date(start).getTime() / 1000
      this.params.end_time = new Date(end).getTime() / 1000
    },
    //  获取表格数据
    async getCapitalWaters () {
      const {err, data} = await this.$service.report.activeLogistics(this.params)
      if (err) return
      this.tableData = data.data
      this.page_total = data.total_count
      this.total_order_weight_ex = data.total_order_weight_ex
      this.total_shipping_money = data.total_shipping_money
      this.total_order_weight = data.total_order_weight
      this.total_order_money = data.total_order_money
    },
    //  搜索
    capitalSearch () {
      this.params.page = 1
      this.getCapitalWaters()
    },
    // 导出
    async exportData () {
      const {err, data} = await this.$service.report.activeLogistics({...this.params, page: 1, pre_page: 3000})
      if (err) return
      if (!data.data.length) {
        this.$message.warning('没有需要导出的数据')
        return
      }
      const json2excel = await import('yt-json2excel/src/index')
      json2excel.default('物流配送统计', data.data.map(item => {
        let createTime = formatTime(item.create_time)
        return {...item, create_time: createTime}
      }), [{
        create_time: '日期',
        order_no: '订单编号',
        order_weight: '订单重量',
        pay_money: '订单金额',
        shipping: '配送方式',
        order_weight_ex: '配送重量',
        shipping_money: '配送金额'
      }])
    },
    //  每条分页触发
    pagingEachSizeChange (val) {
      this.params.page = val
      this.getCapitalWaters()
    },
    //  每条分页触发
    pagingEachPageChange (val) {
      this.params.pre_page = val
      this.getCapitalWaters()
    },
    // 优惠金额 合计
    getSummaries (param) {
      const {columns, data} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计：'
          return
        }
        if (index === 3) {
          sums[3] = this.total_order_weight
        }
        if (index === 4) {
          sums[4] = this.total_order_money
        }
        if (index === 6) {
          sums[6] = this.total_order_weight_ex
        }
        if (index === 7) {
          sums[7] = this.total_shipping_money
        }
      })
      return sums
    },
    // 点击订单编号字段点击打开对应的订单详情的弹窗。
    orderDetail (id) {
      this.order_id = id
      this.orderVisible = true
    }
  }
}
</script>

<style scoped>
  .search-box {
    height: 220px;
    line-height: 54px;
    padding: 0 30px;
    background: #fff;
    margin-bottom: 20px;
  }

  .type-class {
    float: left;
    margin-right: 10px;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  .num_cor {
    color: #1c8fef;
    cursor: pointer;
  }

  .capital-search {
    width: 100%;
    height: 55px;
  }

  .capital-search-btn {
    padding-left: 110px;
  }

  .capital-search-fl {
    float: left;
    width: 280px;
  }
  .order_no{
    color: #409eff;
    cursor: pointer;
    text-decoration: underline;
  }
  .order_no:hover{
    color: #40D9FF;
  }
</style>
