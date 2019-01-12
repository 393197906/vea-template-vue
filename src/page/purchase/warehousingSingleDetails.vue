<template>
    <div class="module-box">
        <div>
            <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
                <div class="module-form-box">
                    <div class="module-form-item">
                        <el-form-item label="单据编号：" prop="name">
                            <p>{{warehousingData.sheetCode}}</p>
                        </el-form-item>
                        <el-form-item label="供应商：" prop="name">
                            <p>{{warehousingData.supplierName}}</p>
                        </el-form-item>
                        <el-form-item label="运费/装卸费：" prop="name">
                            <p style="width: 200px">{{warehousingData.freightCharge}}</p>
                        </el-form-item>
                    </div>
                    <div class="module-form-item">
                        <el-form-item label="入库日期：" prop="name">
                            <p>{{formatTime(warehousingData.commitTime)}}</p>
                        </el-form-item>
                        <el-form-item label="制单时间：" prop="name">
                            <p>{{formatTime(warehousingData.createTime)}}</p>
                        </el-form-item>
                        <el-form-item label="备注：" prop="name">
                            <p style="width: 200px">{{warehousingData.mark}}</p>
                        </el-form-item>
                    </div>
                    <div class="module-form-item">
                        <el-form-item label="操作人：" prop="name">
                            <p>{{warehousingData.operatorName}}</p>
                        </el-form-item>
                        <el-form-item label="仓库：" prop="name">
                            <p>{{warehousingData.warehouseName}}</p>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <!--<div class="table-info">-->
            <!--<p>共 0 件商品，合计金额 0.00 元。</p>-->
        <!--</div>-->
        <!-- 表格 -->
        <el-table style="width: 100%" :data="queryData">
            <el-table-column prop="date" align="center" label="商品名称" width="250">
                <template slot-scope="scope">
                    <div class="table-list-box">
                        <div style="width: 60px; height: 60px">
                            <img :src="scope.row.picture.pic_cover_small"
                                 alt=""
                                 style="max-width: 100%; max-height: 100%">
                        </div>
                        <div class="goods-info-box">
                            <p class="goods-title">{{scope.row.goodsName}} </p>
                            <p class="goods-no">{{scope.row.goodsId}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <!--<el-table-column prop="date" align="center" label="规格" width="250"></el-table-column>-->
            <el-table-column prop="date" align="center" label="单位" width="250">
                <template slot-scope="scope">
                    <div>
                        KG
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="price" align="center" :label="status ? '采购价(元)' : '成本价'" width="250"></el-table-column>
          <el-table-column prop="costMoney" align="center" label="平均成本" width="250"></el-table-column>
            <el-table-column prop="goodsWeight" align="center" :label="status ? '采购量' : '退货重量'" width="250"></el-table-column>
            <el-table-column prop="date" align="center" label="小计(元)">
                <template slot-scope="scope">
                    <div>
                        {{(scope.row.price * scope.row.goodsWeight).toFixed(2)}}
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- // 表格 -->
    </div>
</template>

<script>
import {formatTime} from '@/util/util.js'
export default {
  name: 'warehousing-single-details',
  data () {
    return {
      warehousingData: {}, // 详情
      queryData: [],
      status: false // true == 采购入库  false == 采退出库
    }
  },
  methods: {
    formatTime: formatTime,
    // 获取详情
    async getData (id, api) {
      const {err, data: {data}} = await this.$service.purchase[api]({id: id})
      if (err) return
      console.log(data)
      this.warehousingData = data[0]
      this.queryData = data[0].goodsInfo
    }
  },
  created () {
    if (this.$route.meta.title === '采退出库单详情') {
      // getPurchaseReturnInfo
      this.getData(this.$route.params.id, 'getPurchaseReturnInfo')
      this.status = false
    } else {
      this.getData(this.$route.params.id, 'getPurchaseSheetInfo')
      this.status = true
    }
  }
}
</script>

<style scoped>
    .module-box {
        padding: 15px;
        background-color: #ffffff;
    }
    .module-form-box {
        width: 80%;
        display: flex;
        justify-content: space-between;
    }
    .table-info {
        color: #333;
        font-size: 12px;
        line-height: 2;
        font-weight: 700;
    }

    .table-list-box {
        display: flex;
        font-size: 12px;
    }
    .table-list-box .goods-info-box{
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 10px;
    }
    .table-list-box .goods-info-box p {
        text-align: left;
    }
</style>
