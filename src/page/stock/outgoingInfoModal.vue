<template>
  <div class="module-box">
    <div>
      <el-form ref="form" :model="form" :rules="formRules" label-width="90px" class="demo-ruleForm" inline>
        <div class="module-form-item">
          <el-form-item label="单据编号：" prop="name">
            <p>{{outgoingData.sheetCode}}</p>
          </el-form-item>
          <el-form-item label="仓库：" :prop="isHad?'':'warehouseId'">
            <p v-if="isHad">{{outgoingData.warehouseName}}</p>
            <el-select v-else size="small" v-model="form.warehouseId" placeholder="请选择仓库">
              <el-option
                v-for="item in service.warehouseList"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人：" prop="name">
            <p>{{outgoingData.operatorName}}</p>
          </el-form-item>
        </div>
        <div class="module-form-item">
          <el-form-item label="制单时间：" prop="name">
            <p>{{formatTime(outgoingData.createTime)}}</p>
          </el-form-item>
          <template v-if="isHad">
            <el-form-item label="出库日期：" prop="name">
              <p>{{formatTime(outgoingData.outWarehouseTime)}}</p>
            </el-form-item>
            <el-form-item label="备注：" prop="name">
              <p style="width: 200px">{{outgoingData.mark}}</p>
            </el-form-item>
          </template>

        </div>
        <div v-if="!isHad" style="text-align:right;padding-bottom:20px;width:80%">
          <el-button @click="submitForm('form')" size="small" type="primary" :loading="loading">提交出库</el-button>
        </div>
      </el-form>
    </div>
    <!--<div class="table-info">-->
    <!--<p>合计金额 0.00 元。</p>-->
    <!--</div>-->
    <!-- 表格 -->
    <el-table style="width: 100%" :data="outgoingData.goodsInfo">
      <el-table-column prop="date" align="center" label="商品名称" width="250">
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
      <!--<el-table-column prop="date" align="center" label="规格" width="250">-->
      <!--<template slot-scope="scope">-->
      <!--箱-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="date" align="center" label="单位">
        <template slot-scope="scope">
          KG
        </template>
      </el-table-column>
      <el-table-column prop="date" align="center" label="销售量">
        <template slot-scope="scope">
          {{scope.row.goodsWeight}}
        </template>
      </el-table-column>
      <!-- 未出库中不显示成本相关字段 -->
      <el-table-column prop="date" align="center" label="成本价(元)" width="250" v-if="isHad">
        <template slot-scope="scope">
          {{scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column prop="date" align="center" label="销售价(优惠后)">
        <template slot-scope="scope">
          {{scope.row.realGoodsPrice}}
        </template>
      </el-table-column>
      <!-- 未出库中不显示成本相关字段 -->
      <el-table-column prop="date" align="center" label="成本金额" v-if="isHad">
        <template slot-scope="scope">
          {{scope.row.goodsCostMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="date" align="center" label="销售金额(优惠后)">
        <template slot-scope="scope">
          {{scope.row.realGoodsMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="orderID" align="center" label="订单编号">
        <template slot-scope="scope">
          <span class="order_id"
                @click="$router.push({path: `/order/list/detail/${outgoingData.orderId}?orderId=${outgoingData.orderId}`})">{{outgoingData.orderNo}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- // 表格 -->
    <!--<div class="confirm-outgoing">-->
    <!--&lt;!&ndash;底部从操作按钮&ndash;&gt;-->
    <!--<el-button type="primary" size="small">确认出库</el-button>-->
    <!--</div>-->
  </div>
</template>

<script>
  import {formatTime} from '@/util/util.js'

  export default {
    name: 'outgoingInfoModal',
    props: {
      outgoingData: {}
    },
    data() {
      return {
        loading: false,
        form: {
          warehouseId: '' // 仓库id
        },
        formRules: {
          warehouseId: [
            {required: true, message: '请选择仓库', trigger: 'blur'}
          ]
        },
        service: {
          warehouseList: [] // 仓库数据
        },
        status: '1', // 未出库1 已出库2
      }
    },
    computed: {
      // 是否已出库
      isHad() {
        return this.$route.params.status == 2 || !this.$route.params.status
      }
    },
    methods: {
      formatTime: formatTime, // 转化时间
      // 获取仓库数据
      async getWarehouse() {
        const {err, data: {data}} = await this.$service.stock.getAllWarehouse(
          {
            page: 1,
            pageSize: 1000,
            status: 5
          }
        )
        if (err) return
        this.service.warehouseList = data.data || []
      }
    }
  }
</script>

<style scoped>
  .order_id {
    color: #1c8fef;
    text-decoration: underline;
    cursor: pointer;
  }

  .order_id:hover {
    color: #86c6fb;
  }

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

  /* 底部确认出库按钮 */
  .confirm-outgoing {
    width: calc(100% - 210px);
    height: 60px;
    line-height: 60px;
    text-align: center;
    background-color: #f9faff;
    position: fixed;
    bottom: 0;
    right: 0;
  }
</style>

