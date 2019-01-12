<style scoped>
  @import "../../style/common.css";
</style>

<template>
  <div>
    <!--批量删除-->
    <div class="listTop card_view">
      <div class="batch" v-if="false">
        <el-button type="danger" size="small" icon="el-icon-delete">批量删除</el-button>
      </div>
      <div class="block">
        <span>评价时间:</span>
        <el-date-picker
          v-model="dateSel"
          size="small"
          unlink-panels="true"
          type="daterange"
          @change="dateChange"
          value-format="timestamp"
          range-separator="—"
          start-placeholder="请选择开始日期"
          end-placeholder="请选择结束日期">
        </el-date-picker>
      </div>
      <div class="coding">
        <span>商品名称:</span>
        <el-input v-model="data_pramas.goods_name" placeholder="请输入商品名称" size="small" clearable></el-input>
      </div>
      <div class="MoreSearch">
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchData">搜索</el-button>
      </div>
    </div>
    <!--全选-->
    <div class="card_view">
      <el-table :data="goods_comment" @selection-change="handleSelectionChange">
        <el-table-column type="selection"/>
        <el-table-column
          width="100"
          label="商品图片">
          <template slot-scope="scope">
            <img style="width:80px;" :src="scope.row.pic_cover_micro">
          </template>
        </el-table-column>
        <el-table-column
          prop="goods_name"
          align="center"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="comment_info"
          width="250"
          align="center"
          label="评价信息"
        >
          <div slot-scope="scope" class="comment_info">
            <p>评价用户：{{scope.row.nick_name}}</p>
            <p>用户评价：{{scope.row.level_info}}</p>
            <p>用户评分：
              <el-rate
                style="display: inline-block"
                disabled
                :value="scope.row.level"
              >
              </el-rate>
            </p>
          </div>
        </el-table-column>
        <el-table-column
          prop="text"
          align="center"
          label="评价内容"
        >
        </el-table-column>
        <el-table-column
          align="center"
          width="200"
          label="评价时间"
        >
          <template slot-scope="scope">
            {{scope.row.created_at}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="140"
          v-if="$checkActionAccess($ACCESS.GOODS_COMMENT_DELETE)"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.comment_id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="page">
        <el-pagination
          class="text-align"
          background
          layout="prev, pager, next"
          :page-size="data_pramas.pre_page"
          :current-page="data_pramas.page"
          @current-change="handleCurrentChange"
          :total="total_count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list',
  data () {
    return {
      dateSel: '',
      goods_comment: [],
      total_count: 1,
      data_pramas: {
        page: 1,
        pre_page: 10,
        action_time: '',
        end_time: '',
        goods_name: ''
      },
      multipSelect: []
    }
  },
  created () {
    // const {page, action_time, end_time, goods_name} = this.$route.query
    // this.data_pramas.page = parseInt(page) || 1
    // this.data_pramas.action_time = action_time || ''
    // this.data_pramas.end_time = end_time || ''
    // this.data_pramas.goods_name = goods_name || ''
    this.getData()
  },
  activated () {
    this.getData()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipSelect = []
      val.forEach(item => {
        this.multipSelect.push(item.comment_id)
      })
    },
    /** 获取评论列表 */
    async getData () {
      const {err, data} = await this.$service.goods.goods_comment.list(this.data_pramas)
      this.goods_comment = data.result
      this.total_count = data.total_count || 1
    },
    /** 时间改变时事件 */
    dateChange (val) {
      if (val) {
        this.data_pramas.action_time = val[0] / 1000
        this.data_pramas.end_time = val[1] / 1000
      } else {
        this.data_pramas.action_time = ''
        this.data_pramas.end_time = ''
      }
    },
    /** 删除评价 */
    handleDelete (id) {
      this.$confirm('确定要删除该条评价?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.goods.goods_comment.comment_del(id)
          this.$message({
            type: 'success',
            message: data.message
          })
          this.getData()
        })
        .catch(() => {
        })
    },
    /** 搜索数据 */
    searchData () {
      this.data_pramas.page = 1
      this.getData()
    },
    /** 分页 */
    handleCurrentChange (val) {
      this.data_pramas.page = val
      this.getData()
    }
  }
}
</script>

<style scoped>
  .comment_info {
    text-align: left;
    color: #606266;
  }

  .comment_info > p {
    line-height: 25px;
  }

  .listTop {
    height: 54px;
    line-height: 54px;
    background: #fff;
    margin-bottom: 10px;
  }

  .block {
    float: left;
    margin-left: 15px;
  }

  .block span {
    margin-right: 8px;
    float: left;
  }

  .coding {
    height: 60px;
    float: left;
    margin: 0 15px;
  }

  .coding span {
    float: left;
  }

  .coding .el-input {
    width: 250px;
    float: left;
    margin-left: 8px;
  }

  .MoreSearch {
    float: left;
  }

  .batch {
    float: left;
    margin-left: 10px;
  }

  .page {
    background: #fff;
    text-align: center;
    padding: 10px;
  }
</style>
