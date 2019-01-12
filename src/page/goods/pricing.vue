<template>
  <div>
    <div class="search-box card_view" v-if="pricingData.length<5 && $checkActionAccess($ACCESS.PRICE_SYSTEM_ADD)">
      <router-link to="/goods/pricing/add">
        <el-button size="mini" type="primary" icon="el-icon-plus">添加价格体系
        </el-button>
      </router-link>
    </div>

    <div style="background: #fff">
      <el-table :data="pricingData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="100px" align="center"></el-table-column>
        <!--<el-table-column prop="price_type_id" label="价格体系序号" align="center"></el-table-column>-->
        <el-table-column prop="price_type_name" label="价格体系名称" align="center"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <p v-if="parseInt(scope.row.status) === 11">启用</p>
            <p v-if="parseInt(scope.row.status) === 10">禁用</p>
          </template>
        </el-table-column>
        <el-table-column label=" 默认" align="center">
          <template slot-scope="scope">
            <i class="el-icon-success" style="color:#67c23a" v-if="scope.row.is_default==10"/>
            <i class="el-icon-error" style="color:#f56c6c" v-else/>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$checkActionAccess($ACCESS.PRICE_SYSTEM_EDIT) || $checkActionAccess($ACCESS.PRICE_SYSTEM_SET_DEFAULT)"
          align="center"
          width="180"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="setDefault(scope.row.price_type_id)"
              v-if=" $checkActionAccess($ACCESS.PRICE_SYSTEM_SET_DEFAULT)"
              :disabled="scope.row.is_default==10"
            >
              设为默认
            </el-button>
            <el-button size="mini" type="primary" v-if="$checkActionAccess($ACCESS.PRICE_SYSTEM_EDIT)" @click="handleEdit(scope.row.price_type_id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // activeIndex: '1',
      activeIndex2: '1',
      pricingData: [],
      page: 1,
      pre_page: 10,
      total_count: 1,
      loading: false,
      multipleSelection: []
    }
  },
  created () {
    this.getPricingData()
  },
  methods: {
    async setDefault (id) {
      const {err, data} = await this.$service.goods.pricing.setDefault(id)
      if (err) return
      this.$message.success('默认价格体系设置成功')
      this.getPricingData()
    },
    //    获取价格列表(=^.^=)
    async getPricingData () {
      this.loading = true
      const {err, data} = await this.$service.goods.pricing.pricing_list({
        page: this.page,
        pre_page: this.pre_page
      })
      if (err) return
      this.loading = false
      this.pricingData = data.result
    },
    //  分页
    pageChange (val) {
      this.page = val
      this.getPricingData()
    },
    // 编辑
    handleEdit (id) {
      this.$router.push({
        path: `/goods/pricing/edit/${id}`
      })
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    addVip () {
      this.$router.push({
        path: '/goods/add_vip'
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style>
  .yq_link {
    height: 40px;
    line-height: 40px;
    background: #ffffdc;
    color: #BA8941;
    width: 98%;
    margin: 10px auto 0;
    font-size: 18px;
    border-left: 4px solid #EDD28A;
  }

  .show_ul {
    background: #ffffdc;
    width: 98%;
    margin: 0 auto;
    border-left: 4px solid #EDD28A;
    padding: 10px 0;
  }

  .show_ul li {
    color: #BA8941;
    font-size: 12px;
    line-height: 20px;
    margin-left: 40px;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }
</style>
