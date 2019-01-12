<template>
  <div>
    <!--头部start-->
    <!--<div class="search-box">-->
    <!--<div class="searcher">-->
    <!--<span style="float:left;margin-right: 15px">用户名称:</span>-->
    <!--<div class="type-class">-->
    <!--<el-input-->
    <!--size="small"-->
    <!--v-model="search.user_name"-->
    <!--placeholder="请输入用户名称"-->
    <!--/>-->
    <!--</div>-->
    <!--<el-button size="small" type="primary" @click="doSearch">搜索</el-button>-->
    <!--</div>-->
    <!--</div>-->
    <!--头部end-->

    <el-table :data="list">
      <el-table-column type="selection" width="45"/>
      <el-table-column prop="id" align="center" label="用户ID"/>
      <el-table-column prop="user_name" align="center" label="用户名"></el-table-column>
      <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
      <el-table-column prop="phone" align="center" label="电话"></el-table-column>
      <!--<el-table-column-->
      <!--align="center"-->
      <!--label="状态">-->
      <!--<template slot-scope="scope">-->
      <!--{{parseInt(scope.row.status)===10?"禁用":"启用"}}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!---->
      <!--<el-table-column-->
      <!--align="center"-->
      <!--label="操作">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button-->
      <!--size="mini"-->
      <!--@click="handleEdit(scope.$index, scope.row)">-->
      <!--{{scope.row.status===20?'禁用':'启用'}}-->
      <!--</el-button>-->
      <!--<el-button-->
      <!--size="mini"-->
      <!--type="danger"-->
      <!--@click="handleDelete(scope.$index, scope.row)">删除-->
      <!--</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
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
  name: 'list',
  created () {
    this.getList()
  },
  activated () {
    this.getList()
  },
  methods: {
    doSearch () {
      this.page.page = 1
      this.getList()
    },
    // 换页
    changePage (currentPage) {
      this.page.page = currentPage
      this.getList()
    },
    async getList () {
      const {err, data} = await this.$service.member.attention({
        page: this.page.page,
        pre_page: this.page.pre_page,
        user_name: this.search.user_name
      })
      if (err) return
      const {total_count, data: list} = data
      this.list = list
      this.page.total_count = total_count
    }
  },
  data () {
    return {
      search: {
        user_name: ''
      },
      page: {
        page: 1,
        pre_page: 10,
        total_count: 0
      },
      list: [{}]
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
</style>
