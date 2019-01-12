<style scoped>
  .wid100 {
    width: 100%;
    padding: 0;
  }

  .textcenter {
    text-align: center;
  }

</style>

<template>
  <div>
    <el-table v-if="canEdit" :height="height-60" :data="tableData" show-summary :summary-method="getSummaries"
              class="wid100">
      <el-table-column :min-width="30" prop="goods_name" label="商品名称" align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.goods_name.length>8" effect="dark" :content="scope.row.goods_name"
                      placement="top">
            <span>{{scope.row.goods_name |sublen(8)}}</span>
          </el-tooltip>
          <span v-else>{{scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column :min-width="15" prop="sku_name" label="规格" align="center"></el-table-column>
      <el-table-column :min-width="27" prop="goods_num" label="数量" align="center">
        <template slot-scope="scope">
          <el-input class="wid100" size="mini"
                    v-model="scope.row.goods_num" @blur="inNum(scope.$index,$event)"
                    @focus="focusNumEmpty(scope.row,scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column :min-width="23" prop="goods_total" label="金额" align="center">
        <template slot-scope="scope">
          <el-input-number class="wid100" size="mini" :min="0.01" :controls="false"
                           v-model="scope.row.goods_total" @blur="inTotal(scope.$index,$event)"/>
        </template>
      </el-table-column>
      <el-table-column :min-width="10" label="" align="center">
        <template slot-scope="scope">
          <i class="el-icon-delete" style="cursor: pointer" @click="delGood(scope)"/>
        </template>
      </el-table-column>
    </el-table>
    <el-table height="290" v-else :data="tableData" border show-summary :summary-method="getSumSecond" class="wid100">
      <el-table-column prop="goods_name" label="商品名称" align="center" min-width="40">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.goods_name.length>18" effect="dark" :content="scope.row.goods_name"
                      placement="top">
            <span>{{scope.row.goods_name |sublen(18)}}</span>
          </el-tooltip>
          <span v-else>{{scope.row.goods_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sku_name" label="规格" align="center" min-width="15"/>
      <el-table-column prop="real_price" label="销售价" align="center" min-width="15"/>
      <el-table-column prop="goods_num" label="数量" align="center" min-width="15"/>
      <el-table-column prop="goods_total" label="金额" align="center" min-width="15"/>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  props: {
    height: [Number],
    tableData: [Array],
    canEdit: [Boolean],
    selectedGood: [Array],
    stockHandel: [Function]
  },
  methods: {
    // 计算合计
    getSummaries (param) {
      const {columns, data} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 2 || index === 3) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      sums[3] = '¥' + sums[3].toFixed(2)
      return sums
    },
    getSumSecond (param) {
      const {columns, data} = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (index === 3 || index === 4) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        } else {
          sums[index] = ''
        }
      })
      sums[4] = '¥' + sums[4].toFixed(2)
      return sums
    },
    // 删除已经选择的商品
    delGood (obj) {
      this.tableData.splice(obj.$index, 1)
      const gId = obj.row.goods_id
      const skuId = obj.row.sku_id
      const tmpstr = gId + '' + skuId
      const sindex = this.$inArray(tmpstr, this.selectedGood)
      this.selectedGood.splice(sindex, 1)
    },
    // 输入商品数量
    async inNum (sindex, event) {
        let val = Number(event.target.value) || 1
        val = val < 0 ? 0.1 : val
        this.tableData[sindex].goods_num = event.target.value = val
        let skuId = this.tableData[sindex].sku_id
        this.$emit('stockHandel', true)
        const {err, data} = await
          this.$service.shopmanager.checkstand.checkgoodnum({sku_id: skuId, num: val})
        this.$emit('stockHandel', false)
        if (err) {
          this.tableData[sindex].goods_num = this.tableData[sindex].stock
          event.target.value = this.tableData[sindex].stock
          this.findSection(event.target.value, sindex)
          return
        }
        this.findSection(val, sindex)
    },
    //  当用户重新填写商品数量时，商品数量为空
    focusNumEmpty(row, index) {
      console.log(row.goods_num, index);
      row.goods_num = ''
      console.log(row.goods_num, index);
      this.$set(this.tableData, index, row)
    },
    // 输入金额
    inTotal (sindex, event) {
      this.tableData.push({})
      this.tableData.pop()
    },
    // 查看数量属于哪个区间
    findSection (num, sindex) {
      let tprice = this.tableData[sindex].price
      this.tableData.push({})
      if (this.tableData[sindex].is_leader) {
        this.tableData[sindex].leader_price.forEach(item => {
          if (num > (parseInt(item.from) - 1) && num < (parseInt(item.to) + 1)) {
            tprice = item.price
          }
        })
      }
      this.tableData[sindex].real_price = tprice
      this.tableData[sindex].orgin = tprice
      this.tableData[sindex].goods_total = (num * tprice).toFixed(2)
      this.tableData.pop()
    }
  }
}
</script>
