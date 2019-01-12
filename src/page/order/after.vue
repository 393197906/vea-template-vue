<template>
  <div>
    <div class="listTop">
      <div class="coding">
        <span>退货订单编号:</span>
        <el-input placeholder="请输入内容"   size="small" v-model="pramas.order_no"></el-input>
      </div>
      <div class="coding">
        <span>商家收货人:</span>
        <el-input placeholder="请输入内容"   size="small" v-model="pramas.business_name"></el-input>
      </div>
      <div class="MoreSearch">
        <el-button @click="searchOrder"   size="small" type="primary" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <OrderTable2 :orderData.sync="orderList" isRefund="false"  v-loading="loading" @refresh="_orderList" />
    <div class="page-box">
      <el-pagination
        class="text-align"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="pramas.page"
        :page-size="pramas.pre_page"
        :total="total_count">
      </el-pagination>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vea'
import OrderTable2 from '@/components/order/orderTable2.vue'

export default {
  data () {
    return {
      orderStatu: '',
      orderList: [],
      total_count: 0,
      activeIndex: 0,
      optionShow: false,
      loading: false,
      pramas: {
        page: 1,
        pre_page: 10,
        order_no: '',
        business_name: ''
      }
    }
  },
  name: 'list',
  components: {
    OrderTable2
  },
  created () {
    this._orderList()
  },
  methods: {
    // 更换当前页码
    handleCurrentChange (val) {
      this.pramas.page = val
      this._orderList()
    },
    // 查找退货订单
    searchOrder () {
      this.pramas.page = 1
      this._orderList()
    },
    // 退货订单列表
    async _orderList () {
      this.loading = true
      const {
        err,
        data
      } = await this.$service.shopOrder.ordermanager.returnList(this.pramas)
      this.loading = false
      if (err) return
      this.orderList = data.result
      this.total_count = data.total_count
    }
  }
}
</script>

<style scoped>
.text-align {
  text-align: center;
}

.orderList:after {
  display: block;
  content: ".";
  clear: both;
  line-height: 0;
  visibility: hidden;
}

.listTop {
  height: 54px;
  line-height: 54px;
  background: #fff;
}

.block {
  float: left;
}

.block span {
  margin-right: 8px;
}

.coding {
  height: 60px;
  float: left;
  margin: 0 10px;
}

.searchItem {
  float: left;
  margin: 0 15px 15px 0;
}

.searchItem .el-input {
  width: 150px;
}

.coding .el-input {
  width: 150px;
  margin-left: 8px;
}

.MoreSearch {
  float: right;
  margin-right: 20px;
}

.listing_information {
  width: 100%;
}

.listing_information th {
  height: 50px;
  text-align: center;
  font-weight: 500;
}

.listing_information td {
  padding: 20px 0;
  text-align: center;
  border: 1px solid #eee;
}

.order-box {
  margin-bottom: 10px;
}

.text-align {
  text-align: center;
}

.order-img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
  margin-right: 10px;
}

.order-header {
  height: 40px;
  line-height: 40px;
  background-color: #e4f3ff;
  box-sizing: border-box;
  padding: 0 10px;
}

.order-header span {
  margin-left: 20px;
}

.order-body {
  box-sizing: border-box;
  border-left: 1px solid #e5e5e5;
}

.order-item {
  height: 100px;
  line-height: 100px;
  padding: 0 10px;
  box-sizing: border-box;
  border-right: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}
.page-box {
  background: #fff;
  text-align: center;
  padding: 10px;
}
.text-align {
  text-align: center;
}
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
</style>
