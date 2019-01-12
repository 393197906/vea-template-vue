<template>
  <div v-loading="loading">
    <!--头部搜索start-->
    <div class="search-box">
      <el-button size="small" type="warning" icon="el-icon-delete">批量删除</el-button>
      <el-button size="small" type="primary" icon="el-icon-sort">批量恢复</el-button>
      <div class="searcher">
        <div class="type-class">
          <span class="demonstration">商品分类：</span>
          <el-cascader
            id="goods-type"
            placeholder="试试搜索：琵琶腿"
            expand-trigger="hover"
            :options="goodsTypeOptions"
            filterable
            size="small"
          ></el-cascader>
        </div>

        <div class="type-class">
          <span>商品名称：</span>
          <el-autocomplete
            id="goods-name"
            size="small"
            placeholder="请输入名称"
            :trigger-on-focus="false"
          >
          </el-autocomplete>
        </div>

        <!--<el-button size="small" type="primary" plain>更多搜索</el-button>-->
        <el-button size="small" type="primary" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <!--头部搜索end-->

    <el-table
      :data="list"
    >
      <el-table-column
        type="selection"
        width="45"/>
      <el-table-column
        label="商品图片"
        width="100"
      >
        <template slot-scope="scope">
          <img style="width:80px;height:80px"
               :src="scope.row.img" :alt="scope.row.img">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="price"
        align="center"
        label="商品价格">
      </el-table-column>
      <el-table-column
        prop="stock"
        align="center"
        label="商品库存">
      </el-table-column>
      <el-table-column
        prop="sale_num"
        align="center"
        label="商品销量">
      </el-table-column>
      <el-table-column
        prop="order"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">恢复
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页start-->
    <div class="page-box">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="params.page"
        :page-size="params.pre_page"
        @current-change="pageChange"
        :total="total_count">
      </el-pagination>
    </div>
    <!--分页end-->
  </div>
</template>

<script>
import GoodsRecoverTable from '@/components/goods/goodsRecover/GoodsRecoverTable'
import mixin from '@/components/mixin/mixin.js'

export default {
  name: 'list',
  data () {
    return {
      list: [],
      loading: false,
      total_count: 1,
      params: {
        page: 1,
        pre_page: 10
      }
    }
  },
  created () {
    this._recoverList()
  },
  methods: {
    // 获取回收列表
    async _recoverList () {
      this.loading = true
      const {err, data} = await this.$service.goods.goods_recover.list(this.params)
      this.list = data.result
      this.loading = false
      if (err) return
    },
    // 当前页码变更
    pageChange (val) {
      this.params.page = val
      this._recoverList()
    }
  },
  mixins: [mixin],
  components: {
    GoodsRecoverTable
  }
}
</script>

<style scoped>
  .search-box {
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
    margin-bottom: 10px;
  }

  .searcher {
    float: right;
  }

  .type-class {
    float: left;
    margin-right: 10px;
  }

  #goods-type, #goods-name {
    width: 180px;
  }

  .toolbar {
    height: 40px;
    line-height: 40px;
    background: #fff;
    padding: 0 10px;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

</style>
