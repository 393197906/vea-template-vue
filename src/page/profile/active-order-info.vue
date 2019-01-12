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
            <el-input size="small" v-model="params.order_no" placeholder="请输入订单编号"/>
          </div>
        </div>
        <div class="capital-search">
          <span style="float:left;margin-right: 10px;width: 65px;">负责人:</span>
          <div class="type-class">
            <el-input size="small" v-model="params.user_name" placeholder="请输入负责人"/>
          </div>
        </div>
        <div class="capital-search capital-search-fl">
          <span style="float:left;margin-right: 10px;width: 65px;">手机号:</span>
          <div class="type-class">
            <el-input size="small" v-model="params.user_phone" placeholder="请输入手机号"/>
          </div>
        </div>
        <div class="capital-search capital-search-fl">
          <span style="float:left;margin-right: 10px;width: 65px;">活动类型:</span>
          <div class="type-class">
            <el-select size="small" style="width: 185px;" v-model="params.active_type" placeholder="请选择活动类型">
              <el-option
                v-for="item in active_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="capital-search">
          <span style="float:left;margin-right: 10px;width: 65px;">活动名称:</span>
          <div class="type-class">
            <el-input size="small" v-model="params.active_name" placeholder="请输入活动名称"/>
          </div>
        </div>
        <div class="capital-search-btn">
          <el-button size="small" type="primary" icon="el-icon-search" @click="capitalSearch">搜索</el-button>
          <el-button size="small" type="primary" plain icon="el-icon-upload2" @click="exportData">导出</el-button>
          <el-button size="small" type="text" plain @click="emptyFilter(params)">清空筛选条件
          </el-button>
        </div>
      </div>
    </div>
    <el-table :data="tableData" border
              @sort-change="sortListChange"
              :summary-method="getSummaries"
              show-summary>
      <el-table-column label="序号" type="index" width="50" align="center"/>
      <el-table-column prop="created_at" label="日期" align="center"></el-table-column>
      <!--<el-table-column prop="order_no" label="订单编号" align="center"></el-table-column>-->
      <el-table-column prop="order_no" label="订单编号" align="center">
        <template slot-scope="scope">
          <span class="num_cor" @click="storageDetail(scope.row.order_id)">
            {{scope.row.order_no}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="principal_name" label="购货人" align="center"></el-table-column>
      <el-table-column prop="principal_phone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="active_type" label="活动类型" align="center">
        <template slot-scope="scope">
          <span v-for="(i,index) in scope.row.active_type">
            {{i}}<span v-if="index+1 !== scope.row.active_type.length">,</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="active_name" label="活动名称" align="center">
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.active_name">
            {{item}}<span v-if="index+1 !== scope.row.active_name.length">,</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="pay_money" label="购货金额" align="center"></el-table-column>
      <el-table-column prop="total_origin_money" label="购货原金额" align="center"></el-table-column>
      <el-table-column prop="total_discount_money" sortable="custom" label="优惠金额"
                       align="center"></el-table-column>
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
      <OrderDetail :isDialog="true" :comId="order_id" v-if="orderVisible" style="height: 500px;overflow-y: scroll"></OrderDetail>
    </el-dialog>
  </div>
</template>

<script>
  import OrderDetail from '@/page/order/Detail.vue'

  export default {
    name: "active-order-info",
    components: {
      OrderDetail
    },
    data () {
      return {
        order_id: '',
        orderVisible: false,
        capital_time: [],  // 时间
        tableData: [],
        active_type: [       //  支付类型
          {
            value: '1',
            label: '优惠券'
          },
          {
            value: '2',
            label: '限时折扣'
          },
          {
            value: '3',
            label: '限时秒杀'
          },
          {
            value: '4',
            label: '阶梯价'
          },
          {
            value: '5',
            label: '综合批发价'
          },
          {
            value: '6',
            label: '满减送 '
          }
        ],
        total_discount_money: "",
        page_total: 1,
        params: {
          page: 1,          //  页数
          pre_page: 10,          //  条数
          start_time: '',         //  开始时间
          end_time: '',           //  结束时间
          order_no: '',           //  订单编号
          user_name: '',          //  负责人
          user_phone: '',         //  手机号
          active_type: '',        //  活动类型
          active_name: '',        //  活动名称
          sort: ''               //  默认排序
        },
        now_active_name: []
      }
    },
    created () {
      this.getCapitalWaters()
      this.height = window.innerHeight - 357 + 'px'
    },
    methods: {
      // 清空筛选条件
      emptyFilter (val) {
        this.capital_time = [],
          val.start_time = '',         //  开始时间
          val.end_time = '',           //  结束时间
          val.order_no = '',           //  订单编号
          val.user_name = '',          //  负责人
          val.user_phone = '',         //  手机号
          val.active_type = '',        //  活动类型
          val.active_name = ''        //  活动名称
        this.getCapitalWaters()
      },

      //  订单 弹窗
      storageDetail (id) {
        this.order_id = id
        this.orderVisible = true
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
        const {err, data} = await this.$service.report.activeOrderInfo(this.params)
        if (err) return
        this.tableData = data.data
        this.page_total = data.total_count
        this.total_discount_money = data.total_discount_money
      },
      //  搜索
      capitalSearch () {
        this.params.page = 1
        this.getCapitalWaters()
      },
      // 导出
      async exportData () {
        const {err, data} = await this.$service.report.activeOrderInfo(this.params)
        if (err) return
        if (!data.data.length) {
          this.$message.warning('没有需要导出的数据')
          return
        }
        const json2excel = await import('yt-json2excel/src/index')
        json2excel.default('活动订单统计', data.data.map(item => {
          const {order_status: orderStatus, ...rest} = item
          return rest
        }), [{
          created_at: '日期',
          order_no: '订单编号',
          principal_name: "购货人",
          principal_phone: "手机号",
          active_type: "活动类型",
          active_name: "活动名称",
          pay_money: "购货金额",
          total_origin_money: "购货原金额",
          total_discount_money: "优惠金额"
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
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 8) {
            sums[index] = '优惠金额合计：';
            return;
          }
          if (index === 9) {
            sums[9] = this.total_discount_money
          }
        });
        return sums;
      },
      sortListChange (column) {
        if (column.prop === "total_discount_money") {
          if (column.order === 'ascending') {
            this.params.sort = '1'
            this.getCapitalWaters()
          } else if (column.order === 'descending') {
            this.params.sort = '2'
            this.getCapitalWaters()
          }
        } else {
          this.params.sort = ''
          this.getCapitalWaters()
        }
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
</style>

