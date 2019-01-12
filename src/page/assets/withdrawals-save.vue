<style scoped>
@import "../../style/common.css";
</style>
<template>
  <div>
    <div class="card_view">
      <el-form :model="formData" status-icon :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号类型" prop="bank_type">
            <el-select v-model="formData.bank_type" placeholder="请选择">
              <el-option
                v-for="item in bank_type"
                :key="item.type"
                :label="item.label"
                :value="item.type">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="支行信息" prop="branch_bank_name" v-if="formData.bank_type==1">
          <el-input  v-model="formData.branch_bank_name" ></el-input>
        </el-form-item>
        <el-form-item :label="formData.bank_type == 1 ? '银行账号':(formData.bank_type== 2 ? '支付宝账号':'微信账号')" prop="account_number">
          <el-input  v-model="formData.account_number" ></el-input>
        </el-form-item>
         <el-form-item label="姓名" prop="realname">
          <el-input  v-model="formData.realname" ></el-input>
        </el-form-item>
         <el-form-item label="电话" prop="mobile">
          <el-input  v-model="formData.mobile" ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('formData')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    var branch_bank_name = (rule, value, callback) => {
      if (this.formData.bank_type === 1) {
        if (value == '') {
          callback(new Error('请输入支行信息'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var realname = (rule, value, callback) => {
      if (this.formData.bank_type === 1) {
        if (value == '') {
          callback(new Error('请输入真实姓名'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var account_number = (rule, value, callback) => {
      if (this.formData.bank_type === 1) {
        if (value == '') {
          callback(new Error('请输入银行账号'))
        } else if (!/^\d{8,}$/.test(value)) {
          callback(new Error('账号格式不正确'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    } // ^1[3|4|5|8][0-9]\d{4,8}$
    var mobile = (rule, value, callback) => {
      if (!/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(value)) {
        callback(new Error('电话号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      bank_type: [
        { type: 1, label: '银行卡' },
        { type: 2, label: '支付宝' },
        { type: 3, label: '微信支付' }
      ],
      formData: {
        bank_type: 1,
        branch_bank_name: '',
        realname: '',
        account_number: '',
        mobile: ''
      },
      rules: {
        bank_type: [
          { required: true, message: '请选择账号类型', trigger: 'change' }
        ],
        branch_bank_name: [{ validator: branch_bank_name, trigger: 'blur' }],
        realname: [{ validator: realname, trigger: 'blur' }],
        account_number: [{ validator: account_number, trigger: 'blur' }],
        mobile: [{ required: true, validator: mobile, trigger: 'blur' }]
      }
    }
  },
  methods: {
    /** async _reductionDetail(id) {
        this.dialogTableVisible = true;
        const {
          err,
          data
        } = await this.$service.shopmanager.colligate.colligateDetail(id);
        this.data_detail = data.result;
      }, */
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { err, data } = await this.$service.assets.accountsave(
            this[formName]
          )
          if (err) return
          this.$message({
            message: data.message,
            type: 'success'
          })
          this.$router.push({ path: '/finance/income/account-list' })
        } else {
          // console.log("error submit!!");
          return false
        }
      })
    }
  }
}
</script>
