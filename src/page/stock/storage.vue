<template>
    <div class="module-box">
        <el-button
                type="primary"
                size="small"
                v-if="$checkActionAccess($ACCESS.SELL_RETURN_ADD)"
                @click="$router.push({path: '/stock/storage/newStorage'})"
                class="return-goods-btn">退货入库</el-button>
        <!-- 搜索 -->
        <div class="search-box">
            <el-form ref="form" inline size="small">
                <!--<el-form-item label-width="100px" label="商品筛选：">-->
                    <!--<el-select v-model="value" placeholder="请选择" class="form-item-input-w">-->
                        <!--<el-option value="1" label="商品名称"></el-option>-->
                        <!--<el-option value="0" label="商品条码"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label-width="100px" label="商品名称：">
                    <el-input placeholder="请输入商品名称" v-model="searchData.goodsName" @keyup.enter.native="handleCurrentChange(1)"/>
                </el-form-item>
                <div>
                    <searchTime
                            label="制单时间"
                            ref="searchTime"
                            @searchTimeChange="searchTimeChange">
                    </searchTime>
                </div>
                <div>
                    <el-form-item label-width="100px" label="单据编号：">
                        <el-input placeholder="请输入单据号" v-model="searchData.sheetCode" @keyup.enter.native="handleCurrentChange(1)"></el-input>
                    </el-form-item>
                    <el-form-item label-width="100px" label="操作人：">
                        <el-select v-model="searchData.operatorId" @change="handleCurrentChange(1)" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in operatorList"
                                    :key="item.id"
                                    :label="item.user_name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item label="供应商名称：">-->
                        <!--<el-select v-model="searchData.supplierId" @change="handleCurrentChange(1)" filterable placeholder="请选择">-->
                            <!--<el-option-->
                                    <!--v-for="item in supplierData"-->
                                    <!--:key="item.id"-->
                                    <!--:label="item.supplierName"-->
                                    <!--:value="item.id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-form-item>-->
                </div>
                <div>
                    <el-form-item label="仓库：" label-width="100px">
                        <el-select v-model="searchData.warehouseId" @change="handleCurrentChange(1)" filterable placeholder="请选择">
                            <el-option
                                    v-for="(item, index) in warehouseData"
                                    :key="item.id"
                                    :label="item.warehouseName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label-width="100px" label=" ">
                        <el-button type="primary" @click="handleCurrentChange(1)">筛选</el-button>
                        <!--<el-button>导出</el-button>-->
                        <!--<el-button>查看导出报表</el-button>-->
                        <span class="clear-search" @click="clearSearchData">清空筛选条件</span>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!-- // 搜索 -->
        <!-- 表格 -->
        <el-table style="width: 100%" :data="queryData">
          <el-table-column  align="center" label="单据编号">
              <template slot-scope="scope">
                {{scope.row.sheetCode}}
              </template>
            </el-table-column>
            <el-table-column prop="warehouseName" align="center" label="仓库">
            </el-table-column>
            <!--<el-table-column prop="date" align="center" label="供应商">-->
                <!--<template slot-scope="scope">-->
                    <!--{{scope.row.supplierId}}-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="date" align="center" label="制单时间">
                <template slot-scope="scope">
                  {{formatTime(scope.row.createTime)}}
                </template>
            </el-table-column>
          <el-table-column prop="buyer" align="center" label="负责人"/>
            <el-table-column prop="mobile" align="center" label="负责人电话"/>
              <el-table-column prop="orderNo" align="center" label="订单号"/>
            <el-table-column prop="operator" align="center" label="操作人" />
            <el-table-column prop="mark" align="center" label="备注">
            </el-table-column>
            <el-table-column prop="date" align="center" label="操作"  v-if="$checkActionAccess($ACCESS.SELL_RETURN_DETAIL)">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="$router.push({path: '/stock/storage/storageInfo/' + scope.row.id})">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- // 表格 -->
        <div class="page" v-if="queryData.length !== 0">
            <!--分页-->
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="searchData.page"
            :page-size="searchData.page_size"
            background
            layout="prev, pager, next"
            :total="total_data">
          </el-pagination>
            <!-- // 分页 -->
        </div>
    </div>
</template>

<script>
import {formatTime} from '@/util/util.js'
import searchTime from './component/searchTime'
const searchData = {
  goodsName: '',
  sheetCode: '',
  supplierId: '',
  warehouseId: '',
  operatorId: '',
  startTime: '',
  endTime: '',
  page: 1,
  pageSize: 10
}
export default {
  name: 'storage',
  data () {
    return {
      warehouseData: [], // 所有仓库数据
      operatorList: [], // 获取所有操作人列表
      supplierData: [], // 所有供应商数据
      searchData: {
        goodsName: '',
        sheetCode: '',
        supplierId: '',
        warehouseId: '',
        operatorId: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10
      },
      total_data: 0,
      queryData: []
    }
  },
  activated () {
    this.getSellReturnList()
    this.getAllWarehouseName() // 获取全部仓库
    this.getAllOperator() // 获取所有操作人
    this.getAllSupplierData() // 获取所有供应商
  },
  created () {
    this.getSellReturnList()
    this.getAllWarehouseName() // 获取全部仓库
    this.getAllOperator() // 获取所有操作人
    this.getAllSupplierData() // 获取所有供应商
  },
  methods: {
    formatTime: formatTime,
    // 分页
    handleCurrentChange (val) {
      this.page = val
      this.getSellReturnList()
    },
    // 时间组件导出数据
    searchTimeChange (time) {
      this.searchData.startTime = time.startTime
      this.searchData.endTime = time.endTime
      this.handleCurrentChange(1)
    },
    async getSellReturnList () {
      const {err, data} = await this.$service.purchase.getAllReturn(this.searchData)
      if (err) return
      if (parseInt(data.status) === 200) {
        this.queryData = data.data.data
        this.total_data = data.data.total
      } else {
        this.$Message.error(data.message)
      }
    },
    // 获取所有仓库
    async getAllWarehouseName () {
      const {
        err,
        data: {data: {data}}
      } = await this.$service.stock.getAllWarehouseName({from: 1})
      if (err) return
      this.warehouseData = data
    },
    // 获取所有操作人列表
    async getAllOperator () {
      const {
        err,
        data: {data}
      } = await this.$service.purchase.getAllOperator()
      if (err) return
      this.operatorList = data
    },
    // 获取所有供应商
    async getAllSupplierData () {
      const {err, data: {data: {data}}} = await this.$service.purchase.getAllSupplierData()
      if (err) return
      this.supplierData = data
    },
    // 清空筛选条件
    clearSearchData () {
      this.$refs.searchTime.clearTime()
      for (let i in searchData) {
        this.searchData[i] = searchData[i]
      }
      this.handleCurrentChange(1)
    }
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

    .return-goods-btn {
        margin-bottom: 20px;
    }
</style>
