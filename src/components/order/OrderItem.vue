<template>
  <el-row class="order-box">
    <el-col :span="24" class="order-header">
      <el-checkbox/>
      <span>订单编号：2018032117102771062（订单ID：342）</span>
      <span>交易号：152162342754961</span>
      <span>下单时间：2018-03-21 17:10:27</span>
    </el-col>
    <el-row class="order-body">
      <el-col :span="6">
        <div class="order-item">
          <img src="@/assets/Shop.png" alt="img" class="order-img">
          <span>安井切片原味千夜豆腐</span>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="order-item text-align">249.00元 1件</div>
      </el-col>
      <el-col :span="2">
        <div class="order-item text-align">admin</div>
      </el-col>
      <el-col :span="4">
        <div class="order-item text-align">辽宁省朝阳市双塔</div>
      </el-col>
      <el-col :span="3">
        <div class="order-item text-align">总金额：77.00</div>
      </el-col>
      <el-col :span="2">
        <div class="order-item text-align">已关闭</div>
      </el-col>
      <el-col :span="4">
        <div class="order-item text-align">
          <el-button type="text" @click="goDetail(1)">订单详情</el-button>
          <el-button type="text" style="color:#333;">添加备注</el-button>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import { order } from '@/api/getData'
export default {
  name: 'OrderItem',
  prop: [],
  data () {
    return {

    }
  },
  methods: {
    goDetail (id) {
      this.$router.push(`/order/list/detail/${id}`)
    }
  },
  computed: {

  },
  components: {
  }
}
</script>

<style scoped>
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
    background-color: #E4F3FF;
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

</style>
