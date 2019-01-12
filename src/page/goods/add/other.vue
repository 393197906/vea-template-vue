<template>
  <el-form :model="goods" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
    <el-form-item label="商品地点" prop="province_id" v-if="false">
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
    <el-form-item label="库存显示" prop="display_stock">
      <el-radio v-model="goods.display_stock" label="1">是</el-radio>
      <el-radio v-model="goods.display_stock" label="0">否</el-radio>
    </el-form-item>
    <el-form-item label="是否上架" prop="is_sale" v-if="$checkActionAccess($ACCESS.GOODS_SHELF) || !goods.goods_id">
      <el-radio v-model="goods.is_sale" label="1">立刻上架</el-radio>
      <el-radio v-model="goods.is_sale" label="0">放入仓库</el-radio>
    </el-form-item>
    <div class="active-container">
      <!-- <el-button icon="el-icon-arrow-left" type="primary" @click="pre">上一步</el-button> -->
      <!-- <el-button icon="el-icon-upload2" type="primary" class="active-right" @click="next">发布商品</el-button> -->
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'other',
  props: ['editData'],
  watch: {
    editData (data) {
      this.goods.display_stock = `${data.is_stock_visible}`
      this.goods.is_sale = `${data.state}`
    }
  },
  data () {
    return {
      goods: {
        display_stock: '1', // 上下架
        is_sale: '1'// 是否显示库存
      },
      rules: {
        display_stock: [
          {required: true, message: '请选择是否显示库存', trigger: 'blur'}
        ],
        is_sale: [
          {required: true, message: '请选择是否上架', trigger: 'blur'}
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
    next () {
      let result = false
      this.$refs.form.validate((valid) => {
        if (valid) {
          result = this.goods
        }
      })
      return result
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
