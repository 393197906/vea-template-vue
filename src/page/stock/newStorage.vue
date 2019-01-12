<template>
  <div>
    <detailsFrame>
      <!-- 搜索 -->
      <el-form ref="goodsForm" slot="basicInfo" :rules="goodsRules" :model="subData" label-width="130px" size="small"
               inline>
        <el-form-item label="仓库：" prop="warehouseId">
          <el-select v-model="subData.warehouseId" placeholder="请选择" style="width: 150px">
            <el-option
              v-for="(item, index) in warehouseData"
              :key="item.id"
              :label="item.warehouseName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间：">
          <el-date-picker
            v-model="createTime"
            type="date"
            :readonly="true"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人：">
          <el-input :readonly="true" v-model="operatorName"/>
        </el-form-item>
        <div>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="3"
              style="width: 300px"
              placeholder="请输入内容"
              v-model="subData.mark">
            </el-input>
          </el-form-item>
          <el-form-item label="处理方式：" prop="returnMoney">
            <el-radio-group v-model="subData.returnMoney">
              <el-radio :label="2">退货</el-radio>
              <el-radio :label="1">退货退款</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <!-- // 搜索 -->

      <div slot="selectGoods">
        <!--选择商品-->
        <el-form ref="form" label-width="10px" size="small" inline>
          <el-form-item label=" ">
            <!-- <el-button type="primary"  size="small" @click="goodsDialogStatus = true">选择商品</el-button> -->
            <el-button type="primary" size="small" @click="selSaleBill = true">选择销售出库单</el-button>
          </el-form-item>
          <el-form-item>
            <!--<p>已关联 0 条退货单</p>-->
          </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table style="width: 100%" :data="selectGoodsData">
          <el-table-column prop="goodsName" align="center" label="商品名称">
          </el-table-column>
          <el-table-column prop="weight" align="center" label="单位">
            <template slot-scope="scope">
              KG
            </template>
          </el-table-column>
          <el-table-column prop="goodsWeight" align="center" label="退货重量">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.returnWeight"
                controls-position="right"
                @change="val => {goodsWeightChange(val, scope.$index, 'returnWeight')}"
                size="small"
                :max="scope.row.maxNum"
                :min="0">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="salePrice" align="center" label="退货销售单价">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.salePrice"
                controls-position="right"
                @change="val => {goodsWeightChange(val, scope.$index, 'salePrice')}"
                size="small"
                :min="0">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" align="center" label="退货总销售价">
            <template slot-scope="scope">
              {{(scope.row.salePrice*scope.row.returnWeight).toFixed(4)||0}}
            </template>
          </el-table-column>
          <el-table-column prop="price" align="center" label="退货单价成本"></el-table-column>
          <el-table-column prop="totalPrice" align="center" label="退货总成本">
            <template slot-scope="scope">
              {{(scope.row.price*scope.row.returnWeight).toFixed(4)}}
            </template>
          </el-table-column>

          <el-table-column prop="date" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="clearGoodsItem(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- // 表格 -->
      </div>
      <div slot="footerButton">
        <!--底部从操作按钮-->
        <el-button type="primary" size="small" :loading="submitLoading" @click="saveWarehousing">保存</el-button>
        <!--<el-button type="warning" size="small">审核</el-button>-->
        <!--<el-button size="small">打印</el-button>-->
      </div>
    </detailsFrame>
    <goodsDialogTable
      :dialogVisible="goodsDialogStatus"
      :disableGoodsId="selGoodsId"
      @dialogSure="goodsDialogSure"
      @dialogClose="goodsDialogClose">
    </goodsDialogTable>

    <el-dialog
      title="选择销售出库单"
      :visible.sync="selSaleBill"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="dialogClose"
      top="20px" width="60%"
    >

      <el-form :inline="true" :model="searchWarehouse" ref="searchWarehouse" class="demo-form-inline">
        <el-form-item label="出库单号" prop="sheetCode">
          <el-input placeholder="出库单号" size="mini" v-model="searchWarehouse.sheetCode"></el-input>
        </el-form-item>
        <el-form-item label="客户" prop="buyer">
          <el-input placeholder="请输入客户姓名" size="mini" v-model="searchWarehouse.buyer"></el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseId">
          <el-select placeholder="请选择仓库" size="mini" v-model="searchWarehouse.warehouseId">
            <el-option v-for="item in warehouseData" :key="item.id" :label="item.warehouseName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售订单" prop="orderNo">
          <el-input placeholder="请输入销售订单号 支持模糊查询" size="mini" v-model="searchWarehouse.orderNo"></el-input>
        </el-form-item>
        <el-form-item label="客户手机" prop="mobile">
          <el-input placeholder="请输入客户手机 支持模糊查询" size="mini" v-model="searchWarehouse.mobile"></el-input>
        </el-form-item>
        <el-form-item label="商品" prop="goodsName">
          <el-input placeholder="请输入商品名 支持模糊查询" size="mini" v-model="searchWarehouse.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="业务日期">
          <el-date-picker
            ref="searchTime"
            size="mini"
            @change="timeChange"
            v-model="time_arr"
            unlink-panels="true"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pageChange(1)" size="mini">查询</el-button>
          <el-button type="text" @click="clearSearchData" size="mini">清空筛选条件</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="outgoingList"
        highlight-current-row

        style="width: 100%">
        <el-table-column
          label="序号"
          align='center'
          type="index">
        </el-table-column>
        <el-table-column
          prop="sheetCode"
          label="单号"
          align='center'
        ></el-table-column>
        <el-table-column
          prop="createTime"
          align='center'
          label="业务日期">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="buyer"
          align='center'
          label="客户"></el-table-column>
        <!-- <el-table-column
          prop="address"
          align='center'
          label="交易金额"></el-table-column> -->
        <el-table-column
          prop="warehouseName"
          align='center'
          label="出库仓库"></el-table-column>
        <el-table-column
          prop="operator"
          align='center'
          label="操作员"></el-table-column>
        <el-table-column
          prop="operator"
          align='center'
          label="选择">
          <template slot-scope="scope">
            <el-button type="primary" @click="dialogConfirm(scope.row)" size="mini">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:center;padding-top:20px;">
        <!--分页-->
        <el-pagination
          v-if="total_data"
          background
          :page-size.sync="searchWarehouse.pageSize"
          layout="prev, pager, next"
          @current-change="pageChange"
          :total="total_data">
        </el-pagination>
        <!-- // 分页 -->

      </div>
    </el-dialog>
  </div>
</template>

<script>
import detailsFrame from './component/detailsFrame'
import goodsDialogTable from './component/goodsDialogTable'
import {formatTime} from '@/util/util.js'

export default {
  name: 'new-storage',
  data () {
    return {
      submitLoading: false,
      total_data: 0,
      searchBill: {}, // 选择销售出库单筛选数据
      selSaleBill: false,
      operatorName: '', // 操作員
      warehouseData: [], // 所有仓库数据
      goodsDialogStatus: false, // 选择商品弹窗状态
      selectGoodsData: [], // 页面已选择的商品信息
      createTime: new Date(), // 时间
      subData: {
        // 提交
        id: '',
        goodsInfo: [], // 商品信息
        warehouseId: '', // 仓储ID
        mark: '', // 备注
        orderId: '', // 商城订单ID
        orderNo: '', // 商城订单编码
        buyerId: '', // 客户id
        returnMoney: 1
      },
      goodsRules: {
        warehouseId: {
          required: true,
          message: '请选择仓库',
          trigger: 'change'
        },
        returnMoney: {
          required: true,
          message: '请选择退货处理方式',
          trigger: 'change'
        }
      },
      searchWarehouse: {
        // 搜索条件
        page: 1,
        pageSize: 5,
        status: '2', // 未出库1 已出库2
        goodsName: '', // 商品名称
        sheetCode: '', // 单据编码   ---- 出库单号 （疑问）
        // 出库类型
        warehouseId: '', // 仓库id
        buyer: '', // 客户ID
        mobile: '', // 客户手机
        orderNo: '', // 销售订单
        operatorId: '', // 操作人id
        startTime: '', // 制单开始时间
        endTime: '', // 制单结束时间
        supplierId: '' // 供应商ID
      },
      outgoingList: [],
      time_arr: []
    }
  },
  components: {
    detailsFrame,
    goodsDialogTable
  },
  computed: {
    // 已选中的商品id
    selGoodsId: function () {
      let goodsId = []
      let selGoodsData = this.selectGoodsData
      for (let i in selGoodsData) {
        goodsId.push(selGoodsData[i].goods_id)
      }
      return goodsId
    }
  },
  created () {
    this.operatorName = JSON.parse(
      sessionStorage.getItem('user_info')
    ).user_name
    this.getAllWarehouseName()
    this.outbound_order()
  },

  methods: {
    formatTime: formatTime,
    // 选择出库单取消
    dialogClose () {
      this.selSaleBill = false
    },
    // 选择出库单确定
    dialogConfirm (item) {
      this.selSaleBill = false
      this.selectGoodsData = []
      this.subData.id = item.id
      this.subData.orderId = item.orderId // 商城订单ID
      this.subData.orderNo = item.orderNo // 商城订单编码
      this.subData.buyerId = item.buyerId // 客户id
      item.goodsInfo.forEach(item => {
        // item["badWeight"] = 0;
        item['goodsWeight'] = Number(item['goodsWeight'])
        // item["returnWeight"] = 0;
        item['returnWeight'] = item['goodsWeight'] > 0 ? item['goodsWeight'] : 0
        item['maxNum'] = item['goodsWeight'] > 0 ? item['goodsWeight'] : 0
        this.selectGoodsData.push(item)
      })
      console.log(this.selectGoodsData)
    },

    // 选择销售出库单分页
    pageChange (page) {
      this.searchWarehouse.page = page
      this.outbound_order()
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
    // 获取销售出库单数据
    async outbound_order () {
      const {
        err,
        data: {data: {data, total}}
      } = await this.$service.outgoing.getAllSell(this.searchWarehouse)
      if (err) return
      this.outgoingList = data
      console.log(data,'dsaoiasdoisajdosajodaoi');
      this.total_data = total
    },
    // 商品采购量变化
    goodsWeightChange (val, index, type) {
      let item = this.selectGoodsData[index]
      item[type] = val
      // 设置采购数量
      this.$set(this.selectGoodsData, index, item)
    },

    // 删除已选择的商品
    clearGoodsItem (index) {
      this.selectGoodsData.splice(index, 1)
      this.$message({
        message: '商品移除成功',
        type: 'success'
      })
    },
    // 商品弹窗关闭回调
    goodsDialogClose () {
      this.goodsDialogStatus = false
    },
    // 选择商品确定回调
    goodsDialogSure (goodsArr) {
      this.goodsDialogStatus = false
      goodsArr.map(item => {
        item['badWeight'] = 0
        item['goodsWeight'] = 0
        item['returnWeight'] = 0
        this.selectGoodsData.push(item)
      })
      this.$message({
        message: '商品添加成功',
        type: 'success'
      })
    },

    // 保存信息
    saveWarehousing () {
      let goodsList = this.selectGoodsData
      let goodsArr = []
      this.$refs.goodsForm.validate(async valid => {
        if (valid) {
          if (goodsList.length === 0) {
            // 判断商品数据是否为空
            this.$message.error('商品数据不能为空')
            return false
          }
          goodsList.forEach(item => {
            // 重新组合提交商品数据 由于商品数据过多只提供后端需要的数据
            goodsArr.push({
              goodsId: item.goodsId,
              // returnWeight: item.returnWeight,
              // goodsWeight: item.goodsWeight,
              price: item.price,
              goodsWeight: item.returnWeight,
              salePrice: item.salePrice,
              skuId: item.skuId
              // badWeight: item.badWeight
            })
          })
          this.subData.goodsInfo = JSON.stringify(goodsArr)
          let params = Object.assign({}, this.subData)
          this.submitLoading = true
          const {
            err,
            data: {data}
          } = await this.$service.purchase.getAddSellReturn(params)
          this.submitLoading = false
          if (err) return
          this.$confirm('是否继续创建退货入库单？', '提示', {
            confirmButtonText: '继续添加',
            cancelButtonText: '返回列表',
            type: 'warning'
          })
            .then(() => {
              this.selectGoodsData = []
              this.subData.mark = ''
              this.$refs.goodsForm.resetFields()
            })
            .catch(() => {
              // 返回上一级
              this.$router.back()
            })
        }
      })
    },
    // 筛选销售出库单时间变化
    timeChange (time) {
      if (!time) {
        this.searchWarehouse.startTime = ''
        this.searchWarehouse.endTime = ''
        return
      }
      this.searchWarehouse.startTime = time[0].getTime() / 1000
      this.searchWarehouse.endTime = time[1].getTime() / 1000 + 86399
    },
    // 清空销售出库单筛选条件
    clearSearchData () {
      this.$refs.searchWarehouse.resetFields()
      this.time_arr = []
      this.searchWarehouse.startTime = ''
      this.searchWarehouse.endTime = ''
      this.pageChange(1)
    }
  }
}
</script>

<style scoped>
  .page {
    text-align: center;
    padding: 10px;
  }

  .dialog-footer {
    text-align: center;
  }

  /* 表格内商品信息 */
  .table-list-box {
    display: flex;
    font-size: 12px;
  }

  .table-list-box .goods-info-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .table-list-box .goods-title {
    color: #666666;
    text-align: left;
  }

  .table-list-box .goods-no {
    color: rgb(153, 153, 153);
    text-align: left;
  }
</style>
