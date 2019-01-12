<template>
  <!--头部搜索start-->
  <div class="search-box">
    <el-button size="small" type="primary" icon="el-icon-plus" @click="goToGoodAdd"
               v-if="$checkActionAccess($ACCESS.GOODS_ADD)"
    >发布商品
    </el-button>
    <div class="searcher">
      <div class="type-class">
        <span class="demonstration">商品分类：</span>
        <el-cascader ref="mycascader"
          change-on-select
          id="goods-type"
          placeholder="请选择商品分类"
          :options="category_list"
          :props="category_props"
          v-model="goods_category"
          size="small"
          clearable
        ></el-cascader>
      </div>

      <div class="type-class">
        <span>商品名称：</span>
        <el-input
          id="goods-name"
          size="small"
          clearable
          placeholder="请输入名称"
          v-model="goods_name"
        >
        </el-input>
      </div>

      <!--  <div class="type-class">
         <span>商品编码：</span>
         <el-input
           id="goods-code"
           size="small"
           clearable
           placeholder="请输入编码"
           v-model="code"
         >
         </el-input>
       </div> -->

      <div class="type-class">
        <span>上下架：</span>
        <el-select v-model="state" placeholder="请选择" clearable size="small">
          <el-option :label="item.label" :value="item.value" v-for="item in states" :key="item.value"></el-option>
        </el-select>
      </div>

      <!--<el-button size="small" type="primary" plain @click="show = !show">更多搜索</el-button>-->
      <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>

  </div>

</template>

<script>
import mixin from '@/components/mixin/mixin.js'

export default {
  async created () {
    const {err, data} = await this.$service.goods.goods_common_api.category()
    this.category_list = data.result

    const {goods_name, code, category_id, state} = this.$route.query
    this.goods_name = goods_name || ''
    this.code = code || ''
    this.category_id = category_id || ''
    this.state = state
    if (err) return
  },
  data () {
    return {
      category_list: [],
      category_props: {
        value: 'category_id',
        label: 'category_name',
        children: 'children'
      },
      goods_category: [],
      code: '',
      state: '',
      goods_name: '',
      category_id: '',
      states: [
        {
          value: 1,
          label: '已上架'
        },
        {
          value: 0,
          label: '已下架'
        }
      ]

    }
  },
  methods: {
    search () {
      let data = {
        code: this.code,
        state: this.state,
        goods_name: this.goods_name,
        category_id: this.goods_category[this.goods_category.length - 1]
      }
      this.$emit('searchData', data)
    }
  },
  name: 'GoodsSearch',
  mixins: [mixin]
}
</script>

<style scoped>
  .search-box {
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
  }

  .searcher {
    /*width: 70%;*/
    /*float: right;*/
    display: inline-block;
    margin-left: 10px;
  }

  .type-class {
    float: left;
    margin-right: 10px;
  }

  #goods-name, #goods-code, #goods-state {
    width: 125px;
  }

  #goods-type {
    width: 180px;
  }

  .el-select {
    width: 100px;
  }

  .el-input {
    width: 100px;
  }

  /**
  更多搜索暂注释
  .more-search{
    clear: both;
  }
  .more-search-box{
    float: right;
    margin-right: 10px;
  }
  */

</style>
