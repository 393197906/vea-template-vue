<template>
    <div class="module-box">
        <div>
            <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm" inline>
                <div class="module-form-item">
                    <el-form-item label="单据编号：" prop="sheetCode">
                        <p>{{orderInfo.sheetCode}}</p>
                    </el-form-item>
                    <el-form-item label="入库日期：" prop="name">
                        <p>{{formatTime(orderInfo.createTime)}}</p>
                    </el-form-item>
                    <el-form-item label="操作人：" prop="name">
                        <p>{{orderInfo.operatorName}}</p>
                    </el-form-item>
                </div>
                <div class="module-form-item">
                    <el-form-item label="制单时间：" prop="name">
                      <p>{{formatTime(orderInfo.createTime)}}</p>
                    </el-form-item>
                    <el-form-item label="仓库：" prop="name">
                        <p>{{orderInfo.warehouseName}}</p>
                    </el-form-item>
                    <el-form-item label="备注：" prop="name">
                        <p style="width: 200px">{{orderInfo.mark}}</p>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <!--<div class="table-info">-->
            <!--<p>合计金额 0.00 元。</p>-->
        <!--</div>-->
        <!-- 表格 -->
        <el-table style="width: 100%" :data="queryData">
            <el-table-column prop="date" align="center" label="商品名称" min-width="250">
                <template slot-scope="scope">
                    <div class="table-list-box">
                        <div style="width: 60px; height: 60px">
                            <img :src="scope.row.picture.pic_cover_small"
                                 alt=""
                                 style="max-width: 100%; max-height: 100%">
                        </div>
                        <div class="goods-info-box">
                            <p class="goods-title">{{scope.row.goodsName}}</p>
                            <p class="goods-no">{{scope.row.goodsId}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <!--<el-table-column prop="date" align="center" label="规格" width="250">-->
                <!--<template slot-scope="scope">-->
                    <!--箱-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="date" align="center" label="单位" width="100">
                <template slot-scope="scope">
                    KG
                </template>
            </el-table-column>
            <el-table-column prop="goodsWeight" align="center" label="退货重量" width="200">
            </el-table-column>
            <el-table-column prop="goodsWeight" align="center" label="入库重量" width="200">
            </el-table-column>
            <el-table-column prop="badWeight" align="center" label="报损重量" width="200"/>
          <el-table-column prop="totalMoney" align="center" label="退货金额" width="250"/>

          <!--<el-table-column prop="date" align="center" label="小计(元)">-->
                <!--<template slot-scope="scope">-->
                    <!--{{}}-->
                <!--</template>-->
            <!--</el-table-column>-->
        </el-table>
        <!-- // 表格 -->
    </div>
</template>

<script>
import {formatTime} from '@/util/util.js'
export default {
  name: 'storage-info',
  data () {
    return {
      sheetCode: '',
      createTime: '', // 制单时间
      operatorId: '', // 人
      warehouseId: '', // 店ID
      mark: '', // 备注
      orderInfo: {},
      queryData: []
    }
  },
  created () {
    this.getAllSell(this.$route.params.id)
  },
  methods: {
    formatTime: formatTime,
    async getAllSell (id) {
      const {err, data} = await this.$service.purchase.getSellReturn({id: id})
      if (err) return
      if (data.status == 200) {
        this.orderInfo = data.data
        this.queryData = data.data.goodsInfo
        // this.mark = data.data.mark;
        // this.sheetCode = data.data.sheetCode;
        // this.createTime = data.data.createTime;
        // this.queryData = data.data.goodsInfo
        // this.operatorId = data.data.operatorId;
        // this.warehouseId = data.data.warehouseId;
      } else {

      }
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
    .module-form-item .el-form-item  .remarks {
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
