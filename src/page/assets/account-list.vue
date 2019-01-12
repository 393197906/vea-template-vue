<style scoped>
  @import "../../style/common.css";

  .btn_view {
    padding-bottom: 10px;
  }

  .icon_success {
    color: #67c23a;
  }

  .icon_error {
    color: #f56c6c;
  }

  .page {
    margin: 10px 0;
    text-align: center;
  }

  .main_table {
    font-size: 12px;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }
</style>

<template>
  <div v-loading="loading">
    <div class="card_view">
      <div class="btn_view">
        <router-link to="/finance/income/withdrawals-save">
          <el-button size="small" icon="el-icon-plus" type="primary">添加提现账户</el-button>
        </router-link>
      </div>
      <div class="main_view">
        <el-table
          class="main_table"
          :data="account_list"
          style="width: 100%">
          <el-table-column
            prop="bank_type_info"
            align="center"
            label="账号类型">
          </el-table-column>
          <el-table-column
            prop="branch_bank_name"
            align="center"
            label="银行名称">
          </el-table-column>
          <el-table-column
            prop="realname"
            align="center"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="account_number"
            align="center"
            label="账号">
          </el-table-column>
          <el-table-column
            prop="mobile"
            align="center"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="is_default"
            align="center"
            label="是否默认">
            <template slot-scope="scope">
              <i class="el-icon-success icon_success" v-if="scope.row.is_default===1"></i>
              <i class="el-icon-error icon_error" v-if="scope.row.is_default===0"></i>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_date"
            align="center"
            label="创建时间">
            <template slot-scope="scope">
              {{scope.row.create_date | formatTime}}
            </template>
          </el-table-column>
          <el-table-column
            prop="handel"
            width="280"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button  size="small" v-if="scope.row.is_default===0"
                          @click="setDefault(scope.row.id,scope.row)">设为默认
              </el-button>
              <router-link :to="'/finance/income/withdrawals-edit/'+scope.row.id">
                <el-button type="primary" size="small">修改</el-button>
              </router-link>
              <el-button  size="small" @click="delData(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            @current-change="handleCurrentChange"
            background
            :page-size="pre_page"
            :current-page="page"
            layout="prev, pager, next"
            :total="total_count">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      total_count: 0,
      account_list: [],
      page: 1,
      pre_page: 10,
      formData: {
        bank_type: '',
        branch_bank_name: '',
        realname: '',
        account_number: '',
        mobile: '',
        is_default: ''
      }
    }
  },
  created () {
    this.page = parseInt(this.$route.query.page) || 1
    this.getData()
  },

  methods: {
    /** 设为默认 */
    setDefault (id, item) {
      this.$confirm('确定要把该账户设为默认账户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {err, data} = await this.$service.assets.accountupdata(id, {...item, is_default: 1})
          this.$message({
            type: 'success',
            message: data.message
          })
          this.getData()
        })
        .catch(() => {
        })
    },
    // 删除银行账户信息
    delData (id) {
      this.$confirm('确定要删除账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {err, data} = await this.$service.assets.accountdel(id)
          this.$message({
            type: 'success',
            message: data.message
          })
          this.getData()
        })
        .catch(() => {
        })
    },
    // 获取列表数据
    async getData () {
      this.loading = true
      const {err, data} = await this.$service.assets.accountlist({
        page: this.page,
        pre_page: this.pre_page
      })
      this.loading = false
      this.account_list = data.result || []
      this.total_count = data.total_count || 0
    },
    handleCurrentChange (val) {
      this.$router.push({
        path: '/finance/income/account-list',
        query: {
          page: val
        }
      })
    }
  }
}
</script>
