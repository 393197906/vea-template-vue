<template>
  <div v-loading="loading">
    <div class="search-box-warp">
      <div class="search-box">
        <el-row>
          <el-col :span="24">
            <div style="float:right;" class="grid-content bg-purple-light">
              <span class="el_input_text"> 订单编号:</span>
              <div class="type-class">
                <el-input size="small" class="el_input_width" v-model="params.orderNo"
                          :clearable="true" placeholder="请输入订单编号"/>
              </div>
              <span class="el_input_text"> 用户:</span>
              <div class="type-class">
                <el-input size="small" class="el_input_width" v-model="params.storeName"
                          :clearable="true" placeholder="请输入用户名称"/>
              </div>
              <span class="el_input_text"> 手机号:</span>
              <div class="type-class">
                <el-input size="small" class="el_input_width" v-model="params.receiver_mobile"
                          :clearable="true" placeholder="请输入手机号"/>
              </div>
              <span class="el_input_text">订单状态:</span>
              <div class="type-class el_input_width">
                <el-select v-model="params.orderStatus" size="small" placeholder="请选择" :clearable="true">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <el-button class="el_button_left" size="small" type="primary" @click="goStore">搜索</el-button>
              <!--<el-button size="small">批量收款</el-button>-->
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="background: #fff;margin-top: 10px;">
      <el-alert v-if="multipleSelection.length>0"
                :title="titletip"
                type="success" :closable="false">
      </el-alert>
      <el-table :header-cell-style="setHeaderStyle" border
                highlight-current-row
                @selection-change="handleSelectionChange"
                :data="receiveData"
                style="width: 100%">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="order_id_no" label="订单" align="center" width="360">
          <template slot-scope="scope">
            <p>订单编号：{{scope.row.order_no}}（订单ID:{{scope.row.order_id}}）</p>
          </template>
        </el-table-column>
        <el-table-column prop="store_name" label="用户" align="center"></el-table-column>
        <el-table-column prop="receiver_mobile" label="手机号" align="center"></el-table-column>
        <el-table-column prop="order_pmt_amount" label="优惠金额" align="center"></el-table-column>
        <el-table-column prop="money" label="待收款金额" align="center"></el-table-column>
        <el-table-column prop="order_status" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="arrear" label="当前欠款" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template slot-scope="scope">
            <el-button type="text" @click="showOrderDetail(scope.row)"  v-if="$checkActionAccess($ACCESS.FINANCIAL_COLLECTION_BILL_DETAIL)">订单详情</el-button>
            <!--<el-button type="text" disabled v-if="scope.row.is_show==0">确认收款</el-button>-->
            <el-button type="text" @click="showReceive(scope.row)" v-if="scope.row.is_show!=0&&$checkActionAccess($ACCESS.FINANCIAL_COLLECTION) ">收款单</el-button>
            <!--<el-button type="text" disabled v-if="scope.row.is_show==0">立即核销</el-button>-->
            <el-button type="text" @click="transArrear(scope.row)" v-loading.fullscreen.lock="fullscreenLoading"
                       v-if="scope.row.is_show!=0 && $checkActionAccess($ACCESS.FINANCIAL_COLLECTION_TO_DEBT)">
              立即核销
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="pageChange"
        :current-page="params.pageIndex"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_count">
      </el-pagination>
    </div>
    <receipt-form v-if="receiveVisible" :showDialog="receiveVisible" :base-data.sync="tmpForm"
                  @isShow="showData"></receipt-form>
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
import receiptForm from './components/receipt'
import orderDetail from '@/page/order/Detail.vue'

export default {
  components: {receiptForm, orderDetail},
  data () {
    return {
      fullscreenLoading: false,
      loading: false,
      order_id: '',
      orderVisible: false,
      receiveVisible: false,
      multipleSelection: [],
      total_count: 3,
      titletip: '已选择2项，合计：1555',
      receiveData: [],
      tmpForm: {},
      params: {
        pageIndex: 1,
        pageSize: 10,
        orderNo: '', //  订单号
        storeName: '', //  购买人
        orderStatus: '', // 订单状态
        receiver_mobile: '' //  手机号
      },
      typeOptions: [
        {value: '2', label: '待收货'},
        {value: '3', label: '已收货'},
        {value: '4', label: '已完成'}
      ]
    }
  },
  watch: {
    receiveVisible (val) {
      if (!val) {
        this.tmpForm = {}
      }
    }
  },
  async created () {
    this.getReceive()
  },
  activated () {
    this.getReceive()
  },
  methods: {
    // 设置表头样式
    setHeaderStyle () {
      return 'background:#f5f7fa'
    },
    // 点击商品详情确定按钮
    closeDetail () {
      this.orderVisible = false
      this.getReceive()
    },
    showData (tmp) {
      this.receiveVisible = tmp
      if (!tmp) {
        this.getReceive()
      }
    },
    // 查看订单详情
    showOrderDetail (row) {
      this.order_id = row.order_id
      this.orderVisible = true
      // this.$router.push({
      //   path: `/order/list/detail/${row.order_id}`,
      //   query: {
      //     orderId: row.order_id
      //   }
      // })
    },
    // 打开添加收款单弹框
    showReceive (row) {
      this.tmpForm = row
      this.receiveVisible = true
    },
    // 获取待收款订单列表
    async getReceive () {
      this.loading = true
      const {err, data} = await this.$service.financemanager.receiveList(this.params)
      if (err) return
      this.loading = false
      this.receiveData = data.data
      this.total_count = data.page_total || 0
    },
    // 添加收款单
    addReceive () {
      this.receiveVisible = false
    },
    //  搜索
    goStore () {
      this.params.pageIndex = 1
      this.getReceive()
    },
    // 立即核销
    transArrear (row) {
      this.$confirm('确定将待收款金额立即核销？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.fullscreenLoading = true
        const {err, data} = await this.$service.financemanager.intoArrear(row.id)
        this.fullscreenLoading = false
        if (err) {
          this.$message({
            type: 'error',
            message: '操作失败!'
          })
        } else {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getReceive()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    //  分页
    pageChange (val) {
      this.params.pageIndex = val
      this.getReceive()
    },
    handleSelectionChange (val) {
      this.multipleSelection = []
      let total = 0
      val.forEach(item => {
        if (item.order_id) {
          let obj = {}
          obj[item.order_id_no] = parseFloat(item.money)
          total = total + parseFloat(item.money)
          this.multipleSelection.push(obj)
        }
      })
      this.titletip = '已选择' + this.multipleSelection.length + '项，合计：' + total.toFixed(2)
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getReceive()
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
      width: 300px;
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
      width: 200px;
    }
  }

</style>
