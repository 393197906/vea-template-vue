<template>
  <div class="shop">
    <slot name="breadcrumb"></slot>
    <div class="shopAdmin">
      <el-form :label-position="labelPosition" label-width="200px" :model="formData" ref="formData" :rules="rules">
        <el-form-item label="站点名称 :" prop='name'>
          <el-input v-model="formData.name" style="width: 400px"></el-input>
        </el-form-item>

        <el-form-item label="站点地址 :">
          <el-select v-model="province_id" placeholder="请选择">
            <el-option
              v-for="item in options_province"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="city_id" placeholder="请选择">
            <el-option
              v-for="item in options_city"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="district_id" placeholder="请选择">
            <el-option
              v-for="item in options_district"
              :key="item.code"
              :label="item.name"
              :value="item.code">
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
          <el-button type="primary" @click="onSubmit('formData')"  size="small" :loading="loading">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      loading: false,
      labelPosition: 'right',
      formData: {
        id: 1,
        name: '',
        shop_id: 1,
        address: '',
        contact: '',
        phone: '',
        supplier_id: 0,
        longitude: '',
        latitude: '',
        create_time: '',
        province_id_info: '',
        district_id_info: '',
        city_id_info: ''
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
          {required: true, max: 15, message: '长度最多 15 个字符', trigger: 'blur'}
        ],
        address: [
          {required: true, max: 50, message: '长度最多 50 个字符', trigger: 'blur'}
        ],
        contact: [
          {required: true, max: 20, message: '长度最多 20 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur'}
        ],
        province_id: [
          {required: true, max: 15, message: '长度最多 15 个字符', trigger: 'blur'}
        ],
        city_id: [
          {required: true, max: 15, message: '长度最多 15 个字符', trigger: 'blur'}
        ],
        district_id: [
          {required: true, max: 15, message: '长度最多 15 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this._getPointDetail()
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
          this.loading = true
          const {err, data} = await this.$service.shop.point.update(this.$route.params.id, upData)
          this.loading = false
          if (err) return
          this.$message({
            message: '成功',
            type: 'success'
          })
        } else {
          return false
        }
        this.$router.push('/shop/contactWay')
      })
    },
    async _get_option_province () {
      const {err, data} = await this.$service.zone.options_province()
      if (err) return
      const res = data.data
      return res
    },
    async _get_option_city (province_id) {
      const {err, data} = await this.$service.zone.options_city(province_id)
      if (err) return
      const res = data.data
      return res
    },
    async _get_option_district (city_id) {
      const {err, data} = await this.$service.zone.options_district(city_id)
      if (err) return
      const res = data.data
      return res
    },

    async _getPointDetail () {
      const {err, data} = await this.$service.shop.point.detail(this.$route.params.id)
      if (err) return
      const res = data.data

      // 初始化数据
      this.formData.id = this.$route.params.id
      this.formData.name = res.name ? res.name : ''
      this.formData.address = res.address ? res.address : ''
      this.formData.contact = res.contact ? res.contact : ''
      this.formData.phone = res.phone ? res.phone : ''

      // 省市区列表
      this.options_province = await this._get_option_province()
      this.options_city = await this._get_option_city(res.province_id)
      this.options_district = await this._get_option_district(res.city_id)

      // 赋值省市区id
      this.province_id = res.province_id ? res.province_id : ''
      this.city_id = res.city_id ? res.city_id : ''
      this.district_id = res.district_id ? res.district_id : ''
    }
  }
}
</script>

<style scoped>
  .shop {
    background-color: #fff;
  }

  .shopAdmin {
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

  .weight {
    height: 50px;
  }
</style>
