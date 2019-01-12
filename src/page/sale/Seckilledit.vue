<style scoped>
  @import "./sale.css";
</style>

<template>
  <div>
    <el-tabs class="active_box">
      <p class="view_title">活动信息</p>
      <div>
        <el-form ref="form" label-width="100px">
          <el-form-item label="活动名称" required>
            <el-input v-model="formData.discount_name"></el-input>
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
      <p class="view_title">选择活动商品</p>
      <div>
        <el-form ref="form" label-width="30px">
          <el-form-item label=" " v-if="isload">
            <SaveGoodsSeckill :componentKey="componentKey" @goodsDataRight="goodsDataRight"
                              :goodsDataRight="goods_data_right"/>
          </el-form-item>
        </el-form>
      </div>
    </el-tabs>
    <el-tabs class="active_box">
      <el-button type="primary" class="submit_btn" @click="submitData">提交</el-button>
    </el-tabs>
  </div>
</template>
<script>
import SaveGoodsSeckill from '@/page/sale/components/selectGoods.vue'

export default {
  components: {
    SaveGoodsSeckill
  },
  data () {
    return {
      activeDate: '',
      save_discount: [
        {
          level: 1,
          is_jianprice: false,
          man_price: '',
          dis_price: ''
        }
      ],
      isload: false,
      is_jianprice: false,
      componentKey: 'seckill',
      formData: {
        discount_name: '',
        start_time: '',
        end_time: '',
        goods: ''
      },
      id: '',
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
      if (!this.formData.discount_name) {
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
      let goods = []
      this.goods_data_right.forEach(item => {
        goods.push({
          goods_id: item.goods_id,
          discount: item.discount,
          can_count: item.can_count,
          sku_id: item.sku[0].sku_id
        })
      })
      this.formData.goods = JSON.stringify(goods)
      const {
        err,
        data
      } = await this.$service.shopmanager.seckill.discountEdit(
        this.id,
        this.formData
      )
      this.$message({
        message: data.message,
        type: 'success'
      })
      this.$router.push({path: '/sale/seckill'})
    },
    /** 获取详情数据 */
    async getData () {
      const {
        err,
        data
      } = await this.$service.shopmanager.seckill.discountDetail(this.id)
      const _data = data.result
      this.formData.discount_name = _data.discount_name
      this.formData.start_time = _data.start_time
      this.formData.end_time = _data.end_time
      _data.goods.forEach(item => {
        item.is_pricing = !!parseInt(item.is_pricing)
      })
      this.goods_data_right = _data.goods
      this.isload = true
      this.activeDate = [
        new Date(_data.start_time * 1000),
        new Date(_data.end_time * 1000)
      ]
    },
    /** 日期改变 */
    dateChange (val) {
      this.formData.start_time = parseInt(val[0] / 1000)
      this.formData.end_time = parseInt(val[1] / 1000)
    }
  }
}
</script>
