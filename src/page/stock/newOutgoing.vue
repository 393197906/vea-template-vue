<template>
    <div>
        <detailsFrame>
            <el-form ref="subForm" slot="basicInfo" label-width="130px" :model="subData" :rules="subRule" size="small" inline>
                <!--<el-form-item label="出库原因：">-->
                <!--<el-select v-model="value" placeholder="请选择">-->
                <!--<el-option label="报损" value="0"></el-option>-->
                <!--<el-option label="领用" value="1"></el-option>-->
                <!--<el-option label="其他" value="2"></el-option>-->
                <!--</el-select>-->
                <!--</el-form-item>-->
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
                <el-form-item label="出库时间：">
                    <el-date-picker
                            v-model="subData.time"
                            type="date"
                            :readonly="true"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
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
                                style="width: 300px"
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
                </el-form>
                <!-- 表格 -->
                <el-table style="width: 100%" :data="selectGoodsData">
                    <el-table-column prop="goods_id" align="center" label="商品编码" width="200"></el-table-column>
                    <el-table-column prop="goods_name" align="center" label="商品名称" width="250">
                    </el-table-column>
                    <el-table-column prop="weight" align="center" label="单位" width="200">
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="可售重量" width="200">
                        <template slot-scope="scope">
                            {{scope.row.stock}}KG
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="出库重量" width="200">
                        <template slot-scope="scope">
                            <!--<el-input size="small" style="width: 100px"></el-input>-->
                            <el-input-number
                                    v-model="scope.row.goodsWeight"
                                    controls-position="right"
                                    @change="val => {goodsWeightChange(val, scope.$index, 1)}"
                                    :min="0"
                                    :precision="3">
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="当前成本价(元)" width="200">
                        <template slot-scope="scope">
                            {{scope.row.costPrice}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="clearGoodsItem(scope.$index)">刪除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- // 表格 -->
            </div>

            <div slot="footerButton">
                <!--底部从操作按钮-->
                <el-button type="primary" size="small" @click="saveOutgoing">确认出库</el-button>
            </div>
        </detailsFrame>
        <goodsDialogTable
                :dialogVisible="goodsDialogStatus"
                :disableGoodsId="selGoodsId"
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
  name: 'new-outgoing',
  data () {
    return {
      operatorName: '', // 操作人名称
      warehouseData: [], // 所有仓库数据
      supplierData: [], // 所有供应商数据
      goodsDialogStatus: false, // 选择商品弹窗状态
      subData: { // 提交信息
        goodsInfo: [],
        warehouseId: '',
        mark: '',
        time: new Date()
      },
      selectGoodsData: [], // 已选择的商品信息
      subRule: { // 验证
        warehouseId: { required: true, message: '请选择仓库', trigger: 'change' }
      }
    }
  },
  methods: {
    // 获取所有仓库
    formatTime: formatTime,
    // 商品采购量变化
    goodsWeightChange (val, index) {
      let item = {}
      this.priceAllNum = 0
      item = Object.assign({}, this.selectGoodsData[index], {goodsWeight: val})
      // 设置采购数量
      this.$set(
        this.selectGoodsData,
        index,
        item
      )
    },
    // 获取所有仓库
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
    // 选择商品确定回调
    goodsDialogSure (goodsArr) {
      this.goodsDialogStatus = false
      goodsArr.map(item => {
        item['goodsWeight'] = 1
        this.selectGoodsData.push(item)
      })
      // this.goodsWeightChange(-2) // 重新计算总价格
      this.$message({
        message: '商品添加成功',
        type: 'success'
      })
    },
    // 商品弹窗关闭回调
    goodsDialogClose () {
      this.goodsDialogStatus = false
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
    saveOutgoing () {
      let goodsArr = []
      this.$refs.subForm.validate(async (valid) => {
        if (valid) {
          let selectGoodsData = this.selectGoodsData
          this.subData.goodsInfo = []
          if (selectGoodsData.length === 0) {
            this.$message.error('商品数据不能为空')
            return false
          }
          selectGoodsData.map(item => {
            goodsArr.push({goodsId: item.goods_id, goodsSpecFormat: item.goods_spec_format, goodsWeight: item.goodsWeight, price: item.costPrice})
          })
          let params = Object.assign({}, this.subData, {goodsInfo: JSON.stringify(goodsArr)})
          delete params['time']
          const {err, data: {message}} = await this.$service.outgoing.addSell(params)
          if (err) return
          this.$confirm('是否继续创建出库单？', '提示', {
            confirmButtonText: '继续添加',
            cancelButtonText: '返回列表',
            type: 'warning'
          }).then(() => {
            // 继续创建
            this.selectGoodsData = []
            this.subData.mark = ''
            this.$refs.subForm.resetFields()
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
    this.getAllWarehouseName()
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
    .table-list-box .goods-info-box{
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
