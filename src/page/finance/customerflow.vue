<template>
  <div v-loading="loading">
    <div class="search-box-warp">
      <div class="search-box">
        <el-row>
          <!--<el-col :span="24">-->
            <!--<div  class="grid-content bg-purple-light">-->
              <!--<span class="el_input_text"> 用户:</span>-->
              <!--<div class="type-class">-->
                <!--<el-input size="small" class="el_input_width" v-model="params.store_name" @change="changeStore"-->
                          <!--:clearable="true" placeholder="请输入用户名称"/>-->
              <!--</div>-->
              <!--&lt;!&ndash;<span class="el_input_text"> 负责人:</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="type-class">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-input size="small" class="el_input_width" v-model="params.store_person" @change="changeStore"&ndash;&gt;-->
                          <!--&lt;!&ndash;:clearable="true" placeholder="请输入用户名称"/>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <!--&lt;!&ndash;<span class="el_input_text"> 手机号:</span>&ndash;&gt;-->
              <!--&lt;!&ndash;<div class="type-class">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-input size="small" class="el_input_width" v-model="params.phone" @change="changeStore"&ndash;&gt;-->
                          <!--&lt;!&ndash;:clearable="true" placeholder="请输入用户名称"/>&ndash;&gt;-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->

            <!--</div>-->
          <!--</el-col>-->
          <el-col :span="24">
            <div class="grid-content bg-purple-light">
              <span class="el_input_text"> 用户:</span>
              <div class="type-class">
              <el-input size="small" class="el_input_width" v-model="params.store_name" @change="changeStore"
              :clearable="true" placeholder="请输入用户名称"/>
              </div>
              <span class="el_input_text">单据类型:</span>
              <div class="type-class el_input_width">
                <el-select size="small" v-model="params.type" placeholder="请选择" :clearable="true">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <span class="el_input_text">单据日期:</span>
              <div class="type-class">
                <el-date-picker @change="sTime" class="selected_date" size="small" v-model="valueData" type="daterange"
                                value-format="timestamp"
                                range-separator="至"
                                unlink-panels="true"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </div>
              <el-button class="el_button_left" size="small" type="primary" @click="goStore">搜索</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="background: #fff;margin-top: 10px;">
      <el-table highlight-current-row border :data="billData" style="width: 100%" :header-cell-style="setHeaderStyle">
        <el-table-column prop="no" label="单据编号" align="center">
        </el-table-column>
        <el-table-column prop="store_name" label="用户" align="center"/>
        <el-table-column prop="phone" label="手机号" align="center"/>
        <el-table-column prop="order_no" label="订单号" :render-header="changeLabel" align="center" width="200">
          <template slot-scope="scope">
            <p style="color:#3a8ee6" v-if="scope.row.order_no" @click="showOrderDetail(scope.row.order_id)">
              {{scope.row.order_no}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="单据类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type=='1'">收款单</span>
            <span v-else-if="scope.row.type=='2'">付款单</span>
            <span v-else-if="scope.row.type=='3'">欠款单</span>
            <span v-else-if="scope.row.type=='4'">优惠单</span>
            <span v-else-if="scope.row.type=='5'">退款付款单</span>
            <span v-else-if="scope.row.type=='6'">应收单</span>
          </template>
        </el-table-column>
        <!--<el-table-column prop="store_person" label="负责人" align="center"/>-->
        <el-table-column prop="created_at" label="单据时间" align="center"/>
        <el-table-column prop="payment_type_info" label="支付方式" align="center"/>
        <el-table-column prop="money" label="应收" align="center">
          <template slot-scope="scope">
            <!--<span v-if="scope.row.type==4">&#45;&#45;</span>-->
            <span>{{scope.row.money}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="real_money" label="收款" align="center"></el-table-column>
        <el-table-column prop="pmt_money" label="优惠金额" align="center">
          <template slot-scope="scope">
            <el-popover placement="left-start" trigger="hover" v-if="scope.row.children && scope.row.children.length>0">
              <el-table :data="scope.row.children" border>
                <el-table-column prop="no" label="优惠单号" align="center" width="120"></el-table-column>
                <el-table-column prop="pmt_money" label="优惠金额" align="center"></el-table-column>
              </el-table>
              <el-button slot="reference" size="mini">优惠金额{{scope.row.pmt_total}}</el-button>
            </el-popover>
            <span>{{scope.row.pmt_money}}</span>
            <!--<span v-else-if="scope.row.type==4">{{scope.row.pmt_money}}</span>-->
            <!--<span v-else>&#45;&#45;</span>-->
          </template>
        </el-table-column>
        <el-table-column prop="total_money" label="累计欠款" align="center">
        </el-table-column>
        <el-table-column prop="operator_name" label="操作人" align="center">
        </el-table-column>
      </el-table>
    </div>

    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="pageChange"
        :current-page="params.page"
        :page-size="params.pre_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_count">
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
import orderDetail from '@/page/order/Detail.vue'

export default {
  components: {orderDetail},
  data () {
    return {
      loading: false,
      total_count: 2,
      billData: [],
      valueData: '',
      orderVisible: false,
      order_id: '',
      params: {
        page: 1,
        pre_page: 10,
        store_id: '',
        store_name: '', //  购买人
        phone: '', // 手机
        type: '', // 订单状态
        start_time: '', // 开始时间戳
        end_time: ''// 结束时间戳
      },
      typeOptions: [
        {value: '1', label: '收款单'},
        // {value: '2', label: '付款单'},
        // {value: '3', label: '欠款单'},
        // {value: '4', label: '优惠单'},
        // {value: '5', label: '退款付款单'},
        {value: '6', label: '应收单'}
      ]
    }
  },
  async created () {
    this.params.store_id = this.$route.query.store_id || ''
    this.params.store_name = this.$route.query.store_name || ''
    this.getFlow()
  },
  activated () {
    this.getFlow()
  },
  methods: {
    // 修改表头
    changeLabel (h, {column, $index}) {
      return (
        <el-popover placement="top-start" trigger="hover" content="操作待收款订单才会生成订单号">
          <span slot="reference">订单号<i class="el-icon-question"></i>
          </span>
        </el-popover>
      )
    },
    // 行点击
    showOrderDetail (orderNo) {
      this.order_id = orderNo
      this.orderVisible = true
    },
    changeStore (val) {
      if (!val) {
        this.params.store_id = ''
      }
    },
    // 点击商品详情确定按钮
    closeDetail () {
      this.orderVisible = false
      this.order_id = ''
      this.getFlow()
    },
    // 设置表头样式
    setHeaderStyle () {
      return 'background:#f5f7fa'
    },
    sTime (val) {
      this.params.start_time = val ? parseInt(val[0]) / 1000 : ''
      this.params.end_time = val ? ((parseInt(val[1]) / 1000) + 86400) : ''
    },
    // 获取流水列表数据
    async getFlow () {
      this.loading = true
      const {err, data} = await this.$service.financemanager.flowList(this.params)
      if (err) return
      this.loading = false
      data.data.forEach(item => {
        if (item.children) {
          let tmp = 0
          item.children.forEach(iitem => {
            tmp = tmp + parseFloat(iitem.pmt_money)
          })
          item.pmt_total = tmp.toFixed(2)
        }
      })
      this.billData = data.data
      this.total_count = data.total_count || 0
    },
    //  搜索
    goStore () {
      this.params.page = 1
      this.getFlow()
    },

    //  分页
    pageChange (val) {
      this.params.page = val
      this.getFlow()
    },
    handleSizeChange (val) {
      this.params.pre_page = val
      this.getFlow()
    }
  }
}
</script>

<style scoped>
  .search-box-warp {
    margin-bottom: 10px;
  }

  .search-box {
    /*height: 54px;*/
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  @media screen and (min-width: 1400px) {
    .type-class {
      float: left;
    }

    .el_input_text {
      float: left;
      margin: 0 10px;
    }

    .el_input_width {
      width: 150px;
    }

    .el_button_left {
      margin-left: 10px;
    }

    .selected_date {
      width: 230px;
    }
  }

  @media screen and (min-width: 1750px) {
    .type-class {
      float: left;
    }

    .el_input_text {
      float: left;
      margin: 0 10px;
    }

    .el_input_width {
      width: 220px;
    }

    .el_button_left {
      margin-left: 10px;
    }

    .selected_date {
      width: 350px;
    }
  }

  @media screen and (max-width: 1400px) {
    .type-class {
      float: left;
    }

    .el_input_text {
      float: left;
      margin: 0 5px;
    }

    .el_input_width {
      width: 130px;
    }

    .el_button_left {
      margin-left: 10px;
    }

    .selected_date {
      width: 230px;
    }
  }

</style>
