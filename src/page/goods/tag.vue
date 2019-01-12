<template>
  <div class="goods-tag">
    <slot name="breadcrumb"></slot>
    <!--头部start-->
    <div class="search-box">
      <el-button size="small" type="primary" icon="el-icon-plus">添加商品标签</el-button>
    </div>
    <!--头部end-->
    <el-table
      :data="list"
    >
      <el-table-column
        label="排序"
        width="180">
        <template slot-scope="scope">
          <el-input-number :value="1" :min="1" :max="10" size="small"/>
        </template>
      </el-table-column>
      <el-table-column
        label="商品标签"
      >
      </el-table-column>
      <el-table-column
        width="180"
        label="操作">
      </el-table-column>
    </el-table>

    <!--分页start-->
    <div class="page-box">
      <el-pagination
        id="page"
        background
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
    <!--分页end-->
  </div>

</template>

<script>
export default {
  name: 'list',
  data () {
    return {
      list: [
        {order: 1, name: '安切洛蒂'}
      ]
    }
  }
}
</script>

<style scoped>
  .search-box {
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
    margin-top: 10px;
  }

  .table-head {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }

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

  .table-content-sort {
    width: 120px;
  }

  .table-content-tag {
    width: 400px;
  }

  .page-box {
    background: #fff;
    height: 60px;
    line-height: 60px;
    padding-top: 20px;
  }

  #page {
    width: 600px;
    margin: 0 auto;
    text-align: center;
    color: #333;
    font-weight: normal;
  }
</style>
