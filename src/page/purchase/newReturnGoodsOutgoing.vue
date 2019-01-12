<template>
    <div>
        <detailsFrame>

            <el-form ref="goodsForm" slot="basicInfo" :rules="goodsRules" :model="subData" label-width="130px" size="small" inline>
                <div>
                    <el-form-item label="供应商名称：" prop="supplierId">
                        <el-select v-model="subData.supplierId" placeholder="请选择" style="width: 150px">
                            <el-option
                                    v-for="item in supplierData"
                                    :key="item.id"
                                    :label="item.supplierName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
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
                    <el-form-item label="出库日期：">
                        <el-date-picker
                                v-model="subData.time"
                                type="date"
                                :readonly="true"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="操作人：">
                        <el-input :readonly="true" v-model="operatorName"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="备注：">
                        <el-input
                                type="textarea"
                                :rows="3"
                                style="width: 369px"
                                placeholder="请输入内容"
                                v-model="subData.mark">
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>

            <div slot="selectGoods">
                <el-form ref="form" label-width="10px" size="small" inline>
                    <el-form-item label=" ">
                        <el-button type="primary" size="small" @click="goodsDialogStatus = true">选择商品</el-button>
                    </el-form-item>
                    <!--<el-form-item label=" ">-->
                    <!--<el-button size="small">批量导入</el-button>-->
                    <!--</el-form-item>-->
                </el-form>
                <div class="table-info">
                    <p>共 {{selectGoodsData.length}} 件商品，合计金额 {{priceAllNum}} 元。</p>
                </div>
                <!-- 表格 -->
                <el-table style="width: 100%" :data="selectGoodsData">
                    <el-table-column prop="goods_name" align="center" label="商品名称" >
                    </el-table-column>
                    <el-table-column prop="weight" align="center" label="单位" ></el-table-column>
                    <el-table-column prop="date" align="center" label="退货数量" >
                        <template slot-scope="scope">
                            <!--<el-input size="small" style="width: 100px" v-model="scope.row.goodsWeight"></el-input>-->
                            <el-input-number
                                    v-model="scope.row.goodsWeight"
                                    @change="val => {goodsWeightChange(val, scope.$index, 1)}"
                                    size="small"
                                    :min="1">
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="成本价" >
                        <template slot-scope="scope">
                            <el-input-number
                                    v-model="scope.row.price"
                                    @change="val => {goodsWeightChange(val, scope.$index, 2)}"
                                    size="small"
                                    :min="0"
                                    controls-position="right"
                                    :precision="2"
                                    :step="1">
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="小计(元)" >
                        <template slot-scope="scope">
                            <p>{{scope.row.goodsWeight * scope.row.price || 0}}</p>
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
                <el-button type="primary" size="small" :loading="submitLoading" @click="saveWarehousing">提交</el-button>
            </div>
        </detailsFrame>
        <goodsDialogTable
                v-if="goodsDialogStatus"
                :dialogVisible="goodsDialogStatus"
                :disableGoodsId="selGoodsId"
                isReturn
                @dialogSure="goodsDialogSure"
                @dialogClose="goodsDialogClose">
        </goodsDialogTable>
    </div>
</template>

<script>
import detailsFrame from './component/detailsFrame'
import goodsDialogTable from './component/goodsDialogTable'
import {formatTime} from '@/util/util.js'
export default {
  name: 'new-return-goods-outgooing',
  data () {
    return {
      submitLoading: false,
      operatorName: '', // 操作人名称
      warehouseData: [], // 所有仓库数据
      supplierData: [], // 所有供应商数据
      goodsDialogStatus: false, // 选择商品弹窗状态
      selectGoodsData: [], // 页面已选择的商品信息
      priceAllNum: 0, // 所有产品加起来的总价格
      subData: { // 提交数据
        supplierId: '', // 供应商id
        warehouseId: '', // 仓库id
        goodsInfo: [], // 商品详情
        mark: '', // 备注
        time: new Date()
      },
      goodsRules: {
        supplierId: { required: true, message: '请选择供应商', trigger: 'change' },
        warehouseId: { required: true, message: '请选择仓库', trigger: 'change' }
      }
    }
  },
  methods: {
    // 商品采购量变化
    goodsWeightChange (val, index, type) {
      let item = {}
      this.priceAllNum = 0
      let selectGoodsData = {}
      if (val !== -2) {
        if (type === 1) {
          // 采购量
          item = Object.assign({}, this.selectGoodsData[index], {goodsWeight: val})
        } else {
          // 采购价
          item = Object.assign({}, this.selectGoodsData[index], {price: val})
        }
        // 设置采购数量
        this.$set(
          this.selectGoodsData,
          index,
          item
        )
      }
      selectGoodsData = this.selectGoodsData
      for (let i in selectGoodsData) {
        // 计算总价
        const price = selectGoodsData[i].price || 0
        this.priceAllNum = this.priceAllNum + (selectGoodsData[i].goodsWeight * price)
      }
    },
    // 获取所有仓库
    formatTime: formatTime,
    async getAllWarehouseName () {
      const {err, data: {data: {data}}} = await this.$service.stock.getAllWarehouseName({from: 1})
      if (err) return
      this.warehouseData = data
    },
    // 获取所有供应商
    async getAllSupplierData () {
      const {err, data: {data: {data}}} = await this.$service.purchase.getAllSupplierData()
      if (err) return
      this.supplierData = data
    },
    // 商品弹窗关闭回调
    goodsDialogClose () {
      this.goodsDialogStatus = false
    },
    // 选择商品确定回调
    goodsDialogSure (goodsArr) {
      this.goodsDialogStatus = false
      goodsArr.map(item => {
        item['goodsWeight'] = 1
        this.selectGoodsData.push(item)
      })
      this.goodsWeightChange(-2) // 重新计算总价格
      this.$message({
        message: '商品添加成功',
        type: 'success'
      })
    },
    // 删除已选择的商品
    clearGoodsItem (index) {
      this.selectGoodsData.splice(index, 1)
      this.goodsWeightChange(-2) // 重新计算总价格
      this.$message({
        message: '商品移除成功',
        type: 'success'
      })
    },
    // 提交数据
    saveWarehousing () {
      let goodsList = this.selectGoodsData
      let goodsArr = []
      this.$refs.goodsForm.validate(async (valid) => {
        if (valid) {
          if (goodsList.length === 0) {
            // 判断商品数据是否为空
            this.$message.error('商品数据不能为空')
            return false
          }
          const isNullPrice = goodsList.some(item => {
            const {price} = item
            return price === '' || price === undefined || price < 0
          })
          if (isNullPrice) {
            this.$message.error('商品成本价格不能为空')
            return false
          }
          goodsList.map(item => {
            // 重新组合提交商品数据 由于商品数据过多只提供后端需要的数据
            goodsArr.push({goodsId: item.goods_id, goodsWeight: item.goodsWeight, price: item.price})
          })
          this.subData.goodsInfo = JSON.stringify(goodsArr)
          let params = Object.assign({}, this.subData)
          delete params['time']
          this.submitLoading = true
          const {err, data: {data}} = await this.$service.purchase.addPurchaseReturn(params)
          this.submitLoading = false
          if (err) return
          this.$confirm('是否继续创建采退出库单？', '提示', {
            confirmButtonText: '继续添加',
            cancelButtonText: '返回列表',
            type: 'warning'
          }).then(() => {
            // 继续创建
            this.selectGoodsData = []
            this.priceAllNum = 0
            this.subData.mark = ''
            this.$refs.goodsForm.resetFields()
          }).catch(() => {
            // 返回上一级
            this.$router.back()
          })
        }
      })
    }
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
  components: {
    detailsFrame,
    goodsDialogTable
  },
  created () {
    this.operatorName = JSON.parse(sessionStorage.getItem('user_info')).user_name
    this.getAllWarehouseName() // 获取所有仓库
    this.getAllSupplierData() // 获取所有供应商列表
  }
}
</script>

<style scoped>
    .table-info {
        color: #333;
        font-size: 12px;
        line-height: 2;
        font-weight: 700;
    }
</style>
