<style scoped>
  @import "./sale.css";

  .goods_sel_left {
    margin-right: 10px;
  }
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
          <el-form-item label=" ">
            <SaveGoodsDis :componentKey="componentKey" @goodsDataRight="goodsDataRight"
                          :goodsDataRight="goods_data_right"/>
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
import SaveGoodsDis from '@/page/sale/components/selectGoods.vue'

export default {
  components: {
    SaveGoodsDis
  },
  data () {
    return {
      loading: false,
      activeDate: '',
      save_discount: [
        {
          level: 1,
          is_jianprice: false,
          man_price: '',
          dis_price: ''
        }
      ],
      is_jianprice: false,
      componentKey: 'discount',
      formData: {
        discount_name: '',
        start_time: '',
        end_time: '',
        goods: ''
      },
      goods_data_right: []
    }
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
        goods.push({goods_id: item.goods_id, discount: item.discount, sku_id: item.sku[0].sku_id})
      })
      this.formData.goods = JSON.stringify(goods)
      this.loading = true
      const {
        err,
        data
      } = await this.$service.shopmanager.discount.discountAdd(this.formData)
      this.loading = false
      if (err) return
      this.$message({
        message: data.message,
        type: 'success'
      })
      this.$router.push({path: '/sale/discount'})
    },
    /** 日期改变 */
    dateChange (val) {
      this.formData.start_time = parseInt(val[0] / 1000)
      this.formData.end_time = parseInt(val[1] / 1000)
    }
  }
}
</script>
