<template>
  <el-form :model="goods" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
    <el-form-item label="商品地点" prop="province_id">
      <el-select
        placeholder="请选择省份"
        @change="changeProvince"
        v-model="goods.province_id"
      >
        <el-option
          v-for="item in service.province_list"
          :key="item.province_id"
          :label="item.province_name"
          :value="item.province_id"
        >
        </el-option>
      </el-select>
      <el-select placeholder="请选择城市" v-model="goods.city_id" @change="changeCity" v-show="service.city_list.length">
        <el-option
          v-for="item in service.city_list"
          :key="item.city_id"
          :label="item.city_name"
          :value="item.city_id">
        </el-option>
      </el-select>
      <el-select placeholder="请选择区域" v-model="goods.district_id" v-show="service.area_list.length">
        <el-option
          v-for="item in service.area_list"
          :key="item.district_id"
          :label="item.district_name"
          :value="item.district_id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="库存显示" prop="is_sale">
      <el-radio v-model="goods.is_sale" label="1">是</el-radio>
      <el-radio v-model="goods.is_sale" label="0">否</el-radio>
    </el-form-item>
    <el-form-item label="是否上架" prop="display_stock">
      <el-radio v-model="goods.display_stock" label="1">立刻上架</el-radio>
      <el-radio v-model="goods.display_stock" label="0">放入仓库</el-radio>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'other',
  data () {
    return {
      goods: {
        province_id: '',
        city_id: '',
        district_id: '',
        display_stock: '', // 上下架
        is_sale: ''// 是否显示库存
      },
      rules: {
        province_id: [
          {required: true, message: '请选择商品地点', trigger: 'blur'}
        ],
        display_stock: [
          {required: true, message: '请选择是否上下架', trigger: 'blur'}
        ],
        is_sale: [
          {required: true, message: '请选择是否显示库存', trigger: 'blur'}
        ]
      },
      service: {
        province_list: [],
        city_list: [],
        area_list: []
      }
    }
  },
  async created () {
    const {err, data} = await this.$service.zone.options_province()
    if (err) return
    this.service.province_list = data.data
  },
  methods: {
    pre () {
      this.$emit('pre')
    },
    next () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('next', this.goods)
        } else {
          return false
        }
      })
    },
    async changeProvince (value) {
      this.service.city_list = []
      this.service.area_list = []
      const {err, data} = await this.$service.zone.options_city(value)
      if (err) return
      this.service.city_list = data.data
      this.goods.city_id = this.service.city_list[0].city_id
      this.changeCity(this.goods.city_id)
    },
    async changeCity (value) {
      this.service.area_list = []
      const {err, data} = await this.$service.zone.options_district(value)
      if (err) return
      this.service.area_list = data.data
      this.goods.district_id = this.service.area_list[0].district_id
    }
  }
}
</script>

<style scoped>
  @import '../add.css';
</style>
