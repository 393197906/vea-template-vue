<template>
    <div class="module-box">
        <el-form  ref="formData" :model="formData" :rules="rules" label-width="100px"  size="small" class="demo-ruleForm">
                <el-form-item label="仓库名称：" prop="warehouseName" >
                    <el-input style="width: 250px" v-model="formData.warehouseName"></el-input>
                </el-form-item>
                <el-form-item label="所属区域：" prop="selectRegion" >
                   <el-cascader
                    style="width: 200px"
                    v-model="formData.selectRegion"
                    :options="cityData"
                    @active-item-change="cityItemChange"
                    :props="cityProps">
                    </el-cascader>
                </el-form-item>

            <el-form-item label="详细地址：" prop="address" >
                <el-input style="width: 250px" v-model="formData.address"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchAddress">搜索地图</el-button>
            </el-form-item>
                <el-form-item label=" " label-width="100px" >
                    <div class="map-box">
                        <div id="container"></div>
                        <div id="panel" ref="panelRef"></div>
                    </div>
                </el-form-item>

                <el-form-item label="联系人：" prop="contactName" >
                    <el-input style="width: 250px" v-model="formData.contactName"></el-input>
                </el-form-item>

                <el-form-item label="联系方式：" prop="mobile" >
                    <el-input style="width: 250px" v-model="formData.mobile"></el-input>
                </el-form-item>

                <el-form-item label="备注：">
                    <el-input
                            type="textarea"
                            :rows="3"
                            style="width: 300px"
                            placeholder="请输入内容"
                            v-model="formData.mark">
                    </el-input>
                </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" :loading="submitLoading" @click="onSubmit('formData')">保存</el-button>
            </el-form-item>
        </el-form>
        <!-- 底部确认出库按钮 -->
        <!-- <div class="confirm-outgoing">
            <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
        </div> -->
        <!-- // 底部确认出库按钮 -->
    </div>
</template>

<script>
import AMap from 'AMap'
import { isMobile, getCityData } from '@/util/util.js'
export default {
  name: 'new-warehouse',
  data () {
    return {
      submitLoading: false,
      formData: {
        warehouseName: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        contactName: '',
        mobile: '',
        lng: '',
        lat: '',
        mark: '',
        address: '',
        selectRegion: []
      },
      stock_id: '',
      map: {}, // 地图对象
      placeSearch: null, // 地图搜索对象
      address: '',
      cityData: [],
      selectRegion: [], // 选中地区
      cityProps: {
        value: 'code',
        label: 'name'
      },
      rules: {
        warehouseName: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        selectRegion: [
          {
            required: true,
            type: 'array',
            message: '请选择地址',
            trigger: 'change'
          }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        mobile: [{ required: true, validator: isMobile, trigger: 'blur' }]
      }
    }
  },
  mounted () {
    let geocoder = null
    let That = this
    this.map = new AMap.Map('container', {
      resizeEnable: true
      // center: [That.formData.lng || 0 , That.formData.lat || 0]
    })
    let marker, map = this.map
    // 默认检索全国
    AMap.service('AMap.Geocoder', function () { // 回调函数
      geocoder = new AMap.Geocoder({
        city: '全国'// 城市，默认：“全国”
      })
    })

    map.on('click', function (e) {
      // 点击地图
      if (marker) {
        marker.setMap(null)
        marker = null
      }
      // 地图标记当前位置
      marker = new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: [e.lnglat.getLng(), e.lnglat.getLat()]
      })
      marker.setMap(map)
      // 根据当前返回坐标反查地址信息
      geocoder.getAddress([e.lnglat.getLng(), e.lnglat.getLat()], function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          // 点击地图后返回准确地址

          if (That.placeSearch) {
            That.placeSearch.clear()
          }
          That.formData.lat = e.lnglat.getLat()
          That.formData.lng = e.lnglat.getLat()
          That.formData.address = result.regeocode.formattedAddress
          That.$refs.formData.validateField('address')
        }
      })
    })
  },
  created () {
    this.get_province()
    if (this.$route.query.id) {
      this.stock_id = this.$route.query.id
      this.stock_detail()
    }
  },
  methods: {
    /** 地图 */
    searchAddress () {
      const That = this
      // return false;
      if (That.formData.address === '') {
        That.$message.error('详细地址不能为空')
        return
      }
      AMap.service(['AMap.PlaceSearch'], function () {
        That.placeSearch = new AMap.PlaceSearch({
          // 构造地点查询类
          pageSize: 5,
          pageIndex: 1,
          city: '010', // 城市
          map: That.map,
          panel: 'panel',
          extensions: 'all'
        })
        // 关键字查询
        That.placeSearch.search(That.formData.address)
        That.placeSearch.on('listElementClick', function (e) {
          let data = e.data
          That.formData.address = data.pname + data.cityname + data.adname + data.name
          That.formData.lat = data.entr_location ? data.entr_location.lat : ''
          That.formData.lng = data.entr_location ? data.entr_location.lng : ''
          That.$refs.formData.validateField('address')
        })
      })
    },
    // 保存提交
    onSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.submitLoading = true
          this.formData.provinceId = this.formData.selectRegion[0]
          this.formData.cityId = this.formData.selectRegion[1]
          this.formData.districtId = this.formData.selectRegion[2]
          let formData = this.formData
          delete formData['selectRegion']
          let saveWarehouse = this.stock_id ? 'editWarehouse' : 'addWarehouse'
          const { err, data } = await this.$service.stock[saveWarehouse](
            formData
          )
          this.submitLoading = false
          if (err) return
          this.$message({
            message: data.message,
            type: 'success'
          })
          this.$router.back()
        }
      })
    },
    /** 地区 联级选择 */
    async cityItemChange (val) {
      var code = val[val.length - 1]
      if (val.length === 1) {
        // 省
        const { err, data: { data } } = await this.$service.zone.options_city(
          code
        )
        if (err) return
        data.map(item => {
          item['children'] = []
        })
        this.cityData.map(item => {
          if (item.code === code) {
            item['children'] = data
          }
        })
      } else if (val.length === 2) {
        // 市
        const {
          err,
          data: { data }
        } = await this.$service.zone.options_district(code)
        if (err) return
        this.cityData.map(item => {
          item.children.map(item_ => {
            if (item_.code === code) {
              item_['children'] = data
            }
          })
        })
      } else if (val.length === 3) {
        // 县
        console.log(val)
      } else {
        console.log('')
      }
    },
    /** 获取省市区 */
    async get_province () {
      const {
        err,
        data: { data }
      } = await this.$service.zone.options_province()
      if (err) return
      data.map(item => {
        item['children'] = []
      })
      this.cityData = data
    },
    /** 获取仓库详情 */
    async stock_detail () {
      const { err, data } = await this.$service.stock.getWarehouseInfo({
        id: this.stock_id
      })
      if (err) return
      this.formData.id = data.data.id
      this.formData.warehouseName = data.data.warehouseName
      this.formData.provinceId = data.data.provinceId
      this.formData.cityId = data.data.cityId
      this.formData.districtId = data.data.districtId
      // this.formData.addressDetail = data.data.address;
      this.formData.contactName = data.data.contactName
      this.formData.mobile = data.data.mobile
      this.formData.lng = data.data.lng
      this.formData.lat = data.data.lat
      this.formData.mark = data.data.mark
      this.formData.address = data.data.address
      this.formData.selectRegion = [
        data.data.provinceId,
        data.data.cityId,
        data.data.districtId
      ]
      this.searchAddress() // 检索地图
      getCityData([data.data.provinceId, data.data.cityId], this, 'cityData')
    }
  }
}
</script>

<style scoped>
.module-box {
  padding: 15px;
  background-color: #ffffff;
  position: relative;
}
/*底部确认出库按钮*/
.confirm-outgoing {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #f9faff;
  position: absolute;
  bottom: -70px;
  left: 0;
}
/*地图api*/
.map-box {
  width: 600px;
  height: 350px;
  background-color: #00ffff;
  position: relative;
}
.map-box #panel {
  position: absolute;
  background-color: white;
  height: 350px;
  overflow-y: auto;
  top: 0px;
  right: -286px;
  width: 280px;
}
</style>
<style>
/*
        隐藏地图内的 查看详情，电话， 图片
    */
#panel .poi-more,
#panel .poi-tel,
#panel .poi-img {
  display: none !important;
}
.map-box #container .poi-more {
  display: none !important;
}
</style>
