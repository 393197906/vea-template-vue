<template>
  <div>
    <div class="statistical">
      <ul>
        <!--付款订单数量-->
        <li>
          <div class="left">
            <strong class="js-order-amount">{{today_sum}}</strong>
          </div>
          <div class="right">
            <p>今日收款金额</p>
          </div>
        </li>
        <!--付款金额-->
        <li>
          <div class="left">
            <strong class="js-weixin-fans-count">{{yesterday_sum}}</strong>
          </div>
          <div class="right">
            <p>昨日收款金额</p>
          </div>
        </li>
        <!--付款商品件数-->
        <li>
          <div class="left">
            <strong class="js-goods-release-count">{{now_sum}}</strong>
          </div>
          <div class="right">
            <p>本期收款</p>
          </div>
        </li>
        <!--发货订单数-->
        <li>
          <div class="left">
            <strong class="js-order-total">{{now_user_sum}}</strong>
          </div>
          <div class="right">
            <p>付款用户数</p>
          </div>
        </li>
      </ul>
    </div>
    <el-card>
      <div class="search-box">
        <div class="searcher">
          <span style="float:left;margin-right: 15px">收款编码:</span>
          <div style="width:130px;" class="type-class">
            <el-input v-model="order_no" size="small" clearable placeholder="请输入角色名称"/>
          </div>
          <span style="float:left;margin-right: 15px">收款方式:</span>
          <div class="type-class">
            <el-select size="small" style="width:130px;" v-model="payment_type" placeholder="请选择收款方式">
              <el-option v-for="item in paymentOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
          <span style="float:left;margin-right: 15px">收款入口:</span>
          <div class="type-class">
            <el-select size="small" style="width:130px;" v-model="channel_type" placeholder="请选择">
              <el-option v-for="item in channelOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>

          <span style="float:left;margin-right: 15px">收款金额区间:</span>
          <div style="width:100px;" class="type-class">
            <el-input size="small" :min="0" type="number" v-model="min_money" placeholder="最小金额"/>
          </div>
          <span style="float:left;margin-right: 15px">至</span>
          <div style="width:100px;" class="type-class">
            <el-input :min="0" type="number" size="small" v-model="max_money" placeholder="最大金额"/>
          </div>
          <span style="float:left;margin-right: 15px">收款时间:</span>
          <div class="type-class">
            <el-date-picker style="width:230px;" @change="sTime" size="small" v-model="tdate" type="daterange"
                            value-format="timestamp"
                            unlink-panels="true"
                            start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button size="small" type="info" icon="el-icon-search" @click="exportRecord"  v-if="$checkActionAccess($ACCESS.DPSK_EXPORT)">导出</el-button>
        </div>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="order_no" label="收款编码" align="center"></el-table-column>
        <el-table-column prop="pay_time" label="收款时间" align="center"></el-table-column>
        <el-table-column prop="amount" label="收款金额" align="center"></el-table-column>
        <el-table-column prop="payment_type_desc" label="收款方式" align="center"></el-table-column>
        <el-table-column prop="channel_desc" label="收款入口" align="center"></el-table-column>
        <el-table-column prop="pay_status" label="支付状态" align="center"></el-table-column>
        <el-table-column prop="from_user_name" label="打款人" align="center"></el-table-column>
      </el-table>
      <!--分页start-->
      <div class="page-box">
        <el-pagination class="text-align" background layout="prev, pager, next" :current-page="cpage"
                       :total="total" @current-change="pageChange"></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import json2excel from 'yt-json2excel'

export default {
  data () {
    return {
      today_sum: '', // 今日收款金额
      yesterday_sum: '', // 昨日收款金额
      now_sum: '', // 本期收款金额
      now_user_sum: '', // 付款用户数
      order_no: '', // 收款编码
      tdate: '', // 时间间隔
      tableData: [],
      payment_type: '', // 收款方式
      paymentOptions: [
        {
          value: '',
          label: '全部'
        }, {
          value: 'ALIPAY',
          label: '支付宝'
        }, {
          value: 'WEIXIN',
          label: '微信'
        }],
      channel_type: '', // 收款入口
      channelOptions: [
        {
          value: '',
          label: '全部'
        }, {
          value: 'APP',
          label: 'APP'
        }, {
          value: 'NATIVE',
          label: '扫码'
        }, {
          value: 'SMALL',
          label: '小程序'
        }],
      min_money: '', // 最小金额
      max_money: '', // 最大金额
      start_time: '', // 开始时间
      end_time: '', // 结束时间
      cpage: 1, // 当前页
      pre_page: 10, // 显示记录数
      total: 0
    }
  },
  created () {
    this.getData()
  },
  methods: {
    sTime (val) {
      this.start_time = val ? parseInt(val[0]) / 1000 : ''
      this.end_time = val ? parseInt(val[1]) / 1000 : ''
    },
    // 获取请求参数
    getParams () {
      return {
        start_time: this.start_time,
        end_time: this.end_time,
        payment_type: this.payment_type,
        channel_type: this.channel_type,
        min_money: this.min_money,
        max_money: this.max_money,
        page: this.cpage,
        pre_page: this.pre_page,
        order_no: this.order_no
      }
    },
    // 获取数据
    async getData () {
      this.loading = true
      let opts = this.getParams()
      const {err, data} = await this.$service.report.gather_list(opts)
      this.loading = false
      if (err) return
      this.tableData = data.data
      this.total = data.count ? data.count : 0
      this.today_sum = data.today_sum ? data.today_sum : 0
      this.yesterday_sum = data.yesterday_sum ? data.yesterday_sum : 0
      this.now_sum = data.now_sum ? data.now_sum : 0
      this.now_user_sum = data.now_user_sum ? data.now_user_sum : 0
    },
    // 导出记录
    async exportRecord () {
      this.loading = true
      let opts = this.getParams()
      const {err, data} = await this.$service.report.gather_list_export(opts)
      this.loading = false
      if (err) {
        this.$Message.warning(data.message)
        return
      }
      const result = data.data
      const titleArray = [{
        order_no: '收款编码',
        pay_time: '收款时间',
        amount: '收款金额',
        payment_type_desc: '收款方式',
        channel_desc: '收款入口',
        pay_status: '支付状态',
        from_user_name: '付款人'
      }]
      json2excel('打款记录' + this.$formatTime(parseInt(new Date().getTime() / 1000)), result, titleArray)
    },
    // 点击搜索按钮
    search () {
      this.getData()
    },
    pageChange (page) {
      this.cpage = page
      this.getData()
    }
  }
}
</script>
<style scoped>
  .el-col {
    height: 80px;
    margin: 0 5px;
    text-align: center;
    border: 1px solid #eee;
  }

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

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  .text-align {
    text-align: center;
  }

  .statistical {
    overflow: hidden;
    background: #fff;
    margin-bottom: 10px;
  }

  .statistical ul li {
    float: left;
    width: 25%;
    color: #999;
    padding: 20px;
    box-sizing: border-box;
    border-right: 1px dashed #e5e5e5;
  }

  .statistical ul li > .left {
    height: 51px;
    text-align: center;
  }

  .statistical ul li > .right {
    text-align: center;
  }

  .statistical .right p {
    color: #333;
  }

  .statistical ul li > div strong {
    font-size: 20px;
    color: #3a8ee6;
    display: inline-block;
    height: 52px;
    line-height: 52px;
    font-weight: bold;
  }

</style>
