<template>
  <!--表单start-->
  <el-row class="table-main">
    <el-col :span="2"><div class="table-content">
      <el-checkbox label=""></el-checkbox>
    </div></el-col>
    <el-col :span="4"><div class="table-content">这是供应商名称</div></el-col>
    <el-col :span="2"><div class="table-content">这是联系人</div></el-col>
    <el-col :span="3"><div class="table-content">这是电话</div></el-col>
    <el-col :span="5"><div class="table-content">很明显这是联系地址</div></el-col>
    <el-col :span="4"><div class="table-content">很明显这是供应商描述</div></el-col>
    <el-col :span="4"><div class="table-content">
      <el-button type="text">修改</el-button>
      <el-button type="text">删除</el-button>
    </div></el-col>
  </el-row>
  <!--表单end-->
</template>

<script>
export default {
  name: 'GoodsSupplierTable'
}
</script>

<style scoped>
  .table-main{
    font-size: 12px;
    text-align: center;
    background: #fff;
  }
  .table-content{
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #eee;
  }
</style>
