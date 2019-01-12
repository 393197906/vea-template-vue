<template>
  <el-dialog title="生成出库单" :visible="shipDialogVisible" :before-close="closeDilog">
    <el-dialog
      width="50%"
      title="选择地址"
      :visible.sync="innerVisible"
      append-to-body>
      <template>
        <div>
          <p v-if="ship_List.length == 0 || !ship_List">暂无数据</p>
          <el-radio-group v-model="selAddressIndex">
            <el-radio :key="item.id"
              v-for="(item, index) in ship_List"
              :label="index">
              {{item.address | hasValue}} {{item.name | hasValue}} {{item.contact | hasValue}}　{{item.phone | hasValue}}
            </el-radio>
          </el-radio-group>
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="selectAddressSure" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <div v-loading="loading">
      <el-table :data="goods_List">
        <el-table-column property="goods_name" label="商品" width="300"></el-table-column>
        <el-table-column property="num" label="数量" width="80"></el-table-column>
        <el-table-column property="price" label="价格"></el-table-column>
        <el-table-column property="shipping_status_info" label="状态" width="80"></el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <span>发货地址 : {{selectAddress.address | hasValue}}　{{selectAddress.contact | hasValue}}　{{selectAddress.phone | hasValue}}</span>
        <el-button type=primary size=small style="float:right" @click="innerVisible = true">选择地址</el-button>
      </div>
      <div style="margin-top: 20px">
        <span>收货信息 : </span> {{ shipData.province_name | hasValue }}-{{ shipData.city_name | hasValue }}-{{
        shipData.district_name | hasValue }}-{{ shipData.receiver_address | hasValue }}　{{ shipData.receiver_name |
        hasValue }}　{{ shipData.receiver_mobile | hasValue }}
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDilog" size="small">取 消</el-button>
      <el-button type="primary" @click="shipSure" size="small" :loading="loading">生成出库单</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'OrderShip',
  props: ['shipDialogVisible', 'orderId'],
  data () {
    return {
      loading: false,
      innerVisible: false,
      selAddressIndex: '',
      selectAddress: {
        address: '',
        contact: '',
        phone: '',
        id: ''
      },
      nonAddress: {
        address: '',
        contact: '',
        phone: '',
        id: ''
      },
      ship_List: [],
      goods_List: [],
      shipData: {},
      tag: false
    }
  },
  methods: {
    closeDilog () {
      this.ship_List = []
      this.goods_List = []
      this.selAddressIndex = ''
      this.tag = false
      this.$emit('update:shipDialogVisible', false)
    },
    async selectInnerAddress () {
      const {err, data} = await this.$service.shop.point.list()
      if (err) return
      this.ship_List = data.data
      const defaultAddress = this.ship_List.find(item => item.default_address == 1)
      if (defaultAddress) {
        const {address, contact, phone, id} = defaultAddress
        this.selectAddress.address = address
        this.selectAddress.contact = contact
        this.selectAddress.phone = phone
        this.selectAddress.id = id
        this.tag = true
      }
    },
    // 选择地址
    selectAddressSure () {
      for (var key in this.selectAddress) {
        this.selectAddress[key] = this.ship_List[this.selAddressIndex][key]
      }
      this.tag = true
      this.innerVisible = false
    },
    // 确认发货
    async shipSure () {
      if (!this.tag) {
        this.$message({
          type: 'error',
          message: '请选择地址'
        })
        return
      }
      this.loading = true
      const {err, data} = await this.$service.shopOrder.ordermanager.orderShipSure({
        id: this.orderId,
        pickup_id: this.selectAddress.id
      })
      this.loading = false
      if (err) return
      this.$message.success('生成出库单成功')
      this.tag = false
      this.$emit('update:shipDialogVisible', false)
      this.$emit('refresh')
    },
    // 获取发货数据
    async getShipData (id) {
      this.loading = true
      this.selectAddress = Object.assign({}, this.nonAddress)
      const {err, data} = await this.$service.shopOrder.ordermanager.orderShipDetail(id)
      if (err) return
      this.shipData = data.result
      this.goods_List = data.result.goods
      this.selectInnerAddress()
      this.loading = false
      this.$emit('update:shipDialogVisible', true)
    }
  },
  // async selectInnerAddress() {
  //   this.innerVisible = true
  //   const {err, data} = await this.$service.shop.point.list()
  //   alert(data)
  //   this.ship_list = data.data
  //   if(err) return
  // },
  filters: {
    // 判断非空
    hasValue: function (value) {
      return value || ''
    }
  }
}
</script>
<style scoped>
  .el-dialog__body {
    padding: 0 20px 20px 20px;
  }

  .el-radio {
    display: block;
    margin: 15px 10px;
    margin-left: 30px;
  }
</style>
