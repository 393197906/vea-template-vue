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
            <el-input v-model="formData.compre_name"></el-input>
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
          <el-form-item label="优惠方式">
            <el-radio-group v-model="type">
              <el-radio label="1">普通优惠</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="优惠条件">
            <el-row>
              <el-col :span="8">
                满
                <el-input-number v-model="formData.nums" class="price_input" :min="1"
                                 :controls="false"></el-input-number>
                件商品
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </el-tabs>
    <!--<el-tabs class="active_box">-->
    <!--<p class="view_title">选择活动商品</p>-->
    <!--<div>-->
    <!--<el-form ref="form" label-width="30px">-->
    <!--<el-form-item label=" ">-->
    <!--<el-radio-group v-model="formData.range_type">-->
    <!--<el-radio label="1">所有商品</el-radio>-->
    <!--<el-radio label="0">部分商品</el-radio>-->
    <!--</el-radio-group>-->
    <!--<div v-if="formData.range_type!=='1'" class="clearfix">-->
    <!--<SaveGoods @goodsDataRight="goodsDataRight" :goodsDataRight="goods_data_right"/>-->
    <!--</div>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--</div>-->
    <!--</el-tabs>-->
    <el-tabs class="active_box">
      <el-button type="primary" class="submit_btn" @click="submitData" :loading="loading">提交</el-button>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      activeDate: '',
      type: '1',
      formData: {
        compre_name: '',
        start_time: '',
        end_time: '',
        range_type: '1',
        goods_id: '',
        nums: '',
        remark: ''
      },
      goods_data_right: []
    }
  },
  created () {
  },
  methods: {
    /** 选择商品组件监听 */
    goodsDataRight (data) {
      this.goods_data_right = data
    },
    /** 数据提交 */
    async submitData () {
      if (!this.formData.compre_name) {
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

      let goods_id = []
      this.goods_data_right.forEach(item => {
        goods_id.push(item.goods_id)
      })
      this.formData.goods_id = goods_id.join()
      this.loading = true
      const {
        err,
        data
      } = await this.$service.shopmanager.colligate.colligateAdd(this.formData)
      this.loading = false
      if (err) return
      this.$message({
        message: data.message,
        type: 'success'
      })
      this.$router.push({path: '/sale/colligate'})
    },
    /** 日期改变 */
    dateChange (val) {
      this.formData.start_time = parseInt(val[0] / 1000)
      this.formData.end_time = parseInt(val[1] / 1000)
    }
  }
}
</script>
