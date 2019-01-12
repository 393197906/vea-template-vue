<template>

  <!--表单start-->
  <el-row class="table-main">
    <el-col :span="24" class="table-main-header">
      <el-checkbox/>
      <span>商品编号：2018032117102771062 &nbsp 创建时间：2018-03-21 17:10:27</span>
    </el-col>
    <el-col :span="6"><div class="table-content">
      <img src="../../../assets/Shop.png" alt="" class="table-content-img">
      <span>鸡胸脯肉</span>
    </div></el-col>
    <el-col :span="4">
      <span class="table-content-span">原&nbsp&nbsp&nbsp价：0.00</span>
      <span>销售价：0.00</span>
    </el-col>
    <el-col :span="4"><div class="table-content">110</div></el-col>
    <el-col :span="4"><div class="table-content">0</div></el-col>
    <el-col :span="2"><div class="table-content">这是排序</div></el-col>
    <el-col :span="4"><div class="table-content">
      <el-button type="text">删除</el-button>
      <el-button type="text">恢复</el-button>
    </div></el-col>
  </el-row>
  <!--表单end-->

</template>

<script>

export default {
  name: 'GoodsRecoverTable',
  created () {
  }
}
</script>

<style scoped>

  .table-main{
    font-size: 12px;
    text-align: center;
    background: #fff;
  }
  .table-main-header{
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    text-align: left;
    background: #e4f3ff;
    color: #333;
  }
  .table-content{
    height: 80px;
    line-height: 80px;
  }
  .table-content-span{
    display: block;
    margin-top: 25px;
  }
  .table-content-img{
    width: 40px;
    height: 40px;
    vertical-align: middle;
  }

</style>
