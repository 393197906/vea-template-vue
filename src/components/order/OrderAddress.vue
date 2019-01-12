<template>
<el-dialog
  show-close
  title="修改收货地址"
  :visible="addDilogShow"
  width="780px"
  :before-close="cancel"
  center
  class="addressForm"
>
  <el-form :model="addressForm" :rules="addressFormRule" ref="addressForm">
    <el-form-item label="收货人：" :label-width="formLabelWidth" prop="name" >
      <el-input v-model="addressForm.receiver_name"></el-input>
    </el-form-item>
    <el-form-item label="收货人手机号：" :label-width="formLabelWidth" prop="phone">
      <el-input v-model="addressForm.receiver_mobile"></el-input>
    </el-form-item>
    <!-- <el-form-item label="收货人邮编：" :label-width="formLabelWidth">
      <el-input v-model="addressForm.receiver_zip"></el-input>
    </el-form-item> -->
    <el-form-item label="收货人地址" :label-width="formLabelWidth" prop="address">
      <el-select v-model="addressForm.receiver_province" placeholder="请选择省" @change="provinceChange">
        <el-option
          v-for="item in province"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-select v-model="addressForm.receiver_city" placeholder="请选择市" @change="cityChange">
        <el-option
          v-for="item in city"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-select v-model="addressForm.receiver_district" placeholder="请选择县/区">
        <el-option
          v-for="item in district"
          :key="item.code"
          :label="item.name"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button type="primary" size="small" @click="selectAddress" style="margin-left:10px">选择已有地址</el-button>
    </el-form-item>
    <el-form-item label="详细地址：" :label-width="formLabelWidth"  prop="specaddress">
      <el-input v-model="addressForm.receiver_address"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="changeAddress('addressForm')">修 改</el-button>
  </div>
  <el-dialog
      width="60%"
      title="请选择地址"
      :visible.sync="innerVisible"
      append-to-body>
      <template>
        <el-radio-group v-model="addressSelect">
          <el-radio :key="item.id" v-for="(item, index) in addressList" :label="index">
            {{item.consigner}}  {{item.province_name}}{{item.city_name}}{{item.district_name}}{{item.address}}  {{item.mobile}}  {{item.zip_code}}
          </el-radio>
        </el-radio-group>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectAddressSure">确 定</el-button>
      </div>
  </el-dialog>
</el-dialog>
</template>

<script>
export default {
  name: 'OrderAddress',
  props: ['addDilogShow', 'orderId', 'order', 'refresh'],
  data () {
    return {
      innerVisible: false,
      addressList: [],
      addressForm: {
        receiver_name: '',
        receiver_mobile: '',
        receiver_zip: '',
        receiver_address: '',
        receiver_province: '',
        receiver_city: '',
        receiver_district: ''
      },
      addressSelect: '',
      addressFormRule: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur', type: String }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur', type: String }
        ],
        specaddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur', type: String}
        ]
      },
      province: [],
      city: [],
      district: [],
      formLabelWidth: '150px'
    }
  },
  created () {
    this.getProvince()
  },
  methods: {
    cancel () {
      this.$emit('update:addDilogShow', false)
    },
    async getProvince () {
      const {err, data} = await this.$service.getProvince()
      if (err) return
      this.province = data.data
    },
    async provinceChange (provinceID) {
      this.addressForm.receiver_city = ''
      this.addressForm.receiver_district = ''
      const {err, data} = await this.$service.getCity({
        id: provinceID
      })
      this.city = data.data
      if (err) return
    },
    async cityChange (cityID) {
      this.addressForm.receiver_district = ''
      const {err, data} = await this.$service.getDistrict({
        id: cityID
      })
      if (err) return
      this.district = data.data
    },
    async changeAddress (formName) {
      if (!(this.addressForm.receiver_city && this.addressForm.receiver_province && this.addressForm.receiver_district)) {
        this.$message({
          type: 'error',
          message: '请选择地址'
        })
        return
      }
      const {err, data} = await this.$service.shopOrder.ordermanager.orderReciverAddress(this.orderId, this.addressForm)
      if (err) return
      this.$message({
        type: 'success',
        message: data.message
      })
      this.$emit('update:addDilogShow', false)
      this.$emit('refresh')
    },
    async selectAddress () {
      const {err, data} = await this.$service.shopOrder.ordermanager.getUserAddressList(this.order.buyer_id)
      if (err) return
      this.addressList = data.result
      this.innerVisible = true
    },
    selectAddressSure () {
      const {province, city, district, address, consigner, mobile, zip_code} = this.addressList[this.addressSelect]
      this.provinceChange(province)
      this.cityChange(city)
      this.addressForm.receiver_address = address
      this.addressForm.receiver_name = consigner
      this.addressForm.receiver_province = province
      this.addressForm.receiver_district = district
      this.addressForm.receiver_city = city
      this.addressForm.receiver_zip = zip_code
      this.addressForm.receiver_mobile = mobile
      this.innerVisible = false
    },
    // 初始化窗口
    async _addressInit (order) {
      await this.provinceChange(order.receiver_province)
      await this.cityChange(order.receiver_city)
      this.addressForm.receiver_city = order.receiver_city
      this.addressForm.receiver_district = order.receiver_district
      if (order) {
        for (var key in this.addressForm) {
          this.addressForm[key] = order[key]
        }
      } else {
        for (var key in this.addressForm) {
          this.addressForm[key] = order[key]
        }
      }
    }
  }
}

</script>

<style scoped>
 .addressForm .el-input {
    width: 458px;
  }
  .el-select {
    width: 150px;
  }
  .el-radio  {
    display: block;
    margin:15px 10px;
  }
</style>
