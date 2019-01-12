<template>

  <!--表单start-->
  <el-row class="table-main">
    <el-col :span="2">
      <div class="table-content">
        <el-checkbox label=""></el-checkbox>
      </div>
    </el-col>
    <el-col :span="5">
      <div class="table-content">这是规格</div>
    </el-col>
    <el-col :span="10">
      <div class="table-content">这是规格属性</div>
    </el-col>
    <el-col :span="3">
      <div class="table-content">
        <el-input class="table-content-tag" size="small" v-model="input" placeholder="请输入内容"></el-input>
      </div>
    </el-col>
    <el-col :span="4">
      <div class="table-content">
        <el-button type="text">修改</el-button>
        <el-button type="text">删除</el-button>
      </div>
    </el-col>
  </el-row>
  <!--表单end-->

</template>

<script>
export default {
  name: 'GoodsSkuTable'
}
</script>

<style scoped>

  .table-main {
    font-size: 12px;
    text-align: center;
    background: #fff;
  }

  .table-content {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #eee;
  }
</style>
