<template>
  <div>
    <div class="search-box-warp">
      <div class="search-box">
        <el-row>
          <el-col :span="24" style="margin-bottom: 15px;">
            <span class="el_input_text"> 时间:</span>
            <div class="type-class">
              <el-date-picker
                v-model="params.date"
                :clearable="false"
                size="small"
                unlink-panels
                type="daterange"
                range-separator="-"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                start-placeholder="请选择开始日期"
                end-placeholder="请选择结束日期">
              </el-date-picker>
            </div>

          </el-col>
          <el-col :span="24">
            <div class="serch-item">
              <span class="el_input_text">商品名称:</span>
              <div class="type-class el_input_width">
                <el-input size="small" class="el_input_width" v-model="params.goodsName"
                          :clearable="true" placeholder="请输入商品名称"/>
              </div>
            </div>
            <div class="serch-item">
            <span class="el_input_text"> 用户名称:</span>
            <div class="type-class">
              <el-input size="small" class="el_input_width" v-model="params.storeName"
                        :clearable="true" placeholder="请输入用户名称"/>
            </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple-light">
              <div class="serch-item">
              <span class="el_input_text">订单号:</span>
              <div class="type-class el_input_width">
                <el-input size="small" class="el_input_width" v-model="params.orderNo"
                          :clearable="true" placeholder="请输入订单号"/>
              </div>
              </div>
              <!--{data:{data:{list}},err}-->
              <div class="serch-item">
              <span class="el_input_text">单据类型:</span>
              <div class="type-class el_input_width">
                <!--// 销售出库 XSCK 退货入库 XTRK-->
                <!--sheetType字段-->
                <el-select v-model="params.sheetType" placeholder="请选择单据类型" size="small" clearable>
                  <el-option label="销售出库" value="XSCK"/>
                  <el-option label="退货入库" value="XTRK"/>
                </el-select>
              </div></div>

            </div>
          </el-col>
          <el-col :span="24">
            <el-button class="el_button_left" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button size="small" type="primary" plain icon="el-icon-upload2" @click="exportData">导出</el-button>
            <el-button size="small" type="text" @click="clearData">清空搜索条件</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="background: #fff;margin-top: 10px;">
      <el-table :header-cell-style="setHeaderStyle" border
                v-loading="loading"
                highlight-current-row
                show-summary
                :summary-method="getSummaries"
                :data="items"
                :height="height"
                style="width: 100%">
        <el-table-column label="序号" type="index" width="50" align="center"/>
        <el-table-column prop="order_id_no" label="单据日期" align="center" width="180">
          <template slot-scope="scope">
            {{scope.row.sheetTime | formatTime}}
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号" align="center" width="180">
          <template slot-scope="scope" v-if="scope.row.orderNo">
            <span class="num_cor" @click="orderNoDetail(scope.row.orderId)">
              {{scope.row.orderNo}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sheetCode" label="单据编号" align="center" width="220">
          <template slot-scope="scope" v-if="scope.row.sheetCode">
            <span class="num_cor" @click="storageDetail(scope.row.sheetId,scope.row.isReturn)">
              {{scope.row.sheetCode}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sheetTypeName" label="单据类型" align="center"/>
        <el-table-column prop="buyer" label="用户" align="center" width="220"/>
        <el-table-column prop="goodsName" label="商品名称" align="center" width="220"/>
        <el-table-column prop="unit" label="单位" align="center"/>
        <el-table-column prop="goodsWeight" label="重量" align="center"/>
        <el-table-column label="收入" align="center">
          <el-table-column prop="realGoodsPrice" label="销售单价" align="center"/>
          <el-table-column prop="realGoodsMoney" label="销售金额" align="center"/>
        </el-table-column>
        <el-table-column label="成本" align="center">
          <el-table-column prop="costPrice" label="成本单价" align="center"/>
          <el-table-column prop="costMoney" label="成本金额" align="center"/>
        </el-table-column>
        <el-table-column prop="profit" label="毛利" align="center" fixed="right"/>
        <el-table-column prop="profitRate" label="毛利率" align="center" fixed="right"/>
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

    <el-dialog :title="titles" :visible.sync="dialogVisibles" width="85%">
      <outgoingInfoModal :outgoingData="outgoingData" v-if="dialogVisibles"></outgoingInfoModal>
    </el-dialog>

    <el-dialog :title="titles" :visible.sync="dialogVisiblesEnter" width="85%">
      <storageInfoModal :orderInfo="orderInfo" :queryData="queryData" v-if="dialogVisiblesEnter"></storageInfoModal>
    </el-dialog>

    <el-dialog title="订单详情" :visible.sync="orderVisible" width="85%">
      <order-detail :isDialog="true" :comId="order_id" v-if="orderVisible" style="height: 500px;overflow-y: scroll"></order-detail>
    </el-dialog>
  </div>
</template>

<script>
import outgoingInfoModal from '@/page/stock/outgoingInfoModal'
import orderDetail from '@/page/order/Detail.vue'
import storageInfoModal from '@/page/stock/storageInfoModal'
const timeDate = (() => {
  const firstDate = new Date(new Date(new Date().toLocaleDateString()).getTime())
  const endDate = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
  return [firstDate * 1, firstDate * 1]
})()
export default {
  components: {
    outgoingInfoModal,
    orderDetail,
    storageInfoModal
  },
  data () {
    return {
      height: 0,
      loading: false,
      total_count: 3,
      items: [],
      params: {
        page: 1,
        pageSize: 10,
        storeName: '', // 用户名称
        goodsName: '', // 商品名称，
        orderNo: '', // 订单号
        sheetType: '', // 单据类型
        date: [timeDate[0], timeDate[1]]
      },
      outgoingData: {},
      orderInfo: {},
      queryData: {},
      titles: '入库单详情',
      dialogVisibles: false,
      dialogVisiblesEnter: false,
      orderVisible: false,
      order_id: ''
    }
  },
  async created () {
    this.height = window.innerHeight - 181
    this.getItems()
  },
  activated () {
  },
  methods: {
    //  单据编号弹窗
    async storageDetail (id, val) {
      if (val) {
        //  true是退货入库单 false是销售出库单
        // 退货入库单
        const {err, data: {data}} = await this.$service.purchase.getSellReturn({id: id})
        this.dialogVisiblesEnter = true
        this.titles = '入库单详情'
        if (err) return
        this.orderInfo = data
        this.queryData = data.goodsInfo
      } else {
        // 销售出库单
        const {err, data: {data}} = await this.$service.outgoing.getSell({
          id: id
        })
        this.dialogVisibles = true
        this.titles = '出库单详情'
        if (err) return
        this.outgoingData = data
      }
    },
    //  订单编号弹窗
    orderNoDetail (id) {
      this.order_id = id
      this.orderVisible = true
    },
    async exportData () {
      const {err, data: {data}} = await this.$service.exportFile.export({
        ...this.handleParams(),
        export: 'sellReportDetail'
      })
      if (err) return
      // console.log(data)
      window.location.href = data
    },
    // 处理参数
    handleParams () {
      const {date, ...rest} = this.params
      const [startTime = '', endTime = ''] = date.map((item, index) => {
        const result = parseInt(item / 1000)
        if (index) {
          return result + 24 * 3600 - 1
        }
        return result
      })
      return {startTime, endTime, reportType: 0, ...rest}
    },
    // 获取数据
    async getItems () {
      this.loading = true
      const {err, data} = await this.$service.stock.orderGoodsStatistics(this.handleParams())
      this.loading = false
      if (err) return
      this.total_count = data.data.total
      this.items = data.data.data
    },
    search () {
      this.getItems()
    },
    // 清空搜索条件
    clearData () {
      this.params = {
        page: 1,
        pageSize: 10,
        storeName: '', // 用户名称
        goodsName: '', // 商品名称，
        orderNo: '', // 订单号
        sheetType: '', // 单据类型
        date: [timeDate[0], timeDate[1]]
      }
    },
    pageChange (page) {
      this.params.page = page
      this.getItems()
    },
    handleSizeChange (size) {
      this.params.pageSize = size
      this.getItems()
    },
    // 设置表头样式
    setHeaderStyle () {
      return 'background:#f5f7fa'
    },
    getSummaries (param) {
      const {columns, data} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ([1, 2, 3, 4, 5, 6, 7, 9, 11].includes(index)) {
          sums[index] = ''
          return
        }

        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = parseInt(values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0))
          // sums[index] += ' 元'
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  }
}
</script>

<style scoped>
  .search-box-warp {
    margin-bottom: 10px;
  }

  .search-box {
    line-height: 40px;
    padding: 0 10px;
    background: #fff;
    padding-bottom: 15px;
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
      min-width: 65px;
      margin: 0 10px;
    }

    .el_input_width {
      width: 150px;
    }

    .el_button_left {
      margin-left: 10px;
    }
.serch-item{
  display: inline-block;
  min-width: 250px;
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
      width: 130px;
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
      width: 90px;
    }

    .el_button_left {
      margin-left: 10px;
    }

    .selected_date {
      width: 200px;
    }
  }

  .num_cor {
    color: #1c8fef;
    cursor: pointer;
  }

</style>
