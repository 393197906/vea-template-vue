<template>
  <div v-loading="loading">
    <div class="search-box-warp">
      <div class="search-box">
        <el-row>
          <el-col :span="24">
            <div style="float:right;" class="grid-content bg-purple-light">
              <span class="el_input_text">单据类型:</span>
              <div class="type-class el_input_width">
                <el-select v-model="params.type" placeholder="请选择" :clearable="true" size="small">
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
                                unlink-panels="true"
                                range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </div>
              <el-button class="el_button_left" size="small" type="primary" @click="goStore">搜索</el-button>
              <el-button type="primary" size="small" plain icon="el-icon-upload2" @click="exportData"  v-if="$checkActionAccess($ACCESS.PTDZ_EXPORT)">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="background: #fff;margin-top: 10px;">
      <el-table highlight-current-row border :height="table_height" :data="billData" style="width: 100%" :header-cell-style="setHeaderStyle">
        <el-table-column prop="no" label="单据编号" align="center">
        </el-table-column>
        <el-table-column prop="shop_name" label="所属店铺" align="center"></el-table-column>
        <el-table-column prop="store_name" label="用户名称"></el-table-column>
        <el-table-column label="创始人信息">
          <template slot-scope="scope">
            <p>创始人:{{scope.row.store_person}}</p>
            <p>创始人手机号:{{scope.row.store_person_phone}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="type_name" label="单据类型" align="center">
        </el-table-column>
        <el-table-column prop="created_at" label="单据时间" align="center">
        </el-table-column>
        <el-table-column prop="order_no" label="订单编号" align="center" width="200">
          <template slot-scope="scope">
            <p style="color:#3a8ee6;cursor: pointer" v-if="scope.row.order_no" @click="showOrderDetail(scope.row.order_id)">
              {{scope.row.order_no}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="应结算金额" align="center">
          <template slot-scope="scope">
            {{'￥'}}{{ scope.row.money | formatNub }}
          </template>
        </el-table-column>
        <el-table-column prop="real_money" label="实际结算金额" align="center">
          <template slot-scope="scope">
            {{'￥'}}{{ scope.row.real_money | formatNub }}
          </template>
        </el-table-column>
        <el-table-column prop="before_money" label="操作前金额汇总" align="center">
          <template slot-scope="scope">
            {{'￥'}}{{ scope.row.before_money | formatNub }}
          </template>
        </el-table-column>
        <el-table-column prop="after_money" label="操作后商家汇总" align="center">
          <template slot-scope="scope">
            {{'￥'}}{{ scope.row.after_money | formatNub }}
          </template>
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
        shop_id: '',
        type: '', // 订单状态
        start_time: 0,
        end_time: Date.parse(new Date()) / 1000
      },
      typeOptions: [
        {value: '2', label: '应收单'},
        {value: '4', label: '收款单'}
      ]
    }
  },
  async created () {
    const {id} = JSON.parse(sessionStorage.getItem('user_info')).shop_info || ''
    this.params.shop_id = id
    this.getFlow()
  },
  activated () {
    this.getFlow()
  },
  computed:{
    table_height() {
      return  document.body.scrollHeight-188
    }
  },
  methods: {
    // 修改表头
    // changeLabel (h, {column, $index}) {
    //   return (
    //     <el-popover placement="top-start" trigger="hover" content="操作待收款订单才会生成订单号">
    //     <span slot="reference">订单号<i class="el-icon-question"></i></span>
    //   </el-popover>
    // )
    // },
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
    // 导出
    async exportData () {
      this.loading = true
      const {err, data} = await this.$service.financemanager.transList({...this.params, pre_page: 3000})
      if (err) return
      this.loading = false
      if (!data.data.length) {
        this.$message.warning('没有需要导出的数据')
        return
      }
      const json2excel = await import('yt-json2excel/src/index')
      json2excel.default('订单列表', data.data.map(item => {
        return item
      }), [{
        no: '单据编码',
        shop_name: '所属店铺',
        store_name: '用户名称',
        store_person: '创始人',
        store_person_phone: '创始人手机号',
        type_name: '单据类型',
        created_at: '单据时间',
        order_no: '订单编码',
        money: '应结算金额',
        real_money: '实际结算金额',
        before_money: '操作前金额汇总',
        after_money: '操作后商家汇总',
        operator_name: '操作人'
      }])
    },
    // 获取流水列表数据
    async getFlow () {
      this.loading = true
      const {err, data} = await this.$service.financemanager.transList(this.params)
      if (err) return
      this.loading = false
      this.billData = data.data
      this.total_count = data.total_count || 0
    },
    //  搜索
    goStore () {
      this.params.start_time = this.params.start_time == '' ? 0 : this.params.start_time
      this.params.end_time = this.params.end_time == '' ? Date.parse(new Date()) / 1000 : this.params.end_time
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
    height: 54px;
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
