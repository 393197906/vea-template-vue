<template>
  <el-dialog title="添加收款单" :visible.sync="show" width="40%">
    <el-form ref="form" :rules="formrules" :model="tmpForm" label-width="80px" v-loading="loading">
      <el-form-item label="门店编码">{{tmpForm.id}}</el-form-item>
      <el-form-item label="门店名称">{{tmpForm.store_name}}</el-form-item>
      <el-form-item label="收款日期">{{tmpForm.created_at}}</el-form-item>
      <el-form-item label="操作人">{{tmpForm.develop_staff_name}}</el-form-item>
      <el-form-item label="期末余额">{{tmpForm.amount_in_arrear}}</el-form-item>
      <el-form-item label="实收金额" prop="real_money">
        <el-input-number v-model="tmpForm.real_money" controls-position="right"  type="number" @change="inActual" placeholder="请输入实收金额"></el-input-number>
      </el-form-item>
      <el-form-item label="收款方式" prop="pay_type">
        <el-radio-group v-model="tmpForm.pay_type">
          <el-radio label="1">现金</el-radio>
          <el-radio label="2">微信</el-radio>
          <el-radio label="3">支付宝</el-radio>
          <el-radio label="4">银行转账</el-radio>
          <el-radio label="5">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="优惠金额">
        <el-input-number :min="0"  v-model="tmpForm.pmt_money"  controls-position="right" @change="inPmt"  type="number" placeholder="请输入优惠金额"></el-input-number>
      </el-form-item>
      <el-form-item label="优惠原因">
        <el-input type="textarea" v-model="tmpForm.pmt_reason" placeholder="请输入备注"></el-input>
      </el-form-item>
      <!--<el-form-item label="凭证">-->
        <!--<el-upload-->
          <!--class="avatar-uploader"-->
          <!--accept=".jpg,.png,.jpeg"-->
          <!--:action="up_action"-->
          <!--:headers="up_headers"-->
          <!--:show-file-list="false"-->
          <!--:on-success="handleAvatarSuccess"-->
          <!--:before-upload="beforeAvatarUpload">-->
          <!--<img v-if="tmpForm.img" :src="tmpForm.img" class="avatar">-->
          <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
        <!--</el-upload>-->
      <!--</el-form-item>-->
      <el-form-item label="余额">{{balance||0}}
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="tmpForm.note" placeholder="请输入备注"></el-input>
      </el-form-item>
      <!--<el-alert title="当实收金额与实际应收金额不相符时，提交收款单时立即核销。" type="info" :closable="false" show-icon></el-alert>-->
      <el-form-item style="margin-top:20px">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="show=false">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
import {getBaseUrlForDefault} from '@/service/service'
import {subtract} from '@/util/util.js'
export default {
  props: {
    baseData: {},
    showDialog: [Boolean]
  },
  data () {
    const token = JSON.parse(sessionStorage.getItem('user_info')).token
    var checkMoney = (rule, value, callback) => {
      if (parseFloat(value) >= 0) {
        if ((value < parseFloat(this.tmpForm.arrear)) || (value === 0)) {
          callback()
        } else {
          callback(new Error('优惠金额必须小于应收金额'))
        }
      } else if (value === '') {
        callback()
      } else {
        callback(new Error('优惠金额必须大于0'))
      }
    }
    var checkActual = (rule, value, callback) => {
      if (value != '') {
        if (value == 0) {
          callback(new Error('实收金额不能为0'))
        } else {
          callback()
        }
      } else {
        callback(new Error('实收金额不能为空'))
      }
    }
    return {
      loading: false,
      up_action: `${getBaseUrlForDefault()}/shopmanager/upload_cos`,
      up_headers: {Authorization: token},
      tmpForm: {
        id: '',
        operator_id: '',
        end_balance: '',
        current_real_money: '',
        pmt_money: '',
        pmt_reason: '',
        img: '',
        note: '',
        pay_type: ''
      },
      show: false,
      formrules: {
        pmt_money: [
          {validator: checkMoney, trigger: 'blur'}
        ],
        real_money: [
          {required: true, validator: checkActual, trigger: 'blur'}
        ],
        pay_type: [
          {required: true, message: '请选择收款方式', trigger: 'change'}
        ]
      }
    }
  },
  computed: {
    // 余额=期末金额-实收金额-优惠金额
    balance () {
      return Number(this.tmpForm.amount_in_arrear) - Number(this.tmpForm.real_money) - Number(this.tmpForm.pmt_money)
    },
    maxMoney () {}
  },
  watch: {
    show (cval) {
      this.$emit('isShow', cval)
    }
  },
  created () {
    this.show = this.showDialog
    this.tmpForm = {...this.baseData, tmpActual: this.baseData.arrear, pmt_money: 0.00, actual: this.baseData.arrear, img: '', note: '', pay_type: '1'}
  },
  methods: {
    inPmt (val) {
      // if ((this.tmpForm.actual !== '') && (this.tmpForm.actual <= 0)) {
      //   this.tmpForm.pmt_money = 0
      // }
      this.tmpForm.tmpActual = subtract(parseFloat(this.tmpForm.arrear), this.tmpForm.pmt_money)
    },
    inActual (val) {
      if (val <= 0) {
        this.tmpForm.pmt_money = 0.00
        this.tmpForm.tmpActual = parseFloat(this.tmpForm.arrear)
      }
    },
    // --上传--
    handleAvatarSuccess (res, file) {
      if (res.status === 200) {
        this.tmpForm.img = res.result.pic_cover
        this.assign()
      } else {
        return false
      }
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('请选择图片')
      }

      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }

      return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          const tmpobj = {
            store_id: this.tmpForm.id,
            operator_id: JSON.parse(sessionStorage.getItem('user_info')).id,
            money: this.tmpForm.amount_in_arrear,
            real_money: this.tmpForm.real_money,
            pmt_money: this.tmpForm.pmt_money,
            pmt_reason: this.tmpForm.pmt_reason,
            img: this.tmpForm.img,
            note: this.tmpForm.note,
            pay_type: this.tmpForm.pay_type
          }
          const {err, data} = await this.$service.financemanager.comArrear(tmpobj)
          this.loading = false
          if (err) return
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.show = false
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .comstyle {
    max-height: 520px;
    border: 1px solid #eee;
  }

  .commenu {
    width: 98%;
    height: 100%;
    border-right: 1px solid #eee;
  }

  .avatar-uploader .el-icon-plus {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-icon-plus:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }

  .el-main {
    padding: 10px;
  }

  .el-menu {
    border: none;
  }

  .el-form-item {
    margin-bottom: 5px;
  }

</style>
