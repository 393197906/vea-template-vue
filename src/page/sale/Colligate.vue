<template>
  <div v-loading="loading">
    <common-tabs :default-menu.sync="config.status" :menu-options.sync="tabs" @stateChange="stateChange"></common-tabs>
    <!--头部start-->
    <div class="search-box">
      <!-- <el-button size="small" type="warning">批量删除</el-button> -->
      <router-link to="/sale/colligate/colligatesave">
        <el-button size="small" type="primary" icon="el-icon-plus" v-if="$checkActionAccess($ACCESS.SALE_ZHPFJ_ADD)">
          添加综合批发价活动
        </el-button>
      </router-link>
      <div class="searcher">
        <div class="type-class">
          <el-input v-model="config.compre_name" placeholder="请输入活动名称" size="small"></el-input>
        </div>
        <el-button size="small" type="primary" icon="el-icon-search" @click="searchReduction">搜索</el-button>
      </div>
    </div>
    <!--头部end-->
    <!--表头start-->
    <el-row class="table-head">
      <el-col :span="5">
        <div class="grid-content">活动名</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">有效时间</div>
      </el-col>
      <el-col :span="7">
        <div class="grid-content">活动状态</div>
      </el-col>
      <!--<el-col :span="4">-->
      <!--<div class="grid-content">创建时间</div>-->
      <!--</el-col>-->
      <el-col :span="4">
        <div class="grid-content">操作</div>
      </el-col>
    </el-row>
    <!--表头end-->
    <!--表单start-->
    <div class="table-main" v-if="reduction_list.length<1||!reduction_list">
      <p style="line-height:60px; border-bottom: 1px solid #eee;">暂无对应数据</p>
    </div>
    <el-row class="table-main" :key="dataItem.discount_id" v-for="(dataItem, i) in reduction_list">
      <el-col :span="5">
        <div class="table-content">{{dataItem.compre_name}}</div>
      </el-col>
      <el-col :span="8">
        <div class="table-content">{{dataItem.start_time | formatTime}} 至 {{dataItem.end_time | formatTime}}</div>
      </el-col>
      <el-col :span="7">
        <div class="table-content">{{dataItem.status_info}}</div>
      </el-col>
      <!--<el-col :span="4">-->
      <!--<div class="table-content">{{dataItem.create_time | formatTime}}</div>-->
      <!--</el-col>-->
      <el-col :span="4">
        <div class="table-content">
          <template v-if="$checkActionAccess($ACCESS.SALE_ZHPFJ_EDIT)">
            <el-button type="text" v-if="dataItem.status===0" @click="data_edit(dataItem.comprehensive_id)">编辑
            </el-button>
            <el-button type="text" v-if="dataItem.status===1&&$checkActionAccess($ACCESS.SALE_ZHPFJ_CLOSE)" @click="closeActive(dataItem.comprehensive_id)">关闭
            </el-button>
            <el-button type="text" v-if="dataItem.status!==1&&$checkActionAccess($ACCESS.SALE_ZHPFJ_DELETE)" @click="_reducitonDelete(dataItem.comprehensive_id)">删除
            </el-button>
          </template>
          <el-button v-if="$checkActionAccess($ACCESS.SALE_ZHPFJ_DETAIL)" type="text"
                     @click="_reductionDetail(dataItem.comprehensive_id)">详情
          </el-button>
        </div>
      </el-col>
    </el-row>
    <!--表单end-->
    <!--分页start-->
    <div class="page-box">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="config.page"
        background
        :page-size="config.pre_page"
        layout="prev, pager, next"
        :total="total_count">
      </el-pagination>
    </div>
    <!--分页end-->
    <!-- 详情弹窗 -->
    <el-dialog title="综合批发价详情" :visible.sync="dialogTableVisible" :modal="false" class="data_detail_alert">
      <ul class="data_view">
        <li class="data_row clearfix">
          <span class="data_tit">活动名称</span>
          <span class="data_info">{{data_detail.compre_name}}</span>
        </li>
        <li class="data_row clearfix">
          <span class="data_tit">有效期</span>
          <span
            class="data_info">{{data_detail.start_time | formatTime}} 至 {{data_detail.end_time | formatTime}}</span>
        </li>
        <li class="data_row clearfix">
          <span class="data_tit">活动状态</span>
          <span class="data_info">{{data_detail.status_info}}</span>
        </li>
        <li class="data_row clearfix">
          <div class="data_name">优惠规则</div>
          <div>
            <el-table
              :data="data_detail.rule"
              border
              style="width: 100%">
              <!--<el-table-column-->
                <!--prop="rule_id"-->
                <!--label="ID">-->
              <!--</el-table-column>-->
              <el-table-column
                prop="comprehensive_id"
                label="综合ID">
              </el-table-column>
              <el-table-column
                prop="nums"
                label="活动数量">
              </el-table-column>
            </el-table>
          </div>
        </li>
        <li class="data_row clearfix">
          <div class="data_name">商品列表</div>
          <div>
            <div v-if="typeof data_detail.goods =='string'" style="text-align:center;padding:5px">
              {{data_detail.goods}}
            </div>
            <template v-else v-for="goodItem in data_detail.goods">
              <div class="goods_view clearfix">
                <span class="data_tit"><img :src="goodItem.pic_url" alt="" width="40"></span>
                <span class="data_info">{{goodItem.goods_name | sublen(20)}}</span>
              </div>
            </template>
          </div>

        </li>

      </ul>
    </el-dialog>
    <!-- 详情弹窗 end -->
  </div>
</template>

<script>
import commonTabs from '@/components/common/CommonTab.vue'
export default {
  name: 'Colligate',
  data () {
    return {
      loading: false,
      dialogTableVisible: false,
      tabs: [
        {label: '全部', status: ''},
        {label: '未发布', status: '0'},
        {label: '进行中', status: '1'},
        {label: '已关闭', status: '3'},
        {label: '已结束', status: '4'}
      ],
      total_count: 0,
      config: {
        page: 1,
        pre_page: 10,
        status: '',
        compre_name: ''
      },
      checkAll: false,
      checkModal: [],
      reduction_list: [],
      data_detail: ''
    }
  },
  components: {commonTabs},
  created () {
    const {page, status, compre_name} = this.$route.query
    this.config.page = parseInt(page) || 1
    this.config.status = status
    this.config.compre_name = compre_name || ''
    this._reducitonList()
  },
  methods: {
    /** 活动状态切换 */
    stateChange (key) {
      this.config.page = 1
      this.config.status = key
      this._reducitonList()
    },
    // 全选
    handleCheckAllChange () {},
    /** 编辑 */
    data_edit (id) {
      this.$router.push({name: 'colligateedit', params: {id: id}})
    },
    /** 活动关闭 */
    closeActive (id) {
      this.$confirm('确定要关闭该活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.shopmanager.colligate.colligateStatus(id, {
            status: 3
          })
          this.$message({
            type: 'success',
            message: data.message
          })
          this._reducitonList()
        })
        .catch(() => {
        })
    },
    // 更改页码
    handleCurrentChange (val) {
      this.config.page = val
      this._reducitonList()
    },
    /** 活动详情 */
    async _reductionDetail (id) {
      this.dialogTableVisible = true
      const {
        err,
        data
      } = await this.$service.shopmanager.colligate.colligateDetail(id)
      this.data_detail = data.result
    },
    // 搜索结果列表
    searchReduction () {
      this.config.page = 1
      this._reducitonList()
    },
    // 满减删除
    _reducitonDelete (id) {
      this.$confirm('确定要删除该活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.shopmanager.colligate.colligateDelete({
            id: id
          })
          this.$message({
            type: 'success',
            message: data.message
          })
          this._reducitonList()
        })
        .catch(() => {
        })
    },
    // 请求列表
    async _reducitonList () {
      this.loading = true
      const {err, data} = await this.$service.shopmanager.colligate.list(this.config)
      this.loading = false
      if (err) return
      this.total_count = data.total_count || 0
      this.reduction_list = data.result
    }
  }
}
</script>

<style scoped>
  @import "./sale.css";

  .search-box {
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
  }

  .searcher {
    float: right;
  }

  .type-class {
    float: left;
    margin-right: 10px;
  }

  .table-head {
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #eee;
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
    text-align: center;
  }

  .page-box {
    background: #fff;
    height: 60px;
    line-height: 60px;
    padding-top: 20px;
  }

  .text-align {
    text-align: center;
  }
</style>
