<template>
  <div>
    <div class="withdraw_handle">
      <div class="handle_top">
        <div class="handle_left">
          <p class="h_item"><span style="color:#F56C6C">*</span>提现金额：</p>
          <el-input-number size="small" v-model.number="amount" placeholder="请输入提现金额" :min="0" :controls="false"
                           style="margin-left:20px"></el-input-number>
          <div class="handle_bot">可提现金额为 <span>{{data_detail.balance || 0}}</span> 元</div>
        </div>
        <div class="handle_left">
          <p class="h_item">手续费：</p><span class="m_amount">￥{{ fee }}</span>
        </div>
        <div class="handle_left">
          <p class="h_item">总计：</p><span class="m_amount">￥{{ total }}</span><span v-if="total > data_detail.balance"
                                                                                   class="m_tip">可提现余额不足!</span></p>
        </div>
      </div>
      <div class="handle_bottom">
        <div class="handleTwoLeft">
          <p class="h_item" style="height:40px;line-height:40px;float:left">账户：</p>
          <div class="handle_module" style="margin-left: 20px;">
            <el-select v-model="bank_id" placeholder="请选择" size="small">
              <el-option
                v-for="item in account_list"
                :key="item.id"
                :label="item.account_number"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="leftButton" v-if="$checkActionAccess($ACCESS.PTTX_GLYHZH)">
          <router-link to="/finance/income/account-list">
            <el-button type="text"  >管理银行账户</el-button>
          </router-link>
        </div>
        <div class="leftButton">
          <el-button type="primary" size="small" @click="drawApply" :loading="subLoading">提交</el-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  data () {
    return {
      amount: '',
      bank_id: '',
      data_detail: '',
      account_list: '',
      transaction_cost: '',
      subLoading: false
    }
  },
  created () {
    this.getAssetsDetail()
    this.getAccountList()
  },
  computed: {
    fee () {
      if (this.amount && this.data_detail.withdraw_rates) {
        return (parseFloat(this.amount) * parseFloat(this.data_detail.withdraw_rates / 100)).toFixed(2)
      } else {
        return '0.00'
      }
    },
    total () {
      if (this.fee && this.amount) {
        return (parseFloat(this.fee) + parseFloat(this.amount)).toFixed(2)
      } else {
        return '0.00'
      }
    }
  },
  methods: {
    // 获取账户列表数据
    async getAccountList () {
      const {err, data} = await this.$service.assets.accountlist({
        page: 1,
        pre_page: 10000
      })
      this.account_list = data.result
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
    async drawApply () {
      if (this.total > this.data_detail.balance) {
        this.$message({
          type: 'error',
          message: '可提现余额不足'
        })
        return
      }
      this.subLoading = true
      const {err, data} = await this.$service.assets.drawapply({
        amount: this.amount,
        bank_id: this.bank_id,
        transaction_cost: this.fee
      })
      this.subLoading = false
      if (err) return
      this.$message({
        message: data.message,
        type: 'success'
      })
      this.$router.push('/finance/income')
    }
  }
}
</script>

<style scoped>
  .breadcrumb {
    color: #1c8fef;
    height: 45px;
    line-height: 45px;
    background: #fff;
    border: 1px solid #eee;
  }

  .breadcrumb > p {
    margin-left: 10px;
    margin-right: 5px;
    height: 16px;
    width: 4px;
    background: #1c8fef;
    float: left;
    margin-top: 16px;
  }

  .withdraw_handle {
    height: 320px;
    background: #fff;
    margin-top: 10px;
  }

  .handle_bottom {
    height: 180px;
  }

  .handle_left {
    padding-top: 30px;
    margin-left: 191px;
  }

  .handleTwoLeft {
    margin-top: 25px;
    margin-left: 191px;
  }

  .handle_bot {
    display: inline-block;
    margin-top: 15px;
    color: orange;
    margin-left: 15px;
  }

  .handle_module {
    float: left;
    margin-left: 8px;
  }

  .leftButton {
    clear: both;
    margin-left: 311px;
  }

  .handle_head {
    margin-top: 10px;
  }

  .handle_module p {
    height: 20px;
    border-bottom: 1px solid #9999;
  }

  .h_item {
    width: 100px;
    text-align: right;
    display: inline-block;
  }

  .m_amount {
    display: inline-block;
    margin-left: 20px;
  }

  .m_tip {
    display: inline-block;
    color: red;
    margin-left: 20px;
  }
</style>
