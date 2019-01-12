<template>
  <div class="module-box">
    <!-- 搜索 -->
    <div class="search-box">
      <el-form ref="searchData" :model="searchData" inline size="small">
        <!--<el-form-item label-width="100px" label="商品筛选：">-->
        <!--<el-select v-model="value" placeholder="请选择" class="form-item-input-w">-->
        <!--<el-option value="1" label="商品名称"></el-option>-->
        <!--<el-option value="0" label="商品条码"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label-width="100px" label="商品名称：" prop="goodsName">
          <el-input placeholder="请输入商品名称" v-model="searchData.goodsName"
                    @keyup.enter.native="handleCurrentChange(1)"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="仓库：" prop="warehouseId">
          <el-select v-model="searchData.warehouseId" filterable clearable @change="handleCurrentChange(1)"
                     placeholder="请选择">
            <el-option
              v-for="item in warehouseData"
              :key="item.id"
              :label="item.warehouseName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="商品分类：">
            <el-cascader
              class="input"
              placeholder="请选择商品分类"
              :options="category_list"
              :props="category_props"
              v-model="searchData.goods_category"
            >
            </el-cascader>
        </el-form-item>
        <el-form-item label-width="100px" label="首选供应商：">
            <el-select v-model="searchData.supplierId" filterable placeholder="请选择">
                <el-option v-for="item in supplier_list" :key="item.id" :value="item.id" :label="item.supplierName"></el-option>
            </el-select>
        </el-form-item> -->
        <div>
          <el-form-item label-width="100px" label=" ">
            <el-button type="primary" @click="handleCurrentChange(1)">筛选</el-button>

            <el-button @click="exportData"  v-if="$checkActionAccess($ACCESS.STOCK_INVENTORY_EXPORT)">导出</el-button>
            <!-- <el-button>查看导出报表</el-button> -->
            <span class="clear-search" @click="clearSearchData">清空筛选条件</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- // 搜索 -->
    <div style="padding: 10px;text-align: right"><span>总商品数:{{ title_data.totalGoodsNum }}</span><span style="margin-left:15px">总重量:{{ title_data.totalStock }}</span><span style="margin-left:15px">总成本价值:{{ title_data.totalCostMoney }}</span></div>
    <!-- 表格 -->
    <el-table style="width: 100%" :data="goods_list">
      <el-table-column prop="date" align="center" label="商品名称">
        <template slot-scope="scope">
          <div class="table-list-box">
            <div style="width: 60px; height: 60px">
              <img :src="scope.row.picture.pic_cover_small"
                   style="max-width: 100%; max-height: 100%">
            </div>
            <div class="goods-info-box">
              <p class="goods-title">{{scope.row.goodsName}}</p>
              <p class="goods-no">{{scope.row.goodsId}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseName" align="center" label="仓库"></el-table-column>
      <el-table-column prop="util" align="center" label="库存单位">
        <template slot-scope="scope">
          KG
        </template>
      </el-table-column>

      <el-table-column prop="stock" align="center" label="可售库存"></el-table-column>
      <el-table-column prop="lockStock" align="center" label="占用库存"></el-table-column>
      <el-table-column prop="costPrice" align="center" label="平均成本(元)"></el-table-column>
      <el-table-column prop="totalMoney" align="center" label="总成本(元)"></el-table-column>
      <el-table-column prop="date" align="center" label="操作" v-if="$checkActionAccess($ACCESS.STOCK_INVENTORY_DETAIL)">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" @click="dialogVisible = true">库存分布</el-button> -->
          <el-button size="mini" type="warning"
                     @click="$router.push({path: '/stock/flowing',query:{goods_id:scope.row.id, goods_name: scope.row.goodsName}})">
            库存流水
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- // 表格 -->
    <div class="page">
      <!--分页-->

      <el-pagination
        v-if="total_data"
        @current-change="handleCurrentChange"
        :current-page.sync="searchData.page"
        :page-size="searchData.pageSize"
        background
        layout="prev, pager, next"
        :total="total_data">
      </el-pagination>
      <!-- // 分页 -->
    </div>
    <!-- 库存分布dialog -->
    <el-dialog
      title="库存分布"
      :visible.sync="dialogVisible"
      width="900px">
      <div class="dialog-goods-box">
        <!-- 产品图片 名称 编号-->
        <div class="goods-info">
          <div class="goods-img">
            <img
              src="//img.yzcdn.cn/upload_files/2017/11/22/c201e229fb76e3282c90f01d09e0e144.jpg?imageView2/2/w/120/h/120/q/100/format/jpg"
              alt="">
          </div>
          <div class="goods-info-box">
            <p class="goods-title">
              农夫山泉 饮用天然水550ml
            </p>
            <p class="goods-no">

            </p>
          </div>
        </div>
        <!-- 单位 规格 -->
        <div class="goods-company">
          <p>单位：件</p>
        </div>
        <!-- 筛选 -->
        <div class="goods-company">
          <el-checkbox v-model="checked">仅显示有库存</el-checkbox>
        </div>
      </div>
      <el-table style="width: 100%" :data="queryData">
        <el-table-column prop="date" align="center" label="仓库名称">
          <template slot-scope="scope">
            <p>顶顶顶</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" align="center" label="实物库存" width="115">
          <template slot-scope="scope">
            <p>顶顶顶</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" align="center" label="占用库存" width="115">
          <template slot-scope="scope">
            <p>12</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" align="center" label="可售库存" width="110">
          <template slot-scope="scope">
            <p>2</p>
          </template>
        </el-table-column>
        <!--<el-table-column prop="date" align="center" label="在途库存" width="110">-->
        <!--<template slot-scope="scope">-->
        <!--<p>1</p>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="date" align="center" label="平均成本(元)" width="115">
          <template slot-scope="scope">
            <p>212</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" align="center" label="总成本(元)" width="115">
          <template slot-scope="scope">
            <p>12</p>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
            </span>
    </el-dialog>
    <!-- // 库存分布dialog -->
  </div>
</template>

<script>
export default {
  name: 'query',
  data () {
    return {
      searchData: {
        goodsName: '',
        warehouseId: '',
        page: 1,
        pageSize: 10
        //  goods_category: [], //商品分类
        //  supplierId:""
      },
      category_list: [],
      category_props: {
        value: 'category_id',
        label: 'category_name',
        children: 'children'
      },
      warehouseData: [], // 所有仓库
      queryData: [{}],
      dialogVisible: false,

      total_data: 1,
      title_data: '',
      goods_list: [], // 商品列表
      supplier_list: [], // 所有供应商
      checked: ''
    }
  },
  activated () {
    this.getData() // 商品流水列表
    this.getAllSupplierData() // 供应商
    this.getAllWarehouseName() // 仓库
    this.getCategory() // 商品分类
  },
  async created () {
    this.getTitleData()
    this.getData() // 商品流水列表
    this.getAllSupplierData() // 供应商
    this.getAllWarehouseName() // 仓库
    this.getCategory() // 商品分类
  },
  methods: {
    // 获取标题数据
    async getTitleData () {
      const {
        err,
        data
      } = await this.$service.stock.stockTitleData()
      if (err) return
      this.title_data = data.data
    },
    // 分页
    handleCurrentChange (page) {
      this.searchData.page = page
      this.getData()
    },
    // 导出
    async exportData () {
      const {
        err,
        data: {data}
      } = await this.$service.exportFile.export({...this.searchData, export: 'inventory'}) // 库存查询:inventory     流水:water
      if (err) return
      // console.log(data)
      window.location.href = data
    },
    // 清空筛选条件
    clearSearchData () {
      this.$refs.searchData.resetFields()
      this.handleCurrentChange(1)
    },
    // 获取列表数据
    async getData () {
      const {
        err,
        data: {data: {data, total}}
      } = await this.$service.searchStock.getAllInventory(this.searchData)
      if (err) return

      this.goods_list = data
      this.total_data = total
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
    // 获取所有供应商
    async getAllSupplierData () {
      const {
        err,
        data: {data: {data}}
      } = await this.$service.purchase.getAllSupplierData()
      if (err) return

      this.supplier_list = data
    },
    // 商品分类
    async getCategory () {
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.category_list()
      if (err) return
      this.category_list = data.result
    }
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

  .table-list-box {
    display: flex;
    font-size: 12px;
  }

  .table-list-box .goods-info-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
  }

  .goods-title {
    color: #666666;
    text-align: left;
  }

  .goods-no {
    color: rgb(153, 153, 153);
    text-align: left;
  }

  .page {
    text-align: center;
    padding: 10px;
  }

  /*
          dialog 产品信息
      */
  .dialog-goods-box {
    height: 60px;
    padding: 8px;
    border: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
  }

  .dialog-goods-box .goods-info {
    height: 60px;
    display: flex;
  }

  .dialog-goods-box .goods-info img {
    max-height: 60px;
    max-width: 60px;
  }

  .dialog-goods-box .goods-info .goods-img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    text-align: center;
  }

  .goods-info .goods-info-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .goods-company {
    line-height: 60px;
  }
</style>
