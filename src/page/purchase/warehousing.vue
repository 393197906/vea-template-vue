<template>
  <div class="module-box">
    <el-button
      type="primary"
      size="small"
      v-if="$checkActionAccess($ACCESS.PURCHASE_BILL_ADD)"
      @click="$router.push({path: '/purchase/warehousing/newWarehousing'})"
      class="return-goods-btn">采购入库
    </el-button>
    <div class="search-box">
      <!-- 搜索 -->
      <div class="search-box">
        <el-form ref="form" inline size="small">
          <el-form-item label-width="100px" label="商品名称：">
            <el-input placeholder="请输入商品名称" v-model="searchData.goodsName" @keyup.enter.native="pageChange(1)">
            </el-input>
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
              <el-input v-model="searchData.sheetCode" placeholder="请输入单据编号"
                        @keyup.enter.native="pageChange(1)"></el-input>
            </el-form-item>
            <el-form-item label-width="100px" label="操作人：">
              <el-select v-model="searchData.operatorId" @change="pageChange(1)" placeholder="请选择" style="width: 150px">
                <el-option
                  v-for="item in operatorList"
                  :key="item.id"
                  :label="item.user_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商名称：" label-width="100px">
              <el-select v-model="searchData.supplierId" @change="pageChange(1)" placeholder="请选择" style="width: 150px">
                <el-option
                  v-for="item in supplierData"
                  :key="item.id"
                  :label="item.supplierName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="仓库：" label-width="100px">
              <el-select v-model="searchData.warehouseId" @change="pageChange(1)" filterable placeholder="请选择">
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
              <el-button type="primary" @click="pageChange(1)">筛选</el-button>
              <el-button type="primary" size="small" plain icon="el-icon-upload2" @click="exportData"  v-if="$checkActionAccess($ACCESS.PURCHASE_BILL_EXPORT)">导出</el-button>
              <!--<el-button>导出</el-button>-->
              <!--<el-button>查看导出报表</el-button>-->
              <span class="clear-search" @click="clearSearchData">清空筛选条件</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- // 搜索 -->
    </div>
    <!-- 数据表格 -->
    <el-table style="width: 100%" :data="orderList">
      <el-table-column prop="sheetCode" align="center" label="单据编号"></el-table-column>
      <el-table-column prop="warehouseName" align="center" label="仓库">
      </el-table-column>
      <el-table-column prop="supplier" align="center" label="供应商">
      </el-table-column>
      <el-table-column prop="createTime" align="center" label="制单时间">
        <!--<template slot-scope="scope">
          <p>{{formatTime(scope.row.createTime)}}</p>
        </template>-->
      </el-table-column>
      <el-table-column prop="operator" align="center" label="操作人">
      </el-table-column>
      <el-table-column prop="mark" align="center" label="备注"></el-table-column>
      <el-table-column prop="date" align="center" label="操作" v-if="$checkActionAccess($ACCESS.PURCHASE_BILL_DETAIL)">
        <template slot-scope="scope">
          <el-button type="primary" size="mini"
                     @click="$router.push({path: '/purchase/warehousing/warehousingSingleDetails/' + scope.row.id})">详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page" v-if="orderList.length > 0">
      <!--分页-->
      <el-pagination
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
import {formatTime} from '@/util/util.js'

const searchData = {
  page: 1,
  pageSize: 10,
  total: 0,
  goodsName: '', // 商品名称
  sheetCode: '', // 单据编码
  supplierId: '', // 供应商id
  warehouseId: '', // 仓库id
  operatorId: '', // 操作人id
  startTime: '', // 制单开始时间
  endTime: '' // 制单结束时间
}
export default {
  name: 'warehousing',
  data () {
    return {
      warehouseData: [], // 所有仓库数据
      supplierData: [], // 所有供应商数据
      operatorList: [], // 获取所有操作人列表
      searchData: { // 搜索条件
        page: 1,
        pageSize: 10,
        total: 0,
        goodsName: '', // 商品名称
        sheetCode: '', // 单据编码
        supplierId: '', // 供应商id
        warehouseId: '', // 仓库id
        operatorId: '', // 操作人id
        startTime: '', // 制单开始时间
        endTime: '' // 制单结束时间
      },
      orderList: [], // 单据列表
      value: ''
    }
  },
  methods: {
    formatTime: formatTime,
    searchTimeChange (time) {
      // 时间组件导出数据
      this.searchData.endTime = time.endTime
      this.searchData.startTime = time.startTime
      this.pageChange(1)
    },
    // 获取所有仓库
    async getAllWarehouseName () {
      const {err, data: {data: {data}}} = await this.$service.stock.getAllWarehouseName({from: 1})
      if (err) return
      this.warehouseData = data
    },
    // 获取所有操作人列表
    async getAllOperator () {
      const {err, data: {data}} = await this.$service.purchase.getAllOperator()
      if (err) return
      this.operatorList = data
    },
    // 获取所有供应商
    async getAllSupplierData () {
      const {err, data: {data: {data}}} = await this.$service.purchase.getAllSupplierData()
      if (err) return
      this.supplierData = data
    },
    // 导出
    async exportData () {
      this.loading = true
      const {err, data} = await this.$service.purchase.getAllPurchaseSheet({...this.searchData, pageSize: 3000})
      if (err) return
      this.loading = false
      if (!data.data.data.length) {
        this.$message.warning('没有需要导出的数据')
        return
      }
      const json2excel = await import('yt-json2excel/src/index')
      let temp = []
      data.data.data.forEach(item => {
        const tmp = item.goodsInfo.map((i, index) => {
          return {
            createTime: index === 0 ? this.$formatTime(item.createTime) : '',
            commitTime: index === 0 ? this.$formatTime(item.createTime) : '',
            operator: index === 0 ? item.operator : '',
            supplier: index === 0 ? item.supplier : '',
            warehouseName: index === 0 ? item.warehouseName : '',
            freightCharge: index === 0 ? item.freightCharge : '',
            mark: index === 0 ? item.mark : '',
            unit: i.unit,
            price: i.price,
            totalMoney: i.totalMoney,
            goodsWeight: i.goodsWeight,
            goodsName: i.goodsName
          }
        })
        temp = [...temp, ...tmp]
      })
      json2excel.default('订单列表', temp, [{
        commitTime: '入库日期',
        operator: '操作人',
        supplier: '供应商',
        createTime: '制单时间',
        warehouseName: '仓库',
        freightCharge: '运费/装卸费',
        mark: '备注',
        goodsName: '商品名称',
        unit: '单位',
        price: '采购价(元)',
        goodsWeight: '采购量',
        totalMoney: '小计(元)'
      }])
    },
    // 获取列表数据
    async getDataList () {
      const {err, data: {data: {data, total}}} = await this.$service.purchase.getAllPurchaseSheet(this.searchData)
      if (err) return
      this.searchData.total = total
      this.orderList = data
    },
    // 分页change
    pageChange (val) {
      this.searchData.page = val
      this.getDataList()
    },
    // 清空筛选条件
    clearSearchData () {
      this.$refs.searchTime.clearTime()
      for (let i in searchData) {
        this.searchData[i] = searchData[i]
      }
      this.getDataList()
    }
  },
  created () {
    this.getAllWarehouseName() // 获取所有仓库
    this.getAllSupplierData() // 获取所有供应商列表
    this.getAllOperator() // 获取所有操作人列表
    this.getDataList()
  },
  activated () {
    this.getDataList()
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

  .clear-search {
    color: #38f;
    cursor: pointer;
    margin-left: 10px;
  }

  .form-item-input-w {
    width: 100px;
  }

  .page {
    text-align: center;
    padding: 10px;
  }

  .return-goods-btn {
    margin-bottom: 20px;
  }
</style>
