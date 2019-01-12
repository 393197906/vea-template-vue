<template>
  <div>
    <slot name="breadcrumb"></slot>
    <!--头部start-->
    <div class="search-box">
      <el-button size="small" type="warning">批量删除</el-button>
      <el-button size="small" type="primary">添加供应商</el-button>
      <div class="searcher">
        <div class="type-class">
          <el-autocomplete
            id="goods-code"
            size="small"
            placeholder="请输入供应商名称"
            :trigger-on-focus="false"
          >
          </el-autocomplete>
        </div>
        <el-button size="small" type="primary">搜索</el-button>
      </div>
    </div>
    <!--头部end-->

    <!--表头start-->
    <el-row class="table-head">
      <el-col :span="2"><div class="grid-content">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      </div></el-col>
      <el-col :span="4"><div class="grid-content">供应商名称</div></el-col>
      <el-col :span="2"><div class="grid-content">联系人</div></el-col>
      <el-col :span="3"><div class="grid-content">联系电话</div></el-col>
      <el-col :span="5"><div class="grid-content">联系地址</div></el-col>
      <el-col :span="4"><div class="grid-content">供货商描述</div></el-col>
      <el-col :span="4"><div class="grid-content">操作</div></el-col>
    </el-row>
    <!--表头end-->

    <!--表单start-->
    <GoodsSupplierTable v-for="item in 3"/>
    <!--表单end-->

    <!--分页start-->
    <div class="page-box">
      <el-pagination
        id="page"
        background
        layout="prev, pager, next"
        :page-size="page_size"
        :total="page_total">
      </el-pagination>
    </div>
    <!--分页end-->
  </div>

</template>

<script>
import GoodsSupplierTable from '@/components/goods/goodsSupplier/GoodsSupplierTable'
import mixin from '@/components/mixin/mixin.js'

export default {
  name: 'list',
  mixins: [mixin],
  components: {
    GoodsSupplierTable
  }
}
</script>

<style scoped>
  .search-box{
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
    margin-top: 10px;
  }
  .searcher{
    float: right;
  }
  .type-class{
    float: left;
    margin-right: 10px;
  }
  .table-head{
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
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
  .page-box{
    background: #fff;
    height: 60px;
    line-height: 60px;
    padding-top: 20px;
  }
  #page{
    width: 600px;
    margin: 0 auto;
    text-align: center;
    color: #333;
    font-weight: normal;
  }
</style>
