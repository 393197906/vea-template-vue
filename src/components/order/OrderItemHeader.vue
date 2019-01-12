<template>
  <el-row class="row-header">
    <el-col :span="6">
      <el-checkbox class="all-check">全选</el-checkbox>
      商品信息
    </el-col>
    <el-col :span="3">
      商品清单
    </el-col>
    <el-col :span="2">
      买家
    </el-col>
    <el-col :span="4">
      收货信息
    </el-col>
    <el-col :span="3">
      订单金额
    </el-col>
    <el-col :span="2">
      交易状态
    </el-col>
    <el-col :span="4">
      操作
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'OrderItemHeader'
}
</script>

<style scoped>
  .row-header {
    height: 45px;
    line-height: 45px;
    text-align: center;
  }

  .all-check {
    float: left;
    margin-left: 10px;
  }

</style>
