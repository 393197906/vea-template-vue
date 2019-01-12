<template>
  <div class="shop">
    <el-form :label-position="labelPosition" label-width="120px" :model="formData" ref="formData" :rules="rules">
      <el-form-item label="店铺名称 :">
        {{shopInfo.shop_name}}
      </el-form-item>
      <el-form-item label="店铺头像 :">
        <el-upload
          class="avatar-uploader"
          accept=".jpg,.png,.jpeg"
          :action="up_action"
          :headers="up_headers"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="formData.avatar" :src="formData.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

      </el-form-item>
      <el-form-item label="QQ :" prop="qq">
        <el-input v-model="formData.qq" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="公司电话 :" prop="company_phone">
        <el-input v-model="formData.company_phone" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="店铺简介 :" prop="shop_info">
        <el-input v-model="formData.shop_info" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="详细地址 :" prop="company_address_detail">
        <el-input v-model="formData.company_address_detail" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="免运费条件 :" prop="freight_type">
        <el-switch
          v-model="formData.freight_type"
          active-value="2"
          inactive-value="1"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="满数量免运费"
          inactive-text="满金额免运费"
        />
      </el-form-item>
      <el-form-item label="运费满金额 :" v-if="formData.freight_type==1" prop="shop_free_freight">
        <el-input v-model="formData.shop_free_freight" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="运费满数量 :" v-if="formData.freight_type==2" prop="shop_goods_num">
        <el-input v-model="formData.shop_goods_num" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="运费 :" prop="shop_freight">
        <el-input v-model="formData.shop_freight" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="店铺公告 :" prop="shop_notice">
        <el-input v-model="formData.shop_notice" type="textarea"
                  :rows="4" placeholder="请输入店铺公告" style="width: 400px"></el-input>
      </el-form-item>
      <div class="weight">
        <el-button type="primary" @click="onSubmit('formData')" :loading="loading">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {getBaseUrlForDefault} from '@/service/service'
import {mapState} from 'vea'

export default {
  data () {
    const validateNumber = (rule, value, callback) => {
      let regPos = /^\d+(\.\d+)?$/ // 非负浮点数
      let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数

      if (regPos.test(value) || regNeg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入数字'))
      }
    }
    const token = JSON.parse(sessionStorage.getItem('user_info')).token
    return {
      loading: false,
      // --upload--
      up_action: `${getBaseUrlForDefault()}/shopmanager/upload_cos`,
      up_headers: {Authorization: token},

      labelPosition: 'right',
      formData: {
        avatar: '',
        qq: '',
        company_phone: '',
        shop_name: '',
        shop_info: '',
        shop_freight: '',
        freight_type: '2',
        shop_free_freight: '',
        shop_goods_num: '',
        company_address_detail: '',
        shop_notice: ''
      },
      imageUrl: '',

      rules: {
        qq: [
          {required: true, min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
        ],
        company_phone: [
          {required: true, min: 6, max: 15, message: '请输入正确电话', trigger: 'blur'}
        ],
        shop_info: [
          {required: true, min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur'}
        ],
        company_address_detail: [
          {required: true, min: 0, max: 40, message: '长度在 0 到 40 个字符', trigger: 'blur'}
        ],
        shop_freight: [
          {required: true, validator: validateNumber, message: '必须是数字', trigger: 'blur'},
          {required: true, min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur'}
        ],
        shop_free_freight: [
          {required: true, validator: validateNumber, message: '必须是数字', trigger: 'blur'}
        ],
        shop_goods_num: [
          {required: true, validator: validateNumber, message: '必须是数字', trigger: 'blur'}
        ]

      }
    }
  },
  computed: {
    ...mapState(['shopInfo'])
  },
  mounted () {
    this._getShopDetail()
  },
  methods: {
    async _getShopDetail () {
      const {err, data} = await this.$service.shop.StoresManager.detail()
      if (err) return
      const res = data.data
      this.formData.avatar = res.avatar ? res.avatar : ''
      this.formData.company_phone = res.company_phone ? res.company_phone : ''
      this.formData.qq = res.qq ? res.qq : ''
      this.formData.shop_name = res.shop_name ? res.shop_name : ''
      this.formData.shop_info = res.shop_info ? res.shop_info : ''
      this.formData.shop_freight = res.shop_freight ? res.shop_freight : ''
      this.formData.freight_type = res.freight_type ? `${res.freight_type}` : '1'
      this.formData.shop_free_freight = res.shop_free_freight ? res.shop_free_freight : ''
      this.formData.shop_goods_num = res.shop_goods_num ? res.shop_goods_num : ''
      this.formData.shop_notice = res.shop_notice ? res.shop_notice : ''
      this.formData.company_address_detail = res.company_address_detail ? res.company_address_detail : ''
    },
    // --上传--
    handleAvatarSuccess (res, file) {
      if (res.status === 200) {
        this.formData.avatar = res.result.pic_cover
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
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    },
    // ==上传==
    async onSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const upData = {...this.formData}
          upData.shop_info_text = upData.shop_info
          delete upData.shop_info
          this.loading = true
          const {err, data} = await this.$service.shop.StoresManager.update(upData)
          this.loading = false
          this.shopInfo.avatar = this.formData.avatar
          if (err) {
            return
          }
          this.$message({
            message: '成功',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .shop {
    background-color: #fff;
  }

  .el-form-item {
    padding-bottom: 20px;
    padding-top: 15px;
    margin-bottom: 10px;
    border-bottom: dotted 1px #e5e5e5;
  }

  .el-button {
    margin-left: 120px;
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .weight {
    height: 50px;
  }
</style>
