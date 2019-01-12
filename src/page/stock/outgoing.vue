<template>
    <div class="module-box">
        <!-- <el-button
                type="primary"
                size="small"
                @click="$router.push({path: '/stock/outgoing/newOutgoing'})"
                class="return-goods-btn">新建出库
        </el-button> -->
        <!-- 搜索 -->
        <div class="search-box">
            <el-form ref="searchData" :model="searchData" inline size="small">
                <el-form-item label-width="100px" label="商品名称：" prop="goodsName">
                    <el-input placeholder="商品名称 支持模糊查询" v-model="searchData.goodsName" @keyup.enter.native="pageChange(1)"></el-input>
                </el-form-item>
              <el-form-item label="销售订单" prop="orderNo">
                <el-input placeholder="销售订单号 支持模糊查询" size="mini" v-model="searchData.orderNo"></el-input>
              </el-form-item>
              <el-form-item label="负责人" prop="buyer">
                <el-input placeholder="负责人 支持模糊查询" size="mini" v-model="searchData.buyer"></el-input>
              </el-form-item>
              <el-form-item label="负责人电话" prop="mobile">
                <el-input placeholder="负责人电话 支持模糊查询" size="mini" v-model="searchData.mobile"></el-input>
              </el-form-item>
              <!--<el-form-item label="客户手机" prop="mobile">-->
                <!--<el-input placeholder="请输入客户手机 支持模糊查询" size="mini" v-model="searchWarehouse.mobile"></el-input>-->
              <!--</el-form-item>-->
                <div>
                    <searchTime
                            label="制单时间"
                            ref="searchTime"
                            @searchTimeChange="searchTimeChange">
                    </searchTime>
                </div>
                <div>
                    <el-form-item label-width="100px" label="操作人：" prop="supplierId">
                        <el-select v-model="searchData.operatorId" @change="pageChange(1)" placeholder="请选择" style="width: 150px">
                            <el-option
                                    v-for="item in operatorList"
                                    :key="item.id"
                                    :label="item.user_name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出库单号："  prop="sheetCode">
                        <el-input v-model="searchData.sheetCode" placeholder="请输入出库单号" @keyup.enter.native="pageChange(1)"></el-input>
                    </el-form-item>
                </div>
                <div v-if="searchData.status === '1' ? false : true">
                    <el-form-item label="仓库：" label-width="100px" prop="warehouseId">
                        <el-select clearable  v-model="searchData.warehouseId" @change="pageChange(1)" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in warehouseData"
                                    :key="item.id"
                                    :label="item.warehouseName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label-width="100px" label=" " >
                        <el-button type="primary" @click="pageChange(1)">筛选</el-button>
                        <span class="clear-search" @click="clearSearchData">清空筛选条件</span>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- // 搜索 -->
        <el-tabs v-model="searchData.status" type="card" @tab-click="getDataList">
          <el-tab-pane label="未出库" name="1">
            </el-tab-pane>
            <el-tab-pane label="已出库" name="2">
            </el-tab-pane>

        </el-tabs>
        <!-- 表格 -->
        <el-table style="width: 100%" :data="outgoingList"  v-loading="loading">
            <el-table-column prop="sheetCode" align="center" label="单据编号" >
            </el-table-column>
            <el-table-column prop="warehouseName" align="center" label="仓库" v-if="searchData.status === '1' ? false : true">
            </el-table-column>
            <!--<el-table-column prop="date" align="center" label="出库类型" >-->
            <!--<template slot-scope="scope">-->
            <!--<p>其他出库单—领用</p>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="date" align="center" label="制单时间" >
                <template slot-scope="scope">
                    <p>{{formatTime(scope.row.createTime)}}</p>
                </template>
            </el-table-column>
          <el-table-column prop="buyer" align="center" label="客户" />
          <el-table-column prop="mobile" align="center" label="客户电话" />
          <el-table-column prop="orderNo" align="center" label="销售订单号" />
          <el-table-column prop="operator" align="center" label="操作人" >
            </el-table-column>
            <el-table-column prop="mark" align="center" label="备注" >
            </el-table-column>
            <el-table-column prop="date" align="center" label="操作"   v-if="$checkActionAccess($ACCESS.SELL_DETAIL)">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"
                               @click="$router.push({path: `/stock/outgoing/outgoingInfo/${scope.row.id}/${searchData.status}`})">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- // 表格 -->
        <div class="page" v-if="outgoingList.length !== 0">
            <!--分页-->
            <el-pagination
                    v-if="searchData.total"
                    background
                    :page-size.sync="searchData.pageSize"
                    layout="prev, pager, next"
                    @current-change="pageChange"
                    :total="searchData.total">
            </el-pagination>
            <!-- // 分页 -->
        </div>
    </div>
</template>

<script>
import searchTime from './component/searchTime'
import { formatTime } from '@/util/util.js'

export default {
  name: 'outgoing',
  data () {
    return {
      warehouseData: [], // 所有仓库数据
      searchData: {
        // 搜索条件
        page: 1,
        pageSize: 10,
        total: 0,
        status: '1', // 未出库1 已出库2
        goodsName: '', // 商品名称
        sheetCode: '', // 单据编码   ---- 出库单号 （疑问）
        // 出库类型
        warehouseId: '', // 仓库id
        operatorId: '', // 操作人id
        startTime: '', // 制单开始时间
        endTime: '', // 制单结束时间
        supplierId: '', // 供应商ID
        orderNo: '', // 销售订单号
        buyer: '', // 客户名
        mobile: '' // 客户电话
      },

      operatorList: [], // 获取所有操作人列表
      outgoingList: [], // 列表数据
      value: '',
      loading: true
    }
  },
  methods: {
    formatTime: formatTime,
    // 分页change
    pageChange (val) {
      this.searchData.page = val
      this.getDataList()
    },
    // 搜索条件时间回调
    searchTimeChange (time) {
      // 时间组件导出数据
      this.searchData.startTime = time.startTime
      this.searchData.endTime = time.endTime
      this.pageChange(1)
    },
    // 获取列表数据
    async getDataList () {
      this.loading = true
      const {
        err,
        data: { data: { data, total } }
      } = await this.$service.outgoing.getAllSell(this.searchData)
      if (err) return
      this.loading = false
      this.outgoingList = data
      this.searchData.total = total
    },
    // 清空筛选条件
    clearSearchData () {
      this.$refs.searchTime.clearTime()
      this.$refs.searchData.resetFields()
      this.searchData.startTime = ''
      this.searchData.endTime = ''
      this.searchData.operatorId = ''
      this.getDataList()
    },

    // 获取所有仓库
    async getAllWarehouseName () {
      const {
        err,
        data: { data: { data } }
      } = await this.$service.stock.getAllWarehouseName({ from: 1 })
      if (err) return
      this.warehouseData = data
    },
    // 获取所有操作人列表
    async getAllOperator () {
      const {
        err,
        data: { data }
      } = await this.$service.purchase.getAllOperator()
      if (err) return
      this.operatorList = data
    }
  },
  activated () {
    this.getDataList()
    this.getAllWarehouseName() // 获取全部仓库
    this.getAllOperator() // 获取所有操作人
  },
  created () {
    this.getDataList()
    this.getAllWarehouseName() // 获取全部仓库
    this.getAllOperator() // 获取所有操作人
  },
  components: {
    searchTime
  }
}
</script>

<style scoped>
.module-box {
  padding: 15px;
  background-color: #ffffff;
}

.search-box {
  background-color: #f8f8f8;
  padding-top: 15px;
  margin-bottom: 15px;
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

/*
            搜索时间选择
        */
.search-time-item {
  margin-left: 10px;
  padding: 2px 4px;
  border: 1px solid #e5e5e5;
  cursor: pointer;
  color: #bbb;
  font-size: 12px;
}

.search-time-item:hover,
.search-time-item.active {
  color: #38f;
  border-color: #38f;
}

.return-goods-btn {
  margin-bottom: 20px;
}
</style>
