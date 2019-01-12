<template>
  <div>
    <!--头部start-->
    <div class="explanation_warp">
      <el-collapse accordion v-model="accordion">
        <div class="explanations">
          <el-collapse-item name="1">
            <template slot="title">
              <div class="title explain-checkZoom">
                <i class="fa fa-bullhorn"></i>
                <h4>权限说明</h4>
              </div>
            </template>
            <ul class="explain-panel">
              <li>
                <span>根据角色的不同，设置相应的权限即可使用</span>
              </li>
            </ul>
            <ul class="explain-panel">
              <li>
                <span>收银台关联权限：商品列表、用户列表</span>
              </li>
            </ul>
            <ul class="explain-panel">
              <li>
                <span>生成出库单关联权限：店铺模块中联系方式列表</span>
              </li>
            </ul>
            <ul class="explain-panel">
              <li>
                <span>订单详情关联权限：商品列表</span>
              </li>
            </ul>
            <ul class="explain-panel">
              <li>
                <span>商品发布关联权限：价格体系、商品规格</span>
              </li>
            </ul>
            <ul class="explain-panel">
              <li>
                <span>用户列表关联权限：价格体系</span>
              </li>
            </ul>
            <ul class="explain-panel">
              <li>
                <span>采购入库关联权限：仓库列表、供应商列表</span>
              </li>
            </ul>
            <ul class="explain-panel">
              <li><span>页面功能按钮跳转需要单独设定相应权限（例：财务流水订单号跳转就需要给订单详情的权限）</span></li>
            </ul>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
    <div class="search-box">
      <el-button icon="el-icon-plus" type="primary" size="small"
                 v-if="$checkActionAccess($ACCESS.ROLE_ADD)"
                 @click="$router.push({
                    path: '/user/role/role_add'
                 })">添加角色
      </el-button>
      <div class="searcher">
        <span style="float:left;margin-right: 15px">角色名称:</span>
        <div class="type-class">
          <el-input
            size="small"
            v-model="role_name"
            clearable
            placeholder="请输入角色名称"
          />
        </div>
        <el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      </div>
    </div>
    <!--头部end-->
    <el-table
      :data="list"
    >
      <el-table-column
        prop="id"
        align="center"
        label="角色ID"/>
      <el-table-column
        prop="role_name"
        align="center"
        label="角色名">
      </el-table-column>
      <el-table-column
        prop="status_info"
        align="center"
        label="角色状态">
      </el-table-column>
      <el-table-column
        align="center"
        v-if="$checkActionAccess($ACCESS.ROLE_EDIT) || $checkActionAccess($ACCESS.ROLE_DELETE)"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="$checkActionAccess($ACCESS.ROLE_EDIT)"
            @click="$router.push({
              path: '/user/role/role_detail/' + scope.row.id,
            })">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="$checkActionAccess($ACCESS.ROLE_DELETE)"
            @click="delRole(scope.row.id)">删除
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
        @current-change="changePage"
        :current-page="page.page"
        :page-size="page.pre_page"
        :total="page.total_count">
      </el-pagination>
    </div>
    <!--分页end-->
  </div>

</template>

<script>
  export default {
    name: 'role',
    data () {
      return {
        accordion: '1',
        role_name: '',
        page: {
          page: 1,
          pre_page: 10,
          total_count: 0
        },
        list: [{}]
      }
    },
    created () {
      this.getList()
    },
    methods: {
      // 删除角色
      delRole (id) {
        this.$confirm('确定要删除该角色吗?', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {err, data} = await this.$service.member.roleDelete({id: id})
          if (err) return
          this.$message.success('删除成功')
          this.getList()
        })
      },
      // 查询
      doSearch () {
        this.page.page = 1
        this.getList()
      },
      // 换页
      changePage (val) {
        this.page.page = val
        this.getList()
      },
      // 获取列表
      async getList () {
        let pramas = {
          page: this.page.page,
          pre_page: this.page.pre_page,
          role_name: this.role_name
        }
        const {err, data} = await this.$service.member.roleList(pramas)
        if (err) return
        const {total_count, result} = data
        this.list = result
        this.page.total_count = total_count
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
    margin: 10px 0;
  }

  .searcher {
    float: right;
  }

  .type-class {
    float: left;
    margin-right: 10px;
  }


  .page-box {
    width: 100%;
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  .text-align {
    text-align: center;
  }

  .table-img img {
    height: 50px;
    width: 50px;
    border-radius: 50px;
    margin-top: 6px;
  }

  .explanation_warp {
    color: #BA8941;
    background-color: #ffffdc;
    border: 0;
    border-left: 4px solid #EDD28A;
    display: block;
    padding: 6px 9px;
    position: relative;
    overflow: hidden;
    border-radius: 0px;

  }

  .explain-checkZoom {
    background-color: rgb(255, 255, 220);
    height: 100%;
  }

  .explanation_warp .title {
    white-space: nowrap;
    position: relative;
    cursor: pointer;
    height: auto;
    line-height: 49px;
  }

  .explanation_warp .title i {
    color: #ba8959;
    font-size: 16px;
    vertical-align: middle;
    margin-right: 6px;
  }

  .explanation_warp .title h4 {
    color: #ba8959;
    font-size: 15px;
    font-weight: bold;
    line-height: 20px;
    height: 20px;
    display: inline-block;
  }

  .style-seller .explanation_warp ul {
    padding-left: 10px;
  }

  .explanation_warp ul {
    margin-left: 10px;
    padding-left: 20px;
    transition: opacity .5s;

  }

  .explanation_warp li {
    line-height: 16px;
    padding-left: 10px;
    margin-bottom: 4px;
    list-style-position: outside;
  }

  .explanation_warp li {
    color: #ba8959;
    line-height: 20px;
    padding-left: 10px;
    margin-bottom: 2px;
    list-style-type: disc;
    list-style-position: outside;
    font-size: 8px;
  }

  .explanation_warp li span {
    color: #BA8941;
    font-size: 14px;
  }

  .ftitle h3 {
    font-size: 16px;
    color: #333;
    margin-right: 6px;
    float: left;
  }

  .ftitle h5 {
    font-size: 12px;
    font-weight: normal;
    line-height: 24px;
    color: #999;
    vertical-align: bottom;
    letter-spacing: normal;
    display: inline-block;
  }


  .ftitle {
    font-size: 0;
    height: 24px;
    float: left;
  }

  .ftitle h3 {
    font-size: 16px;
    color: #333;
    margin-right: 6px;
    float: left;
  }

  .ftitle h5 {
    font-size: 12px;
    font-weight: normal;
    line-height: 24px;
    color: #999;
    vertical-align: bottom;
    letter-spacing: normal;
    display: inline-block;
  }

  .search-term .simple-form-field {
    margin: 4px 8px 4px 0px;
    display: inline-block;
    vertical-align: middle;
  }

  a {
    color: #666;
    text-decoration: none;
    outline: none;
  }

  .el-input--small {
    width: 150px;
    margin-left: 8px;
  }

  .coding .el-input {
    width: 150px;
    margin-left: 8px;
  }
</style>
<style>
  .issuedData .el-table th {
    background: #f9fafa;
  }

  .explanations .el-collapse-item__wrap {
    background: #ffffdc;
    border: 0;
  }

  .explanations .el-collapse-item__header {
    background: #ffffdc;
    border: 0;
    line-height: 20px;
  }

  .explanation_warp .el-collapse {
    border: 0;
  }
</style>
