<template>
  <div>
    <div class="search-box">
      <div class="searcher">
        <div class="capital-search">
          <span style="float:left;margin-right: 10px;width: 65px;">时间:</span>
          <div class="type-class">
            <el-date-picker
              size="small"
              type="daterange"
              value-format="timestamp"
              unlink-panels="true"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model="capital_time"
              :clearable="false"
              @change="capitalTimeSearch">
            </el-date-picker>
          </div>
        </div>

        <div class="capital-search capital-search-fl">
          <span style="float:left;margin-right: 10px;width: 65px;">门店名称:</span>
          <div class="type-class">
            <el-input size="small" v-model="params.store_name" clearable placeholder="请输入门店名称"/>
          </div>
        </div>

        <div class="capital-search">
          <span style="float:left;margin-right: 10px;width: 65px;">手机号:</span>
          <div class="type-class">
            <el-input size="small" v-model="params.receiver_mobile" placeholder="请输入手机号"/>
          </div>
        </div>
        <div class="capital-search capital-search-fl">
          <span style="float:left;margin-right: 10px;width: 65px;">收款方式:</span>
          <div class="type-class">
            <el-select size="small" style="width: 185px;" v-model="params.pay_type" placeholder="收款方式" clearable>
              <el-option
                v-for="item in pay_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="capital-search">
          <span style="float:left;margin-right: 10px;width: 65px;">订单编号:</span>
          <div class="type-class">
            <el-input size="small" v-model="params.order_no" placeholder="请输入订单编号"/>
          </div>
        </div>
        <div class="capital-search capital-search-fl">
          <span style="float:left;margin-right: 10px;width: 65px;">操作人:</span>
          <div class="type-class">
            <el-input size="small" v-model="params.user_name" clearable placeholder="请输入操作人"/>
          </div>
        </div>

        <div class="capital-search">
          <span style="float:left;margin-right: 10px;width: 65px;">金额范围:</span>
          <div class="type-class">
            <el-input size="small" :min="0" style="width: 150px;" type="number" v-model="params.strat_money"
                      placeholder="开始金额"/>
          </div>
          <span style="float:left;margin-right: 10px">至</span>
          <div class="type-class">
            <el-input :min="0" type="number" style="width: 150px;" size="small" v-model="params.end_money"
                      placeholder="结束金额"/>
          </div>
        </div>

        <div class="capital-search-btn">
          <el-button size="small" type="primary" icon="el-icon-search" @click="capitalSearch">搜索</el-button>
          <el-button size="small" type="primary" plain icon="el-icon-upload2" @click="exportData"  v-if="$checkActionAccess($ACCESS.ZJLS_EXPORT)">导出</el-button>
          <el-button size="small" type="text" plain @click="emptyFilter(params)">清空筛选条件
          </el-button>
        </div>

      </div>
    </div>
    <el-table :data="tableData" border>
      <el-table-column prop="created_at" label="日期" align="center"></el-table-column>
      <el-table-column prop="order_no" label="订单编号" align="center">
        <template slot-scope="scope">
          <span class="num_cor" @click="storageDetail(scope.row.order_id)">
            {{scope.row.order_no}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="store_name" label="门店名称" align="center"></el-table-column>
      <el-table-column prop="receiver_mobile" label="手机号" align="center"></el-table-column>
      <el-table-column prop="pay_type" label="收款方式" align="center"></el-table-column>
      <el-table-column prop="real_money" label="实收金额" align="center"></el-table-column>
      <el-table-column prop="pmt_money" label="优惠金额" align="center"></el-table-column>
      <el-table-column prop="user_name" label="操作人" align="center"></el-table-column>
      <el-table-column prop="note" label="备注" align="center"></el-table-column>
    </el-table>
    <!--分页start-->
    <div class="page-box">
      <el-pagination
        id="page-box"
        background
        layout="prev, pager, next"
        @size-change="pagingEachPageChange"
        @current-change="pagingEachSizeChange"
        :current-page="params.page_index"
        :page-size="params.page_size"
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
  name: 'capitalWater',
  components: {
    OrderDetail
  },
  data () {
    return {
      page_total: 0,
      capital_time: '', // 时间
      tableData: [],
      pay_type: [ //  支付类型
        {
          value: '1',
          label: '现金'
        },
        {
          value: '2',
          label: '微信'
        },
        {
          value: '3',
          label: '支付宝'
        },
        {
          value: '4',
          label: '银行转账'
        }
      ],
      params: {
        page_index: 1, //  页数
        page_size: 10, //  条数
        start_time: '', //  开始时间
        end_time: '', //  结束时间
        pay_type: [], //  支付类型
        receiver_mobile: '', //  收货人手机号
        user_name: '', //  操作人
        order_no: '', //  订单号
        strat_money: '', //  开始金额
        end_money: '', //  结束金额
        store_name: '' //  门店名称
      },
      orderVisible: false,
      order_id: ''
    }
  },
  created () {
    this.getCapitalWaters()
  },
  methods: {
    // 清空条件
    emptyFilter (val) {
      this.capital_time = ''
      val.start_time = '', //  开始时间
      val.end_time = '', //  结束时间
      val.pay_type = [], //  支付类型
      val.receiver_mobile = '', //  收货人手机号
      val.user_name = '', //  操作人
      val.order_no = '', //  订单号
      val.strat_money = '', //  开始金额
      val.end_money = '' //  结束金额
      val.store_name = ''
    },
    //  订单 弹窗
    storageDetail (id) {
      this.order_id = id
      this.orderVisible = true
    },
    //  获取表格数据
    async getCapitalWaters () {
      const {err, data} = await this.$service.report.getCapitalWater(this.params)
      if (err) return
      this.tableData = data.data
      this.page_total = data.page_total
    },
    // 时间
    capitalTimeSearch (val) {
      this.params.start_time = val ? val[0] / 1000 : ''
      this.params.end_time = val ? val[1] / 1000 : ''
    },
    //  搜索
    capitalSearch () {
      this.params.page_index = 1
      this.getCapitalWaters()
    },
    // 导出
    async exportData () {
      const {err, data} = await this.$service.report.getCapitalWater({...this.params, page_size: 3000})
      if (err) return
      if (!data.data.length) {
        this.$message.warning('没有需要导出的数据')
        return
      }
      const json2excel = await import('yt-json2excel/src/index')
      json2excel.default('订单数据', data.data.map(item => {
        const {order_status: orderStatus, ...rest} = item
        return rest
      }), [{
        created_at: '日期',
        order_no: '订单编号',
        store_name: '用户',
        receiver_mobile: '手机号',
        pay_type: '收款方式',
        real_money: '实收金额',
        pmt_money: '优惠金额',
        user_name: '操作人',
        note: '备注'
      }])
    },
    //  每条分页触发
    pagingEachSizeChange (val) {
      this.params.page_index = val
      this.getCapitalWaters()
    },
    //  每条分页触发
    pagingEachPageChange (val) {
      this.params.page_size = val
      this.getCapitalWaters()
    }
  }
}
</script>

<style scoped>
  .search-box {
    height: 280px;
    line-height: 54px;
    padding: 0 10px;
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
    padding-left: 20px;
  }

  .capital-search-btn {
    padding-left: 110px;
  }

  .capital-search-fl {
    float: left;
    width: 280px;
  }
</style>
