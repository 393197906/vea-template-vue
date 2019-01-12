<template>
  <el-dialog
    title="修改订单"
    :visible="changeDialogVisible"
    :before-close="closeDilog"
    width="780px"
    center
  >
    <div>
      <el-table :data="after_goods_data">
        <el-table-column property="goods_name" label="商品名称"></el-table-column>
        <el-table-column property="sku_name" label="规格" width="120" align="center"></el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.num" :min="1" :controls="false" style="width:80px"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="120" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.price" :min="0.01" :controls="false"
                             style="width:80px"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="fee">
      <p>
        运费:
        <el-input-number v-model="after_shipping_money" :min="0" :controls="false" style="width:80px"></el-input-number>
      </p>
      <p>
        优惠: {{ after_order_data.promotion_money || 0}}
      </p>
      <p>
        实付: {{ pay_money || 0}}
      </p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="changeConfirm" size="small" :loading="loading">确认修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'OrderChange',
  props: ['changeDialogVisible', 'closeChangeDilog', 'refresh'],
  data () {
    return {
      loading: false,
      num: 0,
      after_shipping_money: 0,
      after_goods_data: [],
      after_order_data: '',
      before_ship_money: 0,
      before_goods_data: []
    }
  },
  computed: {
    pay_money () {
      return this.after_goods_data.reduce((prev, cur) => {
        return cur.num * cur.price + prev
      }, 0) + this.after_shipping_money
    }
  },
  methods: {
    // 数据初始化
    changeDataInit (item) {
      this.after_order_data = item
      this.before_ship_money = item.shipping_money
      this.after_shipping_money = item.shipping_money
      this.before_goods_data = JSON.parse(JSON.stringify(item.goods))
      this.after_goods_data = JSON.parse(JSON.stringify(item.goods))
    },
    // 关闭弹窗
    closeDilog () {
      this.$emit('closeChangeDilog')
    },
    // 确认修改
    async changeConfirm () {
      const changed_data = this.after_goods_data.map(item => {
        const index = this.before_goods_data.findIndex(i => i.order_goods_id === item.order_goods_id)
        return {
          order_goods_id: item.order_goods_id,
          before_num: this.before_goods_data[index].num,
          num: item.num,
          before_goods_price: this.before_goods_data[index].price,
          goods_price: item.price
        }
      })
      this.loading = true
      const {err, data} = await this.$service.shopOrder.ordermanager.orderPriceChange(this.after_order_data.order_id, {
        data: JSON.stringify(changed_data),
        shipping_money: this.after_shipping_money
      })
      this.loading = false
      if (err) return
      this.$message({
        type: 'success',
        message: data.msg
      })
      this.$emit('closeChangeDilog')
      this.$emit('refresh')
    }

  }
}
</script>
<style scoped>
  .fee {
    margin-top: 15px;
  }

  .fee p {
    text-align: center;
    display: inline-block;
    width: 30%;
    box-sizing: border-box;
  }
</style>
