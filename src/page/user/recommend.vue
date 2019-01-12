<template>
  <div>
    <!--头部start-->
    <div class="search-box">
      <div class="searcher">
        <span style="float:left;margin-right: 15px">推荐人 :</span>
        <div class="type-class">
          <el-input size="small" v-model="referrer_phone" clearable placeholder="请输入推荐人账号"
                    @blur="checkPhone('referrer')"/>
        </div>
        <span style="float:left;margin-right: 15px">注册用户 :</span>
        <div class="type-class">
          <el-input size="small" v-model="register_phone" clearable placeholder="请输入注册账号"
                    @blur="checkPhone('register')"/>
        </div>
        <span style="float:left;margin-right: 15px">注册时间 :</span>
        <div class="type-class">
          <el-date-picker class="selected_date"
                          unlink-panels="true"
                          size="small" v-model="register_term" type="daterange"
                          value-format="timestamp" @change="sTime" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <el-button size="small" type="primary" icon="el-icon-search" @click="recommendList">搜索</el-button>
      </div>
    </div>
    <!--头部end-->
    <el-table :data="list">
      <el-table-column prop="referrer_id" align="center" label="推荐编号"/>
      <el-table-column prop="referrer_phone" align="center" label="推荐人"></el-table-column>
      <el-table-column prop="referrer_store_name" align="center" label="推荐人门店"></el-table-column>
      <el-table-column prop="register_phone" align="center" label="注册用户"></el-table-column>
      <el-table-column prop="register_store_name" align="center" label="注册用户门店"></el-table-column>
      <el-table-column prop="register_time" align="center" label="注册时间"></el-table-column>
      <el-table-column prop="coupon_code" align="center" label="优惠劵编号"></el-table-column>
      <el-table-column prop="coupon_name" align="center" label="优惠劵活动名称"></el-table-column>
      <el-table-column align="center" width="330" label="优惠劵有效期">
        <template slot-scope="scope">
          <p v-if="scope.row.send_start_time && scope.row.send_end_time">
            {{scope.row.send_start_time}}至{{scope.row.send_end_time}}</p>
        </template>
      </el-table-column>
    </el-table>

    <!--分页start-->
    <div class="page-box">
      <el-pagination class="text-align" background layout="prev, pager, next" @current-change="changePage"
                     :current-page="page.page" :page-size="page.pre_page" :total="page.total_count">
      </el-pagination>
    </div>
    <!--分页end-->
  </div>

</template>

<script>
export default {
  name: 'recommend',
  data () {
    return {
      referrer_phone: '',
      register_phone: '',
      register_term: '',
      start_time: '',
      end_time: '',
      page: {
        page: 1,
        pre_page: 10,
        total_count: 4
      },
      list: []
    }
  },
  created () {
    this.recommendList()
  },
  activated () {
    this.recommendList()
  },
  methods: {
    // 选择时间段
    sTime (val) {
      this.start_time = val ? parseInt(val[0]) / 1000 : ''
      this.end_time = val ? parseInt(val[1]) / 1000 + 86399 : ''
    },
    async recommendList () {
      this.loading = true
      const params = {
        referrer_phone: this.referrer_phone,
        register_phone: this.register_phone,
        start_time: this.start_time,
        end_time: this.end_time,
        page: this.page.page,
        pre_page: this.page.pre_page
      }
      const {err, data} = await this.$service.user_recommend.list(params)
      this.loading = false
      if (err) return
      this.list = data.result
      this.page.total_count = data.total_count
    },
    // 验证手机号
    checkPhone (key) {
      let myreg = /^\d+$/
      switch (key) {
        case 'register':
          if (!myreg.test(this.register_phone) && (this.register_phone != '')) {
            this.$message({
              type: 'error',
              message: '只能输入数字！'
            })
            this.register_phone = ''
          }
          break
        case 'referrer':
          if (!myreg.test(this.referrer_phone) && (this.referrer_phone != '')) {
            this.$message({
              type: 'error',
              message: '只能输入数字！'
            })
            this.referrer_phone = ''
          }
          break
      }
    },
    changePage (val) {
      this.page.page = val
      this.recommendList()
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
