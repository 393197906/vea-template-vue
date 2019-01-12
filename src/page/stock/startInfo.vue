<template>
    <div class="module-box">
        <div>
            <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" inline>
                <div class="module-form-item">
                    <el-form-item label="单据编号：" prop="name">
                        <p>{{warehouseDetail.sheetCode}}</p>
                    </el-form-item>
                    <el-form-item label="制单日期：" prop="name">
                        <p>{{formatTime(warehouseDetail.createTime)}}</p>
                    </el-form-item>
                    <el-form-item label="操作人：" prop="name">
                        <p>{{warehouseDetail.operatorName}}</p>
                    </el-form-item>
                </div>
                <div class="module-form-item">
                    <el-form-item label="仓库：" prop="name">
                        <p>{{warehouseDetail.warehouseName}}</p>
                    </el-form-item>
                </div>
                <div class="module-form-item">
                    <el-form-item label="备注：" prop="name">
                        <p style="width: 200px">{{warehouseDetail.mark}}</p>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="table-info">
            <!-- <p>合计金额 0.00 元。</p> -->
        </div>
        <!-- 表格 -->
        <el-table style="width: 100%" :data="goodsInfo">
            <el-table-column prop="goods" align="center" label="商品名称">
                <template slot-scope="scope">
                    <div class="table-list-box">
                        <div style="width: 60px; height: 60px">
                            <img :src="scope.row.goodsPicture.image.pic_cover_small"
                                 alt=""
                                 style="max-width: 100%; max-height: 100%">
                        </div>
                        <div class="goods-info-box">
                            <p class="goods-title">{{scope.row.goodsPicture.goods_name}} </p>
                            <p class="goods-no">{{scope.row.goodsId}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="unit" align="center" label="单位">
                <template slot-scope="scope">
                    KG
                </template>
            </el-table-column>
            <el-table-column prop="goodsWeight" align="center" label="期初库存数量">
                 <template slot-scope="scope">
                    {{scope.row.goodsWeight}}
                </template>
            </el-table-column>
            <el-table-column prop="price" align="center" label="期初成本（元）">
                <template slot-scope="scope">
                    {{scope.row.price}}
                </template> </el-table-column>
            <el-table-column prop="date" align="center" label="小计(元)">
                <template slot-scope="scope">
                    {{scope.row.price*scope.row.goodsWeight}}
                </template>
            </el-table-column>
        </el-table>
        <!-- // 表格 -->
    </div>
</template>

<script>
import { formatTime } from '@/util/util.js'

export default {
  name: 'start-info',
  data () {
    return {
      Warehouse_id: '',
      warehouseDetail: {},
      goodsInfo: []
    }
  },
  created () {
    if (this.$route.query.id) {
      this.Warehouse_id = this.$route.query.id
      this.getWarehouseDetail()
    }
  },
  methods: {
    formatTime: formatTime,
    // 获取期初库存详情
    async getWarehouseDetail () {
      const {
        err,
        data: { data }
      } = await this.$service.beginStock.getBeginStock({
        id: this.Warehouse_id
      })
      if (err) return
      this.warehouseDetail = data
      this.goodsInfo = data.goodsInfo
    }
  }
}
</script>

<style scoped>
.module-box {
  padding: 15px;
  background-color: #ffffff;
}
.module-form-item {
  width: 80%;
  display: flex;
  justify-content: space-between;
}
.module-form-item .el-form-item {
  flex: 0 0 33%;
}
.module-form-item .el-form-item .remarks {
  width: 80%;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
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
.table-list-box .goods-info-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
}
.table-list-box .goods-info-box p {
    text-align: left;
}
</style>
