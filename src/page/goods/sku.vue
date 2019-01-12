<style scoped>
  @import "../../style/common.css";
</style>
<template>
  <div v-loading="loading">
    <!--头部start-->
    <div class="search-box card_view" v-if="$checkActionAccess($ACCESS.SKU_ADD)">
      <el-button size="small" type="warning" icon="el-icon-delete" v-show="false">批量删除</el-button>
      <router-link to="/goods/sku/skuadd">
        <el-button size="mini" type="primary" icon="el-icon-plus">添加规格
        </el-button>
      </router-link>
    </div>
    <!--头部end-->
    <div class="card_view">
      <el-table :data="goods_sku">
        <el-table-column type="selection"/>
        <el-table-column
          prop="spec_name"
          align="center"
          width="180"
          label="规格名称">
        </el-table-column>
        <el-table-column
          prop="value"
          align="center"
          label="规格属性"
        >
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.value">{{item.spec_value_name}}<span
              v-if="index!=scope.row.value.length-1">，</span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          align="center"
          width="180"
          label="排序">
          <template slot-scope="scope">
            {{scope.row.sort}}
            <!--<el-input-number :min="0" :value="scope.row.sort"  size="small"/>-->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
          v-if="$checkActionAccess($ACCESS.SKU_EDIT)"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.spec_id)">编辑</el-button>
            <!-- </el-button>
            &lt;!&ndash;<el-button&ndash;&gt;
            &lt;!&ndash;size="mini"&ndash;&gt;
            &lt;!&ndash;type="danger"&ndash;&gt;
            &lt;!&ndash;:disabled="scope.row.hidden ? true:false"&ndash;&gt;
            &lt;!&ndash;@click="handleDelete(scope.row.spec_id)">删除&ndash;&gt;
            &lt;!&ndash;</el-button>&ndash;&gt; -->
          </template>
        </el-table-column>
      </el-table>

      <!--分页start-->
      <div class="page-box">
        <el-pagination
          id="page"
          background
          layout="prev, pager, next"
          :page-size="pre_page"
          :current-page.sync="page"
          @current-change="pageChange"
          :total="total_count">
        </el-pagination>
      </div>
      <!--分页end-->
    </div>

  </div>

</template>

<script>
import GoodsSkuTable from '@/components/goods/goodsSku/GoodsSkuTable'
import mixin from '@/components/mixin/mixin.js'

export default {
  name: 'list',
  data () {
    return {
      loading: false,
      page: 1,
      pre_page: 10,
      goods_sku: [],
      total_count: 1
    }
  },
  mixins: [mixin],
  components: {
    GoodsSkuTable
  },
  created () {
    this.getData()
  },
  methods: {
    /** 获取规格列表 */
    async getData () {
      this.loading = true
      const {err, data} = await this.$service.goods.goods_sku.list({
        page: this.page,
        pre_page: this.pre_page
      })
      this.loading = false
      this.goods_sku = data.result
      this.total_count = data.total_count || 1
    },
    /** 当前页数改变 */
    pageChange (val) {
      this.page = val
      this.getData()
    },
    /** 删除规格 */
    handleDelete (id) {
      this.$confirm('确定要删除该条规格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.goods.goods_sku.sku_del(id)
          this.$message({
            type: 'success',
            message: data.message
          })
          this.getData()
        })
        .catch(() => {
        })
    },
    // 编辑
    handleEdit (id) {
      if (this.hidden) return
      this.$router.push({
        path: `/goods/sku/skuedit/${id}`
      })
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
    margin-bottom: 10px;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }
</style>
