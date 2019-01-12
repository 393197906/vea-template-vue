<template>
  <el-dialog title="添加收款单" :visible.sync="show" width="650px">
    <el-form ref="form" :rules="formrules" :model="tmpForm" label-width="120px" style="width:500px;"
             v-loading="loading">
      <el-form-item label="订单id：">{{tmpForm.order_id_no}}</el-form-item>
      <el-form-item label="门店名称：">{{tmpForm.store_name}}</el-form-item>
      <el-form-item label="应收金额：">{{tmpForm.money}}</el-form-item>
      <el-form-item label="优惠金额：" prop="pmtMoney">
        <el-input v-model="tmpForm.pmtMoney" @change="inPmt" size="small" :min="0" type="number"
                  placeholder="请输入优惠金额"></el-input>
      </el-form-item>
      <el-form-item label="实际金额：">{{tmpForm.tmpActual}}</el-form-item>
      <el-form-item label="实收金额：" prop="actual">
        <el-input v-model="tmpForm.actual" size="small" type="number" placeholder="请输入实收金额"></el-input>
      </el-form-item>
      <el-form-item label="凭证：">
        <el-upload
          class="avatar-uploader"
          accept=".jpg,.png,.jpeg"
          :action="up_action"
          :headers="up_headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="tmpForm.img" :src="tmpForm.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!--<el-from-item label="收款方式">
        <el-radio-group v-model="tmpForm.payType">
          <el-radio :label="3">备选项</el-radio>
          <el-radio :label="6">备选项</el-radio>
          <el-radio :label="9">备选项</el-radio>
        </el-radio-group>
      </el-from-item>-->
      <el-form-item label="收款方式：" prop="pay_type">
        <el-radio-group v-model="tmpForm.pay_type">
          <el-radio label="1">现金</el-radio>
          <el-radio label="2">微信</el-radio>
          <el-radio label="3">支付宝</el-radio>
          <el-radio label="4">银行转账</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" size="small" v-model="tmpForm.note" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-alert title="当实收金额与实际应收金额不相符时，提交收款单时立即核销。" type="info" :closable="false" show-icon></el-alert>
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
      if (value >= 0) {
        callback()
      } else {
        callback(new Error('优惠金额必须大于0'))
      }
    }
    var checkActual = (rule, value, callback) => {
      if (value != '') {
        if (value > 0) {
          callback()
        } else {
          callback(new Error('实收金额必须大于0'))
        }
      } else {
        callback(new Error('实收金额不能为空'))
      }
    }
    return {
      loading: false,
      up_action: `${getBaseUrlForDefault()}/shopmanager/upload_cos`,
      up_headers: {Authorization: token},
      tmpForm: {},
      show: false,
      formrules: {
        pmtMoney: [
          {validator: checkMoney, trigger: 'blur'}
        ],
        actual: [
          {required: true, validator: checkActual, trigger: 'blur'}
        ],
        pay_type: [
          {required: true, message: '请选择收款方式', trigger: 'change'}
        ]
      }
    }
  },
  watch: {
    show (cval) {
      this.$emit('isShow', cval)
    }
  },
  created () {
    this.show = this.showDialog
    this.tmpForm = {
      ...this.baseData,
      tmpActual: this.baseData.money,
      pmtMoney: 0.00,
      actual: this.baseData.money,
      img: '',
      note: '',
      pay_type: '1'
    }
    // this.tmpForm['pmtMoney'] = this.baseData.order_pmt_amount
  },
  methods: {
    inPmt (val) {
      this.tmpForm.tmpActual = subtract(parseFloat(this.tmpForm.money), val)
      this.tmpForm.actual = subtract(parseFloat(this.tmpForm.money), val)
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
      if (parseInt(this.tmpForm.actual) !== parseInt(this.tmpForm.tmpActual)) {
        let yuer = parseInt(this.tmpForm.tmpActual) - parseInt(this.tmpForm.actual)
        this.$confirm('确定将' + yuer + '元立即核销余额吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              this.loading = true
              const tmpobj = {
                collectionId: this.tmpForm.id,
                money: this.tmpForm.actual,
                pmtMoney: this.tmpForm.pmtMoney,
                img: this.tmpForm.img,
                note: this.tmpForm.note,
                pay_type: this.tmpForm.pay_type
              }
              const {err, data} = await this.$service.financemanager.comReceive(tmpobj)
              this.loading = false
              if (err) {
                this.$message({
                  type: 'error',
                  message: '操作失败!'
                })
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            } else {
              return false
            }
          })
          this.show = false
        })
      } else {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.loading = true
            const tmpobj = {
              collectionId: this.tmpForm.id,
              money: this.tmpForm.actual,
              pmtMoney: this.tmpForm.pmtMoney,
              img: this.tmpForm.img,
              note: this.tmpForm.note,
              pay_type: this.tmpForm.pay_type
            }
            const {err, data} = await this.$service.financemanager.comReceive(tmpobj)
            this.loading = false
            if (err) {
              this.$message({
                type: 'error',
                message: '操作失败!'
              })
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            }
          } else {
            return false
          }
        })
        this.show = false
      }
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
