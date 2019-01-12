<template>
    <div class="module-box">
        <p class="title">
            <i></i>
            供应商基本信息
        </p>
        <el-form ref="ruleForm" :model="supplierData" :rules="supplierRules" label-width="150px" size="small">
            <el-form-item label="供应商名称：" prop="supplierName">
                <el-input class="input-w" v-model="supplierData.supplierName" placeholder="请输入供应商名称">
                </el-input>
            </el-form-item>
            <!-- <el-form-item label="供应商编码：" prop="supplierNum">
                <el-input class="input-w" v-model="supplierData.supplierNum" placeholder="请输入供应商编码">
                </el-input>
            </el-form-item> -->
            <el-form-item label="联系人：" prop="contact">
                <el-input class="input-w" v-model="supplierData.contact" placeholder="请输入联系人">
                </el-input>
            </el-form-item>
            <el-form-item label="手机号码：" prop="phone">
                <el-input class="input-w" v-model="supplierData.phone" placeholder="请输入手机号码">
                </el-input>
            </el-form-item>
            <el-form-item label="省市区：" prop="selectCityArr">
                <el-cascader
                    style="width: 250px"
                    v-model="supplierData.selectCityArr"
                    :options="cityData"
                    @active-item-change="cityItemChange"
                    :props="cityProps">
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <el-input
                        type="textarea"
                        class="input-w"
                        :rows="3"
                        placeholder="请输入内容"
                        v-model="supplierData.address">
                </el-input>
            </el-form-item>
            <el-form-item label="是否启用：" prop="name">
                <el-switch
                        v-model="supplierData.status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
        </el-form>
        <p class="title">
            <i></i>
            其他信息
        </p>
        <el-form label-width="150px" size="small">
            <el-form-item label="微信：" prop="name">
                <el-input class="input-w" v-model="supplierData.wechat" placeholder="请输入微信号码">
                </el-input>
            </el-form-item>
            <el-form-item label="QQ：" prop="name">
                <el-input class="input-w" v-model="supplierData.qq" placeholder="请输入QQ号码">
                </el-input>
            </el-form-item>
            <el-form-item label="Email：" prop="name">
                <el-input class="input-w" v-model="supplierData.email" placeholder="请输入Email">
                </el-input>
            </el-form-item>
            <el-form-item label="传真：" prop="name">
                <el-input class="input-w" v-model="supplierData.fax" placeholder="请输入传真">
                </el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="name">
                <el-input class="input-w" v-model="supplierData.mark" placeholder="请输入备注">
                </el-input>
            </el-form-item>
            <el-form-item label=" " prop="name">
                <el-button type="primary" @click="save" :loading="submitLoading">保存</el-button>
                <!-- <el-button>取消</el-button> -->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {isMobile, getCityData} from '@/util/util.js'
export default {
  name: 'new-supplier-management',
  data () {
    return {
      submitLoading: false,
      supplierData: { // 提交信息
        supplierName: '', // 供应商名称
        // supplierNum: '', // 供应商编码
        contact: '', // 联系人
        phone: '', // 手机号
        address: '', // 地址
        status: true, // 是否启用
        wechat: '', // 微信
        qq: '', // qq
        email: '', // 邮箱
        fax: '', // 传真
        selectCityArr: [], // 选中地区
        mark: '' // 备注
      }, // 供应商信息
      cityData: [],

      cityProps: {
        value: 'code',
        label: 'name'
      },
      supplierRules: {
        supplierName: { required: true, message: '请输入供应商名称', trigger: 'blur' },
        supplierNum: { required: true, message: '请输入供应商编码', trigger: 'blur' },
        contact: { required: true, message: '请输入联系人', trigger: 'blur' },
        phone: { required: true, validator: isMobile, trigger: 'blur' },
        selectCityArr: { required: true, type: 'array', message: '请选择地址', trigger: 'change' },
        address: { required: true, message: '请输入详细地址', trigger: 'blur' }
      }
    }
  },
  methods: {
    // 提交
    save () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          let supplierData = this.supplierData
          let params = Object.assign({},
            supplierData,
            {
              status: supplierData.status ? '5' : '6',
              provinceId: supplierData.selectCityArr[0],
              cityId: supplierData.selectCityArr[1],
              districtId: supplierData.selectCityArr[2]
            })
          delete params['selectCityArr']
          if (supplierData.id) {
            // 编辑
            const {err, data} = await this.$service.purchase.editSupplier(params)
            this.submitLoading = false
            if (err) return
            this.$message({
              message: '修改供应商成功！',
              type: 'success'
            })
          } else {
            const {err, data} = await this.$service.purchase.addSupplier(params)
            this.submitLoading = false
            if (err) return
            this.$message({
              message: '新增供应商成功！',
              type: 'success'
            })
          }
          this.$router.back()
        }
      })
    },
    // 省市区 change事件
    cityItemChange (val) {
      var code = val[val.length - 1]
      if (val.length === 1) {
        // 省 (通过省id 获取市信息)
        this.cityData.map(async item => {
          if (item.code === code) {
            if (item.children.length === 0) {
              const {err, data: {data}} = await this.$service.zone.options_city(code)
              if (err) return
              data.map(dataItem => {
                dataItem['children'] = []
              })
              item['children'] = data
            }
          }
        })
      } else if (val.length === 2) {
        // 市
        this.cityData.map(item => {
          item.children.map(async item_ => {
            if (item_.code === code) {
              if (item_.children.length === 0) {
                const {err, data: {data}} = await this.$service.zone.options_district(code)
                if (err) return
                item_['children'] = data
              }
            }
          })
        })
      } else {
        console.log('')
      }
    },
    // 获取省数据
    async get_province () {
      const {err, data: {data}} = await this.$service.zone.options_province()
      if (err) return
      data.map(item => {
        item['children'] = []
      })
      this.cityData = data
    },
    // 获取供应商信息
    async getSupplierData () {
      let That = this
      const {err, data: {data}} = await this.$service.purchase.getSupplier({id: this.supplierData.id})
      if (err) return
      That.supplierData.supplierName = data.supplierName
      That.supplierData.supplierNum = data.supplierNum
      That.supplierData.contact = data.contact
      That.supplierData.phone = data.phone
      That.supplierData.address = data.address
      That.supplierData.status = data.status === 5
      That.supplierData.wechat = data.wechat
      That.supplierData.qq = data.qq
      That.supplierData.email = data.email
      That.supplierData.fax = data.fax
      That.supplierData.selectCityArr = [ data.provinceId, data.cityId, data.districtId ]
      That.supplierData.mark = data.mark
      getCityData([data.provinceId, data.cityId], this, 'cityData')
    }
  },
  created () {
    this.get_province()
    if (this.$route.params.id) {
      this.supplierData['id'] = this.$route.params.id
      this.getSupplierData()
    }
  }
}
</script>

<style scoped>
    .module-box {
        padding: 15px;
        background-color: #ffffff;
    }
    .title {
        font-size: 14px;
        font-weight: 400;
        height: 40px;
        background-color: #f8f8f8;
        line-height: 40px;
        margin-bottom: 20px;
    }
    .title i {
        height: 14px;
        width: 3px;
        background-color: #38f;
        display: inline-block;
        vertical-align: middle;
        margin-left: 15px;
    }
    .input-w {
        width: 250px;
    }
</style>
