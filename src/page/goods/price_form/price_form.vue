<template>
  <el-card class="box-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="开启价格体系的商品" name="open">
        <price-table :is-pricing="1"></price-table>
      </el-tab-pane>
      <el-tab-pane label="未开启价格体系的商品" name="unopened">
        <price-table :is-pricing="0"></price-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import priceTable from './component/price_table'

export default {
  data () {
    return {
      activeName: 'open'
    }
  },
  components: {
    priceTable
  },
  methods: {
    handleClick (tab, event) {
      //   console.log(tab, event);
    }
  }
}
</script>
