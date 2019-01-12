<template>
    <div>
        <detailsFrame>
        <!-- 基本信息 slot="basicInfo"-->
           <el-form  ref="formData" slot="basicInfo" :model="formData" :rules="rules" label-width="130px"  size="small" inline>
                <div>
                    <el-form-item label="操作人：" prop="userId">
                        <el-input  v-model="userName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="仓库：" prop="warehouseId">
                        <el-select v-model="formData.warehouseId" placeholder="请选择" style="width: 150px">
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
                    <el-form-item label="备注：" prop="mark">
                        <el-input
                                type="textarea"
                                :rows="3"
                                style="width: 369px"
                                placeholder="请输入内容"
                                v-model="formData.mark">
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
        <!-- 商品信息 slot="selectGoods" -->
            <div slot="selectGoods">
                <el-form ref="form" label-width="10px" size="small" inline>
                    <el-form-item label=" ">
                        <el-button type="primary" size="small" @click="centerDialogVisible = true">选择商品</el-button>
                    </el-form-item>
                </el-form>
                 <div class="table-info">
                    <p>共 {{selectGoodsData.length}} 件商品，合计金额 {{priceAllNum}} 元。</p>
                </div>
                 <!-- 表格 -->
                <el-table style="width: 100%" :data="selectGoodsData">
                    <el-table-column prop="goods_name" align="center" label="商品名称" >
                    </el-table-column>
                    <el-table-column prop="weight" align="center" label="单位" ></el-table-column>
                    <el-table-column prop="date" align="center" label="采购量" >
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
                    <el-table-column prop="date" align="center" label="采购价(元)" >
                        <template slot-scope="scope">
                            <!--<el-input style="width: 150px" size="small" v-model="scope.row.price" type="number">-->
                                <!--<template slot="prepend">￥</template>-->
                            <!--</el-input>-->
                            <el-input-number
                                    v-model="scope.row.price"
                                    @change="val => {goodsWeightChange(val, scope.$index, 2)}"
                                    size="small"
                                    controls-position="right"
                                    :precision="2"
                                    :step="1">
                            </el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column prop="date" align="center" label="小计(元)" >
                        <template slot-scope="scope">
                            <p>{{(scope.row.goodsWeight * scope.row.price)||0}}</p>
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
        <!-- 底部按钮 slot="footerButton" -->
            <div slot="footerButton">
                <el-button size="small">取消</el-button>
                <el-button type="primary" size="small" :loading="submitLoading" @click="onSubmit('formData')">提交</el-button>
            </div>
        </detailsFrame>
        <goodsDialogTable
                :dialogVisible="centerDialogVisible"
                :disableGoodsId="selGoodsId"
                @dialogSure="goodsDialogSure"
                @dialogClose="goodsDialogClose">
        </goodsDialogTable>

    </div>
</template>

<script>
import goodsDialogTable from './component/goodsDialogTable'
import detailsFrame from './component/detailsFrame'
export default {
  name: 'new-start',
  data () {
    return {
      submitLoading: false,
      centerDialogVisible: false,
      rules: {
        // 提交验证
        warehouseId: {
          required: true,
          message: '请选择仓库',
          trigger: 'change'
        }
      },
      userName: '', // 操作人
      formData: {
        // 提交参数
        warehouseId: '',
        mark: '',
        goodsInfo: ''
      },
      selectGoodsData: [], // 页面已选择的商品信息
      priceAllNum: 0, // 所有产品加起来的总价格
      warehouseData: [] // 所有仓库数据
    }
  },
  components: {
    detailsFrame,
    goodsDialogTable // 商品弹出层
  },
  created () {
    this.userName = JSON.parse(sessionStorage.getItem('user_info')).user_name
    this.getAllWarehouseName()
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
  methods: {
    // 保存提交
    onSubmit (formName) {
      let goodsList = this.selectGoodsData
      let goodsArr = []
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (goodsList.length === 0) {
            // 判断商品数据是否为空
            this.$message.error('商品数据不能为空')
            return false
          }
          goodsList.map(item => {
            // 重新组合提交商品数据 由于商品数据过多只提供后端需要的数据
            goodsArr.push({
              goodsId: item.goods_id,
              goodsWeight: item.goodsWeight,
              price: item.price
            })
          })
          this.formData.goodsInfo = JSON.stringify(goodsArr)
          let saveWarehouse = 'addBeginStock'
          this.submitLoading = true
          const { err, data } = await this.$service.beginStock[saveWarehouse](
            this.formData
          )
          this.submitLoading = false
          if (err) return
          if (!this.stock_id) {
            // 添加期初库存 提示是否继续创建
            this.$confirm('是否继续创建期初库存？', '提示', {
              confirmButtonText: '继续添加',
              cancelButtonText: '返回列表',
              type: 'warning'
            })
              .then(() => {
                // 继续创建
                this.selectGoodsData = []
                this.priceAllNum = 0
                this.formData.freightCharge = 0
                this.formData.mark = ''
                this.$refs[formName].resetFields()
                this.getAllWarehouseName()
              })
              .catch(() => {
                // 返回上一级
                this.$router.back()
              })
          } else {
            this.$message({
              message: data.message,
              type: 'success'
            })
            // 修改期初库存 成功后直接返回上一级
            this.$router.back()
          }
        }
      })
    },
    // 获取所有仓库
    async getAllWarehouseName () {
      const {
        err,
        data: { data: { data } }
      } = await this.$service.stock.getAllWarehouseName({ from: 2 })
      if (err) return
      this.warehouseData = data
    },

    // 商品采购量变化
    goodsWeightChange (val, index, type) {
      let item = {}
      this.priceAllNum = 0
      let selectGoodsData = {}
      if (val !== -2) {
        if (type === 1) {
          // 采购量
          item = Object.assign({}, this.selectGoodsData[index], {
            goodsWeight: val
          })
        } else {
          // 采购价
          item = Object.assign({}, this.selectGoodsData[index], { price: val })
        }
        // 设置采购数量
        this.$set(this.selectGoodsData, index, item)
      }
      selectGoodsData = this.selectGoodsData
      for (let i in selectGoodsData) {
        // 计算总价
        this.priceAllNum =
          this.priceAllNum +
          selectGoodsData[i].goodsWeight * selectGoodsData[i].price
      }
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
    // 选择商品确定回调
    goodsDialogSure (goodsArr) {
      this.goodsDialogClose()
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
    // 商品弹窗关闭回调
    goodsDialogClose () {
      this.centerDialogVisible = false
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
.table-info {
  color: #333;
  font-size: 12px;
  line-height: 2;
  font-weight: 700;
}
</style>
