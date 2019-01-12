<template>
  <div class="shop">
    <slot name="breadcrumb"></slot>
    <div class="shopAdmin">
      <el-form :label-position="labelPosition" label-width="200px" :model="formData" ref="formData" :rules="rules">
        <el-form-item label="站点名称 :" prop='name'>
          <el-upload
            class="avatar-uploader"
            :action="up_action"
            :headers="up_headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="站点地址 :">
          <el-select v-model="province_id" placeholder="请选择">
            <el-option
              v-for="item in options_province"
              :key="item.province_id"
              :label="item.province_name"
              :value="item.province_id">
            </el-option>
          </el-select>
          <el-select v-model="city_id" placeholder="请选择">
            <el-option
              v-for="item in options_city"
              :key="item.city_id"
              :label="item.city_name"
              :value="item.city_id">
            </el-option>
          </el-select>
          <el-select v-model="district_id" placeholder="请选择">
            <el-option
              v-for="item in options_district"
              :key="item.district_id"
              :label="item.district_name"
              :value="item.district_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="详细地址 :" prop="address">
          <el-input v-model="formData.address" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="站点联系人 :" prop="contact">
          <el-input v-model="formData.contact" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="站点电话 :" prop="phone">
          <el-input v-model="formData.phone" style="width: 400px"></el-input>
        </el-form-item>
        <div class="weight">
          <el-button type="primary" @click="onSubmit('formData')">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'right',
      formData: {
        id: 1,
        ad_image: '',
        join_id: '',
        join_type: '',
        link_url: '',
        sort: 0,
        type: 1,
        background: ''
      },

      province_id: null,
      province_id_tick: 1,

      city_id: null,
      city_id_tick: 1,

      district_id: null,
      // 省市区下拉列表
      options_province: [],
      options_city: [],
      options_district: [],

      rules: {
        name: [
          { max: 15, message: '长度最多 15 个字符', trigger: 'blur' }
        ],
        address: [
          { max: 50, message: '长度最多 50 个字符', trigger: 'blur' }
        ],
        contact: [
          { max: 20, message: '长度最多 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        province_id: [
          { max: 15, message: '长度最多 15 个字符', trigger: 'blur' }
        ],
        city_id: [
          { max: 15, message: '长度最多 15 个字符', trigger: 'blur' }
        ],
        district_id: [
          { max: 15, message: '长度最多 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this._getCarouselDetail()
  },
  watch: {
    async province_id (to, from) {
      if (to === from) return
      // 初始化数据也被抓取、不知道这么解决的解决办法
      if (this.province_id_tick === 1) {
        this.province_id_tick = 0
        return
      }

      this.city_id = null
      this.district_id = null
      this.options_city = []
      this.options_district = []

      this.options_city = await this._get_option_city(to)
    },
    async city_id (to, from) {
      if (to === from) return
      // 初始化数据也被抓取、不知道这么解决的解决办法
      if (this.city_id_tick === 1) {
        this.city_id_tick = 0
        return
      }

      this.district_id = null
      this.options_district = await this._get_option_district(to)
    },
    district_id (to, from) {
      if (to === from) return
    }
  },
  methods: {
    async onSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.province_id === null || this.city_id === null || this.district_id === null) {
            this.$message({
              message: '请选择省市区',
              type: 'warning'
            })
            return
          }

          const upData = {...this.formData}
          upData.province_id = this.province_id
          upData.city_id = this.city_id
          upData.district_id = this.district_id

          const {err, data} = await this.$service.shopmanager.carousel.update(this.$route.params.id, upData)
          if (err) {
            this.$message({
              message: '失败',
              type: 'warning'
            })
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
    },

    async _getCarouselDetail () {
      const {err, data} = await this.$service.shopmanager.carousel.detail(this.$route.params.id)
      if (err) return
      const res = data.data

      // 初始化数据
      this.formData.id = this.$route.params.id
      this.formData.ad_image = res.ad_image ? res.ad_image : ''
      this.formData.background = res.background ? res.background : ''
      this.formData.join_id = res.join_id ? res.join_id : ''
      this.formData.join_type = res.join_type ? res.join_type : ''
      this.formData.link_url = res.link_url ? res.link_url : ''
      this.formData.sort = res.sort ? res.sort : ''
      this.formData.type = res.type ? res.type : ''
    }
  }
}
</script>

<style scoped>
  .shop{
    background-color: #fff;
  }
  .shopAdmin{
  }
  .el-form-item{
    padding-bottom: 20px;
    padding-top: 15px;
    margin-bottom: 10px;
    border-bottom: dotted 1px #e5e5e5;
  }

  .el-button{
    margin-left: 120px;
  }

  .weight{
    height: 50px;
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

</style>
