
<template>
  <div class="card_view">
    <div class="storeNameTop">
      <div class="storeNameLeft">
        <img :src="shopInfo.avatar" alt="">
      </div>
      <div class="storeNameRight">
        <div>店铺名称:&nbsp;<span>{{data_detail.shop_name}}</span></div>
        <div>可用金额:&nbsp;<span>{{Number(data_detail.balance) | formatCurrency}}</span>&nbsp;元</div>
        <div>
          <el-button type="primary" size="small" v-if="$checkActionAccess($ACCESS.INCOME)"
                     @click="$router.push('/finance/income/withdraw')">提现
          </el-button>
        </div>
      </div>
    </div>
    <div class="storeBottom">
      <!--<dl class="for-the-account">-->
      <!--<dd>待结算:</dd>-->
      <!--<dt>{{Number(data_detail.freeze_into_account) | formatCurrency}}</dt>-->
      <!--</dl>-->
      <dl class="for-the-account">
        <dd>已提现:</dd>
        <dt>{{Number(data_detail.total_freeze_withdraw) || 0 | formatCurrency}}</dt>
      </dl>
      <dl class="for-the-account">
        <dd>冻结:</dd>
        <dt style="color:red">{{Number(data_detail.withdraw_freeze_now) || 0 | formatCurrency}}</dt>
      </dl>
    </div>
    <el-table :data="drawList" class="main_table">
      <el-table-column type="expand" fixed="right">
        <template slot-scope="props">
          <div style="text-align: center;color: #8c939d" v-if="!props.row.logs_item.length">没有日志</div>
          <el-form v-else inline class="demo-table-expand">
            <el-form-item label="审核人：">
              <span>{{ props.row.logs_item[0].admin_name}}</span>
            </el-form-item>
            <el-form-item label="打款人：" v-if="props.row.logs_item[1]">
              <span>{{ props.row.logs_item[1].admin_name}}</span>
            </el-form-item>
            <el-form-item label="审核时间：">
              <span>{{ props.row.logs_item[0].addtime }}</span>
            </el-form-item>
            <el-form-item label="打款时间：" v-if="props.row.logs_item[1]">
              <span>{{ props.row.logs_item[1].addtime }}</span>
            </el-form-item>
            <el-form-item label="审核状态：">
              <span>{{ props.row.logs_item[0].action_desc }}</span>
            </el-form-item>
            <el-form-item label="打款状态：" v-if="props.row.logs_item[1]">
              <span>{{ props.row.logs_item[1].action_desc }}</span>
            </el-form-item>
            <el-form-item label="审核备注：">
              <span>{{ props.row.logs_item[0].remark }}</span>
            </el-form-item>
            <el-form-item label="打款备注：" v-if="props.row.logs_item[1]">
              <span>{{ props.row.logs_item[1].remark }}</span>
            </el-form-item>
            <el-form-item label="审核图片：">
              <span v-if="props.row.logs_item[0].attach_files !== '暂无图片'">
                <img :src="props.row.logs_item[0].attach_files" class="img"
                     @click="showBiggerImg(props.row.logs_item[0].attach_files)" style="width: 15%;">
              </span>
              <span v-else>
                暂无图片
              </span>
            </el-form-item>
            <el-form-item label="打款证明：" v-if="props.row.logs_item[1]">
              <span v-if="props.row.logs_item[1].attach_files !== '暂无图片'">
                <img :src="props.row.logs_item[1].attach_files" class="img" style="width: 15%;"
                     @click="showBiggerImg(props.row.logs_item[1].attach_files)">
              </span>
              <span v-else>
                暂无图片
              </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="serials_num" label="提现流水号" width="170px;"></el-table-column>
      <el-table-column align="center" prop="bank_type_str" label="提现类型"></el-table-column>
      <el-table-column align="center" prop="account_number" label="账户" width="170px;"></el-table-column>
      <el-table-column align="center" prop="realname" label="姓名"></el-table-column>
      <el-table-column align="center" prop="mobile" label="手机"></el-table-column>
      <el-table-column align="center" label="提现金额">
        <template slot-scope="scope">￥{{Number(scope.row.amount) | formatCurrency}}</template>
      </el-table-column>
      <el-table-column align="center" label="手续费">
        <template slot-scope="scope">￥{{scope.row.transaction_cost| formatCurrency}}</template>
      </el-table-column>
      <el-table-column align="center" prop="apply_time" label="提现日期"></el-table-column>
      <el-table-column align="center" prop="draw_time" label="到账日期"></el-table-column>
      <!--<el-table-column align="center" prop="remark" label="提现备注"></el-table-column>-->
      <!--<el-table-column align="center" prop="draw_status_str" label="状态"></el-table-column>-->
    </el-table>

    <el-dialog :show-close="false" width="35%"
      :visible.sync="centerDialogVisible"
      class="img_log"
      center>
      <div class="imgcontent">
        <img :src="bigger_img" class="bigger_img">
      </div>
    </el-dialog>
    <el-pagination
      id="page-box"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="page_size"
      :total="page_total">
    </el-pagination>
  </div>
</template>

<script>
import mixin from '@/components/mixin/mixin.js'
import {mapActions, mapState} from 'vea'

export default {
  mixins: [mixin],
  name: 'income',
  data () {
    return {
      centerDialogVisible: false,
      data_detail: '',
      drawList: [],
      page_total: 1,
      page: 1,
      page_size: 10,
      bigger_img: ''
    }
  },
  computed: {
    ...mapState(['shopInfo'])
  },
  created () {
    this.getAssetsDetail()
    this.getDrawList()
  },
  methods: {
    // 放大图片
    showBiggerImg (src) {
      this.bigger_img = src
      this.centerDialogVisible = true
    },
    // 获取资金详情
    async getAssetsDetail () {
      const {err, data} = await this.$service.assets.detail()
      if (err) {
        this.$message.error(err, 2000)
        return
      }
      this.data_detail = data.result
    },

    // 换页
    handleSizeChange (val) {
      if (this.page == val) return
      this.page = val
      this.getDrawList()
    },
    handleCurrentChange (val) {
      if (this.page == val) return
      this.page = val
      this.getDrawList()
    },
    // 提现记录
    async getDrawList () {
      const {err, data} = await this.$service.assets.drawlist({
        page: this.page,
        pre_page: this.page_size
      })
      if (err) return
      // data.result = data.result.filter((a) => {
      //   return a.order_no.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1
      // })
      this.drawList = data.result
      this.drawList.map(num => {
        num.logs_item = num.logs.map(i => {
          return i
        })
      })
      this.page_total = data.total_count
    }
  }
}
</script>

<style scoped>
  @import "../../style/common.css";

  .main_table {
    font-size: 12px;
  }
  .el-dialog--center .el-dialog__body{
    text-align: center !important;
  }
  .imgcontent{
    width: 100%;text-align: center;overflow: hidden
  }
  .bigger_img {
   width: 100%;
  }

  img {
    cursor: pointer;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-table .draw_row {
    font-size: 12px;
    color: #f40;
  }

  .storeNameTop {
    height: 150px;
    border-bottom: 1px solid #eee;
  }

  .storeNameLeft {
    float: left;
    height: 100px;
    width: 100px;
    border-radius: 50px;
    margin-top: 25px;
    margin-left: 10px;
  }

  .storeNameLeft img {
    height: 100%;
    width: 100%;
    border-radius: 50px;
    overflow: hidden;
  }

  .storeNameRight {
    float: left;
    margin-left: 30px;
  }

  .storeNameRight div {
    padding: 12px;
  }

  .storeBottom {
  }

  .for-the-account {
    float: left;
    padding: 20px 10px;
    margin-right: 50px;
  }

  .for-the-account dd {
    font-size: 16px;
    color: #999;
  }

  .for-the-account dt {
    font-size: 26px;
    line-height: 26px;
    margin-top: 10px;
    color: #f89406;
  }

  #page-box {
    width: 600px;
    margin: 10px auto 0;
    text-align: center;
    color: #333;
    font-weight: normal;
  }
</style>
<style>
  .img_log .el-dialog__header {
    display: none;
  }

  .img_log .el-dialog--center .el-dialog__body {
    line-height: 0;
    margin: 0 auto;
    padding: 0;
  }

</style>
