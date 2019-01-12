<template>
  <div v-loading="loading">
    <!--头部搜索start-->
    <GoodsSearch @searchData="searchData" ref="search"/>
    <!--头部搜索end-->

    <!--商品推荐开始-->
    <el-popover
      ref="recommend"
      placement="bottom"
      title="推荐"
      width="306"
      trigger="click"
      v-model="recommend.show"
    >
      <el-checkbox-group v-model="recommend.select">
        <el-checkbox label="is_top">置顶</el-checkbox>
        <el-checkbox label="is_hot">热卖</el-checkbox>
        <el-checkbox label="is_recommend">精品</el-checkbox>
        <el-checkbox label="is_new">新品</el-checkbox>
      </el-checkbox-group>
      <p style="text-align: center;margin-top: 15px">
        <el-button size="mini" @click="recommend.show=false">取消</el-button>
        <el-button type="primary" size="mini" @click="handelRecommend">保存</el-button>
      </p>
    </el-popover>
    <!--商品推荐结束-->
    <!--全选start-->
    <div class="toolbar" v-if="$checkActionAccess($ACCESS.GOODS_SHELF) || $checkActionAccess($ACCESS.GOODS_RECOMMEND)">
      <el-button size="mini" icon="el-icon-sort-up" @click="handleMulpiTag(2)"
                 v-if="$checkActionAccess($ACCESS.GOODS_SHELF)">上架
      </el-button>
      <el-button size="mini" icon="el-icon-sort-down" @click="handleMulpiTag(1)"
                 v-if="$checkActionAccess($ACCESS.GOODS_SHELF)">下架
      </el-button>
      <el-button size="mini" v-if="$checkActionAccess($ACCESS.GOODS_RECOMMEND)" type="primary" icon="el-icon-star-off"
                 v-popover:recommend>商品推荐
      </el-button>
    </div>
    <!--全选end-->

    <el-table :data="list" @selection-change="handleSelectionChange" refs="goodsTable">
      <el-table-column type="selection" width="45"/>
      <el-table-column label="商品图片" width="100">
        <template slot-scope="scope">
          <img style="width:80px;height:80px" :src="scope.row.pic_cover_small" :alt="scope.row.img">
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" align="center" label="商品名称"></el-table-column>
      <!--<el-table-column-->
      <!--align="center"-->
      <!--width="100"-->
      <!--label="商品价格">-->
      <!--<template slot-scope="scope">{{scope.row.price}}</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="stock"
        align="center"
        width="100"
        label="商品库存">
        <template slot-scope="scope">
          {{scope.row.stock}}
        </template>
      </el-table-column>
      <el-table-column
        prop="sales"
        align="center"
        width="100"
        label="商品销量">
      </el-table-column>
      <el-table-column
        prop="is_shelf"
        align="center"
        label="上下架"
        width="150">
        <template slot-scope="scope">
          <el-switch
            :disabled="!$checkActionAccess($ACCESS.GOODS_SHELF)"
            @change="stateChange(scope.row.goods_id,scope.row.state)"
            v-model="scope.row.state"
            active-text="上架"
            inactive-text="下架">
          </el-switch>
          <el-button style="margin-top:10px" size="mini" v-if="scope.row.forced_off_status==2" type="danger" plain
                     disabled>强制下架
          </el-button>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--prop="order"-->
      <!--align="center"-->
      <!--label="排序">-->
      <!--<template slot-scope="scope">-->
      <!--<el-input :value="scope.row.sort" size="small" class="el-input1" @blur="changeSort(scope.row.goods_id)"/>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="order"
        align="center"
        label="推荐">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="parseInt(scope.row.is_top)">置顶</el-tag>
          <el-tag type="danger" size="mini" v-if="parseInt(scope.row.is_hot)">热卖</el-tag>
          <el-tag type="warning" size="mini" v-if="parseInt(scope.row.is_recommend)">精品</el-tag>
          <el-tag type="success" size="mini" v-if="parseInt(scope.row.is_new)">新品</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="200"
        v-if="$checkActionAccess($ACCESS.GOODS_EDIT) || $checkActionAccess($ACCESS.GOODS_DELETE)"
        label="操作">
        <template slot-scope="scope">
          <router-link :to="{path:'/goods/goodsskuedit/' + scope.row.goods_id}">
            <el-button size="mini" icon="el-icon-edit" v-if="$checkActionAccess($ACCESS.GOODS_EDIT)">编辑</el-button>
          </router-link>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            v-if="$checkActionAccess($ACCESS.GOODS_DELETE)"
            @click="handleDelete(scope.row.goods_id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页start-->
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
    <!--分页end-->

  </div>
</template>

<script>
import GoodsSearch from '@/components/goods/goodsList/GoodsSearch.vue'
import GoodsTable from '@/components/goods/goodsList/GoodsTable.vue'
import mixin from '@/components/mixin/mixin.js'

export default {
  data () {
    return {
      recommend: {
        show: false,
        select: []
      }, // 商品推荐
      list: [],
      sku_list: [],
      category: [],
      state: true,
      dialogFormVisible: false,
      multipleSelection: [],
      form: {},
      formLabelWidth: '100px',
      total_count: 1,
      pramas: {
        pre_page: 10,
        page: 1,
        goods_name: '',
        code: '',
        category_id: '',
        state: ''
      }
    }
  },
  components: {
    GoodsSearch,
    GoodsTable
  },
  mixins: [mixin],
  created () {
    // const {page, goods_name, code, category_id, state} = this.$route.query;
    this.pramas.page = 1
    this.pramas.pre_page = 10
    this._goodsList()
    this._getCategory()
  },
  activated () {
    this._goodsList()
    this._getCategory()
  },
  methods: {
    // 商品推荐
    async handelRecommend () {
      if (!this.multipleSelection.length) {
        this.recommend.show = false
        this.$message.warning('请先选择要推荐的商品')
        return
      }
      // if (!this.recommend.select.length) {
      //   this.$message.warning('请选择要推荐的标签')
      //   return
      // }
      const recommend = {
        is_hot: 0,
        is_recommend: 0,
        is_new: 0,
        is_top: 0
      }
      this.recommend.select.forEach(item => {
        recommend[item] = 1
      })
      this.loading = true
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.goodState({
        goods_id: JSON.stringify(this.multipleSelection),
        statu: 3,
        recommend: JSON.stringify(recommend)
      })
      this.loading = false
      if (err) return
      this.$message.success('成功保存')
      this._goodsList()
      this.this.recommend.select = []
    },
    // 获取商品列表
    async _goodsList (args) {
      this.loading = true
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.goodsList({
        ...args,
        ...this.pramas
      })
      if (err) return
      this.loading = false
      this.total_count = data.total_count || 1
      this.list = data.result
      this.list.forEach(item => {
        item.state = item.state == 1
        if (!(/^[1-9]+[0-9]*]*$/.test(item.stock))) {
          item.stock.toFixed(3)
        }
      })
      this.$goTop()
    },
    /** 分页 */
    handleCurrentChange (val) {
      // this.$router.push({
      //   path: "/goods/list",
      //   query: {...this.pramas, page: val}
      // });
      this.pramas.page = val
      this._goodsList()
    },
    // 获取商品分类
    async _getCategory () {
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.category()
      this.category = data.result
      if (err) return
    },
    // 搜索数据
    searchData (data) {
      this.pramas.page = 1
      this.pramas.goods_name = data.goods_name
      this.pramas.code = data.code
      this.pramas.category_id = data.category_id
      this.pramas.state = data.state
      this._goodsList()
    },
    // 更改排序等级
    changeSort (id) {},

    // 删除商品
    handleDelete (id) {
      this.$confirm('确定要删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.goods.goods_common_api.goodDel(id)
          this.$message({
            type: 'success',
            message: data.message
          })
          this._goodsList()
        })
        .catch(() => {
        })
    },

    // 编辑商品信息
    handleEdit (id) {
      this.dialogFormVisible = true
    },

    // 商品上下架
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach(item => {
        this.multipleSelection.push(item.goods_id)
      })
    },
    stateChange (id, statu) {
      this.multipleSelection = []
      this.multipleSelection.push(id)
      statu = statu ? 2 : 1
      this.handleMulpiTag(statu)
    },
    async handleMulpiTag (statu) {
      if (!this.multipleSelection.length) {
        this.$message({
          message: '请先选择商品！',
          type: 'warning'
        })
        return false
      }
      this.loading = true
      const {
        err,
        data
      } = await this.$service.goods.goods_common_api.goodState({
        goods_id: JSON.stringify(this.multipleSelection),
        statu: statu
      })
      if (err) return
      this.$message({
        type: 'success',
        message: data.message
      })
      this.loading = false
      this._goodsList()
    }
  }
}
</script>

<style scoped>
  .po-footer {
    padding-top: 10px;
    text-align: center;
  }

  .po-p {
    padding: 5px 0;
  }

  .toolbar {
    /*background: #fff;*/
    padding: 10px;
  }

  .dilogForm .el-input {
    width: 200px;
  }

  .el-input1 {
    width: 70px;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  .text-align {
    text-align: center;
  }
</style>
