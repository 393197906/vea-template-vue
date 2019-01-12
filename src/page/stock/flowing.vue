<template>
    <div class="module-box">
        <!-- 搜索 -->
        <div class="search-box">
            <el-form ref="searchData" :model="searchData" inline size="small">

                <el-form-item label-width="100px" label="商品名称：" prop="goodsName">
                    <el-input placeholder="请输入商品名称" v-model="searchData.goodsName" @keyup.enter.native="pageChange(1)"></el-input>
                </el-form-item>
                <div>
                    <!-- 引入时间检索组件 -->
                    <searchTime
                            label="制单时间"
                            ref="searchTime"
                            @searchTimeChange="searchTimeChange">
                    </searchTime>
                </div>
                <div>
                    <el-form-item label-width="100px" label="单据编号："  prop="sheetCode">
                        <el-input v-model="searchData.sheetCode" placeholder="请输入单据编号" @keyup.enter.native="pageChange(1)"></el-input>
                    </el-form-item>
                    <el-form-item label="单据类型：" prop="sheetType">
                        <el-select v-model="searchData.sheetType" filterable placeholder="请选择" @change="pageChange(1)">
                            <el-option v-for="item in sheetTypeData" :key="item.value" :value="item.value" :label="item.label" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="100px" label="操作人：" prop="operatorId">
                        <el-select v-model="searchData.operatorId" filterable placeholder="请选择" @change="pageChange(1)">
                            <el-option v-for="item in operator_list" :key="item.id" :value="item.id" :label="item.user_name"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label-width="100px" label=" ">
                        <el-button type="primary" @click="pageChange(1)">筛选</el-button>
                        <el-button @click="exportData"   v-if="$checkActionAccess($ACCESS.STOCK_INVENTORY_DETAIL_EXPORT)">导出</el-button>
                        <!-- <el-button>查看导出报表</el-button> -->
                        <span class="clear-search"  @click="clearSearchData">清空筛选条件</span>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- // 搜索 -->
        <!-- 表格 -->
        <el-table style="width: 100%" :data="flowingData"  highlight-current-row >
            <el-table-column prop="sheetCode" align="center" label="单据编号" width="220"></el-table-column>
            <el-table-column prop="createTime" align="center" label="制单时间" width="170">
                <template slot-scope="scope">
                    <p>{{formatTime(scope.row.createTime)}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="sheetTypeName" align="center" label="单据类型"></el-table-column>
            <el-table-column prop="goodsName" align="center" label="商品名称"></el-table-column>
            <el-table-column prop="goodsWeight" align="center" label="出入库">
              <template slot-scope="scope">
                <!-- +入库，颜色为绿色  -为出库，颜色为红色 -->
                <span v-if="scope.row.isIn" style="color:#48D362;font-weight:600">+{{scope.row.goodsWeight}}</span>
                <span v-if="!scope.row.isIn" style="color:#FF4040;font-weight:600">-{{scope.row.goodsWeight}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="stock" align="center" label="剩余量"></el-table-column>
            <el-table-column prop="costPrice" align="center" label="平均成本(元)"></el-table-column>
            <el-table-column prop="operator" align="center" label="操作人" width="220"></el-table-column>
            <el-table-column prop="operator" align="center" label="操作" width="100" v-if="$checkActionAccess($ACCESS.STOCK_INVENTORY_DETAIL_DETAIL)">
              <template slot-scope="scope">
                <el-button  type="primary" size="mini" @click="sheet_detail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
        </el-table>
        <!-- // 表格 -->
        <div class="page">
            <!--分页-->
            <el-pagination
            v-if="total_data"
                    background
                    :current-page.sync="searchData.page"
                    :page-size="searchData.pageSize"
                    layout="prev, pager, next"
                    @current-change="pageChange"
                    :total="total_data">
            </el-pagination>
            <!-- // 分页 -->
        </div>
    </div>
</template>

<script>
import searchTime from './component/searchTime'
import { formatTime } from '@/util/util.js'
export default {
  name: 'flowing',
  data () {
    return {
      operator_list: [],
      total_data: 0,
      flowingData: [], // 流水数据
      value: '',
      selectedOptions: [],
      queryData: [{}],
      options: [],
      sheetTypeData: [
        { value: 'CGRK', label: '采购入库单' },
        { value: 'CTCK', label: '采购退货出库' },
        { value: 'XSCK', label: '销售出库单' },
        { value: 'XTRK', label: '销售退货入库' },
        { value: 'QCKC', label: '期初库存' }
        // { value: "QTCK", label: "其他出库" }
      ],
      searchData: {
        goodsName: '', // 商品名称
        sheetCode: '', // 单据编码
        supplierId: '', // 供应商ID
        warehouseId: '', // 仓库ID
        operatorId: '', // 操作员ID
        startTime: '', // 制单开始时间
        endTime: '', // 制单结束时间
        page: 1, // 页码
        pageSize: 10, // 每页显示条数
        sheetType: '' // 订单类型
      }
    }
  },
  created () {
    // 从库存查询点击进入
    if (this.$route.query.goods_name) {
      let goods_name = this.$route.query.goods_name
      this.searchData.goodsName = goods_name
    }

    this.getData()
    this.getOperator()
  },
  methods: {
    formatTime: formatTime,
    // 获取数据列表
    async getData () {
      const {
        err,
        data: { data: { data, total } }
      } = await this.$service.sheetDetail.searchSheet(this.searchData)
      if (err) return
      this.flowingData = data
      this.total_data = total
    },
    // 选择商品分页
    pageChange (val, ex_port) {
      this.searchData.page = val
      this.searchData.export = ex_port || 0
      this.getData()
    },
    searchTimeChange (time) {
      // 时间组件导出数据
      this.searchData.startTime = time.startTime
      this.searchData.endTime = time.endTime
      this.pageChange(1)
    },
    // 清空筛选条件
    clearSearchData () {
      this.$refs.searchTime.clearTime()
      this.$refs.searchData.resetFields()
      this.searchData.startTime = ''
      this.searchData.endTime = ''
      this.searchData.goodsName = ''
      this.pageChange(1)
    },
    // 导出
    async exportData () {
      const { err, data: { data } } = await this.$service.exportFile.export({
        ...this.searchData,
        export: 'water'
      }) // 库存查询:inventory     流水:water
      if (err) return
      //   console.log(data)
      window.location.href = data
    },
    // 获取所有操作人
    async getOperator () {
      const {
        err,
        data: { data }
      } = await this.$service.purchase.getAllOperator()
      if (err) return
      this.operator_list = data
    },
    /** 根据单据类型点击 表格进入详情 */
    sheet_detail (val) {
      let sheetType = val.sheetType
      // id不存在，不让跳界面
      if (!val.sheetId) return false
      switch (sheetType) {
        case 1: // 采购入库单
          this.$router.push({
            path:
              '/purchase/warehousing/warehousingSingleDetails/' + val.sheetId
          })
          break
        case 2: // 采购退货出库
          this.$router.push({
            path:
              '/purchase/returnGoodsOutgoing/returnGoodsOutgoingDetails/' +
              val.sheetId
          })
          break
        case 3: // 销售出库单
          this.$router.push({
            path: '/stock/outgoing/outgoingInfo/' + val.sheetId + '/2'
          })
          break
        case 4: // 销售退货入库
          this.$router.push({
            path: '/stock/storage/storageInfo/' + val.sheetId
          })
          break
        case 5: // 期初库存
          this.$router.push({
            path: 'stock/start/startInfo?id=' + val.sheetId
          })
          break
      }
    }
  },
  components: {
    searchTime
  }
}
</script>

<style scoped>
.module-box {
  /*padding: 15px;*/
  /*background-color: #ffffff;*/
}
.search-box {
  background-color: #FFF;
  padding-top: 15px;
  margin-bottom: 10px;
}
.form-item-input-w {
  width: 100px;
}
.clear-search {
  color: #38f;
  cursor: pointer;
  margin-left: 10px;
}
.page {
  text-align: center;
  padding: 10px;
}
</style>
