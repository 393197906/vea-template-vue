<style scoped>
  @import "./sale.css";

  .goods_sel_left {
    margin-right: 10px;
  }

  .price_input {
    width: 100px;
  }
</style>

<template>
  <div>
    <el-tabs class="active_box">
      <p class="view_title">活动信息</p>
      <div>
        <el-form ref="form" label-width="100px">
          <el-form-item label="活动名称" required>
            <el-input v-model="formData.mansong_name"></el-input>
          </el-form-item>
          <el-form-item label="生效时间" required>
            <el-date-picker
              v-model="activeDate"
              type="datetimerange"
              align="right"
              unlink-panels
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="dateChange">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-tabs>
    <el-tabs class="active_box">
      <p class="view_title">优惠设置</p>
      <div>
        <el-form ref="form" label-width="100px">
          <el-form-item label="优惠方式" required>
            <el-radio-group v-model="formData.type" @change="discountFn">
              <el-radio label="1">普通优惠</el-radio>
              <el-radio label="2">多级优惠 <span class="more_tip">（每级优惠不累积叠加）</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="优惠条件">
            <el-row class="table-head">
              <el-col :span="2">
                <div class="grid-content">层级</div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">优惠门槛</div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">优惠方式</div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content">操作</div>
              </el-col>
            </el-row>
            <template v-for="(item,index) in save_discount">
              <el-row class="table-tr">
                <el-col :span="2">
                  <div class="grid-content">{{item.level}}</div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content">满
                    <el-input-number v-model="item.man_price" class="price_input" size="medium" :min="0"
                                     :controls="false"></el-input-number>
                    元
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content" v-if="!item.is_jianprice">
                    <el-checkbox v-model="item.is_jianprice">减现金</el-checkbox>
                  </div>
                  <div class="grid-content" v-else>
                    <el-checkbox v-model="item.is_jianprice"></el-checkbox>
                    减
                    <el-input-number v-model="item.dis_price" class="price_input" size="medium" :min="0"
                                     :controls="false"></el-input-number>
                    元
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content">
                    <el-button type="danger" icon="el-icon-delete" circle v-if="index>0"
                               @click="delDiscount(index)"></el-button>
                  </div>
                </el-col>
              </el-row>
            </template>
            <div class="save_tip" v-if="save_discount.length<5&&formData.type=='2'">
              <span class="save_btn" @click="saveDiscount">+新增一级优惠</span> <span>最多可设置五个层级</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-tabs>
    <el-tabs class="active_box">
      <p class="view_title">选择活动商品</p>
      <div>
        <el-form ref="form" label-width="30px">
          <el-form-item label=" ">
            <el-radio-group v-model="formData.range_type">
              <el-radio label="1">所有商品</el-radio>
              <el-radio label="0">部分商品</el-radio>
            </el-radio-group>
            <div v-if="formData.range_type!=='1'" class="clearfix">
              <SaveGoods v-if="isload" :componentKey="componentKey" @goodsDataRight="goodsDataRight"
                         :goodsDataRight="goods_data_right"/>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-tabs>
    <el-tabs class="active_box">
      <el-button type="primary" class="submit_btn" @click="submitData" :loading="loading">提交</el-button>
    </el-tabs>
  </div>
</template>
<script>
import SaveGoods from '@/page/sale/components/selectGoods.vue'

export default {
  components: {
    SaveGoods
  },
  data () {
    return {
      loading: false,
      flag: true,
      id: '',
      activeDate: '',
      isload: false,
      left_page: 1,
      goods_data: [],
      goods_data_right: [],
      save_discount: [],
      is_jianprice: false,
      componentKey: 'mansong',
      formData: {
        mansong_name: '',
        start_time: '',
        end_time: '',
        type: '1',
        range_type: '1',
        goods_id: '',
        price: [],
        discount: [],
        rule: [],
        remark: ''
      },
      goods_data_right: []
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getData()
  },
  methods: {
    /** 选择商品组件监听 */
    goodsDataRight (data) {
      this.goods_data_right = data
    },
    /** 数据提交 */
    async submitData () {
      this.flag = true
      if (!this.formData.mansong_name) {
        this.$message({
          message: '请输入活动名称',
          type: 'warning'
        })
        return false
      }
      if (!this.activeDate) {
        this.$message({
          message: '请选择活动时间',
          type: 'warning'
        })
        return false
      }
      this.save_discount.forEach(item => {
        if (item.dis_price >= item.man_price) {
          this.flag = false
        }
      })
      if (!this.flag) {
        this.$message({
          message: '请输入正确的金额',
          type: 'warning'
        })
        return false
      }
      this.formData.price = []
      this.formData.discount = []
      this.save_discount.forEach(item => {
        this.formData.rule.push({
          price: item.man_price,
          discount: item.is_jianprice ? item.dis_price : 0
        })
      })
      if (!this.formData.rule.length) {
        this.$message({
          message: '请输入优惠条件',
          type: 'warning'
        })
        return false
      }
      let goods_id = []

      if (!this.goods_data_right.length && this.formData.range_type != 1) {
        this.$message({
          message: '请至少选择一种商品',
          type: 'warning'
        })
        return false
      }
      this.goods_data_right.forEach(item => {
        goods_id.push({goods_id: item.goods_id, sku_id: item.sku[0].sku_id})
      })
      this.formData.goods_id = JSON.stringify(goods_id)
      this.loading = true
      const {
        err,
        data
      } = await this.$service.shopmanager.fullReduction.fullreductionEdit(
        this.id,
        this.formData
      )
      this.loading = false
      if (err) return
      this.$message({
        message: data.message,
        type: 'success'
      })
      this.$router.push({path: '/sale/mansong'})
    },
    /** 获取详情数据 */
    async getData () {
      const {
        err,
        data
      } = await this.$service.shopmanager.fullReduction.fullreductionDetail({
        id: this.id
      })
      const _data = data.result
      this.formData.mansong_name = _data.mansong_name
      this.formData.start_time = _data.start_time
      this.formData.end_time = _data.end_time
      this.formData.range_type = _data.range_type + ''
      this.formData.type = _data.type + ''
      // this.goods_data_right = typeof _data.goods != "string" ? _data.goods : [];
      if (typeof _data.goods !== 'string') {
        _data.goods.forEach(item => {
          item.is_pricing = !!parseInt(item.is_pricing)
        })
        this.goods_data_right = _data.goods
      } else {
        this.goods_data_right = []
      }
      this.isload = true
      this.activeDate = [
        new Date(_data.start_time * 1000),
        new Date(_data.end_time * 1000)
      ]
      _data.rule.forEach((item, i) => {
        this.save_discount.push({
          level: i,
          is_jianprice: true,
          man_price: item.price,
          dis_price: item.discount
        })
      })
    },
    /** 日期改变 */
    dateChange (val) {
      this.formData.start_time = parseInt(val[0] / 1000)
      this.formData.end_time = parseInt(val[1] / 1000)
    },

    saveDiscount () {
      this.save_discount.push({
        level: this.save_discount.length + 1,
        is_jianprice: false,
        man_price: '',
        dis_price: ''
      })
    },
    delDiscount (index) {
      this.save_discount.splice(index, 1)
    },
    discountFn (val) {
      if (val === '1') {
        this.save_discount = [
          {
            level: 1,
            is_jianprice: false,
            man_price: '',
            dis_price: ''
          }
        ]
      }
    }
  }
}
</script>
