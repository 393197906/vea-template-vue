<style scoped>
  .showScroll {
    max-height: 600px;
    overflow-y: auto
  }
</style>
<template>
  <div>
    <el-table border :data="tabledata" class="showScroll" v-if="isPricing" :span-method="objectSpanMethod">
      <!--常规规格名-->
      <template v-if="tabledata[0] && tabledata[0].sku_list">
        <el-table-column v-for="(iitem,iindex) in JSON.parse(tabledata[0].sku_list) || []"
                         align="center" :key="iindex" :prop="`sku${iindex}.spec_value_name`"
                         :label="iitem.spec_name"/>
      </template>
      <el-table-column v-if="tabledata[0].aux_unit_name" prop="aux_unit_name" label="标准规格" align="center"/>
      <el-table-column width="100" align="center" prop="price_type_name" label="价格体系"/>
      <el-table-column prop="price" align="center" width="100" label="销售价"/>
      <el-table-column width="100" align="center" prop="market_price" label="市场价"/>
      <el-table-column label="阶梯价" width="170" align="center" type="expand">
        <template slot-scope="scope">
          <div v-if="scope.row.leader_price">
            <el-table border style="width: 100%" :data="scope.row.leader_price">
              <el-table-column
                align="center"
                label="启始门槛(数量)">
                <template slot-scope="ladder_scope">
                  <span>{{ladder_scope.row.from}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="结束门槛(数量)">
                <template slot-scope="ladder_scope">
                  <span>{{ladder_scope.row.to=="99999999"?"∞":ladder_scope.row.to}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="价格(元)">
                <template slot-scope="ladder_scope">
                  <span>{{ladder_scope.row.price}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else style="text-align: center">没有启用阶梯价</div>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else border :data="skuData" class="showScroll">
      <!--常规规格名-->
      <template v-if="skuData[0] && skuData[0].sku_list">
        <el-table-column v-for="(iitem,iindex) in JSON.parse(skuData[0].sku_list) || []"
                         align="center" :key="iindex" :prop="`sku${iindex}.spec_value_name`"
                         :label="iitem.spec_name"/>
      </template>
      <el-table-column v-if="skuData[0].aux_unit_name" prop="aux_unit_name" label="标准规格" align="center"/>
      <el-table-column prop="price" align="center" width="100" label="销售价"/>
      <el-table-column width="100" align="center" prop="market_price" label="市场价"/>
      <el-table-column prop="stock" align="center" width="100" label="库存"/>
      <el-table-column align="center" label="阶梯价" width="170" type="expand">
        <template slot-scope="scope">
          <div v-if="scope.row.is_leader">
            <el-table border style="width: 100%" :data="JSON.parse(scope.row.leader_price)">
              <el-table-column
                align="center"
                label="启始门槛(数量)">
                <template slot-scope="ladder_scope">
                  <span>{{ladder_scope.row.from}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="结束门槛(数量)">
                <template slot-scope="ladder_scope">
                  <span>{{ladder_scope.row.to}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="价格(元)">
                <template slot-scope="ladder_scope">
                  <span>{{ladder_scope.row.price}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else style="text-align: center">没有启用阶梯价</div>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>
<script>
export default {
  data () {
    return {
      tabledata: []
    }
  },
  props: {
    skuData: [Array],
    isPricing: [Boolean]
  },
  watch: {
    skuData (cval) {
      this.setData()
    }
  },
  created () {
    this.setData()
  },
  methods: {
    objectSpanMethod ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        if (rowIndex % row.len === 0) {
          return {
            rowspan: row.len,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    setData () {
      let tarr = new Array()
      if (this.isPricing) {
        this.skuData.forEach(item => {
          JSON.parse(item.pricing_list).forEach((iitem, iindex) => {
            iitem.sindex = iindex
            iitem.len = JSON.parse(item.pricing_list).length
            tarr.push({...item, ...iitem})
          })
        })
      } else {
        tarr = this.skuData
      }
      tarr.forEach(item => {
        if (item.sku_list && !item.sku0) {
          const json_sku_list = JSON.parse(item.sku_list)
          json_sku_list.forEach((iitem, index) => {
            item['sku' + index] = iitem
          })
        }
      })
      this.tabledata = tarr
    }
  }
}
</script>
