<!--
支持新增模式与编辑模式
-->
<template>
  <div>
    <el-tabs class="active_box" id="info">
      <p class="view_title">商品信息</p>
      <Info ref="child_info" :editData="goods"/>
    </el-tabs>
    <el-tabs class="active_box" id="type">
      <p class="view_title">商品类型</p>
      <Type ref="child_type" :editData="goods"/>
    </el-tabs>
    <el-tabs class="active_box" id="detail">
      <p class="view_title">商品详情</p>
      <Detail ref="child_detail" :editData="goods"/>
    </el-tabs>
    <el-tabs class="active_box" id="other">
      <p class="view_title">其他信息</p>
      <Other ref="child_other" :editData="goods"/>
    </el-tabs>
    <el-tabs class="active_box" style="text-align: center">
      <el-button icon="el-icon-upload2" type="primary" size="small" class="submit_btn" @click="submit"
                 :loading="loading">
        {{edit?"保存":"发布"}}商品
      </el-button>
      <el-button v-if="edit" icon="el-icon-back" size="small" type="default" class="submit_btn" @click="$router.back()">
        返回列表
      </el-button>
    </el-tabs>
    <div class='all'>
      <div class='box'>
        <a href='' @click.prevent="jump('info')">
          <div class='card bg-01'><span class='card-content'>商品信息</span></div>
        </a>
      </div>
      <div class='box'>
        <a href='' @click.prevent="jump('type')">
          <div class='card bg-02'><span class='card-content'>商品类型</span></div>
        </a>
      </div>
      <div class='box'>
        <a href='' @click.prevent="jump('detail')">
          <div class='card bg-03'><span class='card-content'>商品详情</span></div>
        </a>
      </div>
      <div class='box'>
        <a href='' @click.prevent="jump('other')">
          <div class='card bg-04'><span class='card-content'>其他信息</span></div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Info from './add/info'
import Detail from './add/detail'
import Other from './add/other'
import Shipping from './add/shipping'
import Type from './add/type'

export default {
  name: 'add',
  components: {
    Info, Detail, Other, Shipping, Type
  },
  data () {
    return {
      loading: false,
      edit: false,
      goods: {}
    }
  },

  async created () {
    // 编辑模式
    const {id: goods_id = 0} = this.$route.params
    if (goods_id) {
      const {err, data} = await this.$service.goods.goods_common_api.goods_edit_detail(goods_id)
      if (err) return
      this.goods = data.result
      this.edit = true
    }
  },
  methods: {
    jump (archorName) {
      let anchorElement = document.getElementById(archorName)
      if (anchorElement) {
        anchorElement.scrollIntoView()
      }
    },
    async submit (goods) {
      const info_result = this.$refs.child_info.next()
      console.log(info_result)
      if (!info_result) {
        this.$message.error('请完善商品基础信息')
        this.jump('info')
        return
      }
      const type_result = this.$refs.child_type.next()
      if (!type_result) {
        this.$message.error('请完善商品类型信息')
        this.jump('type')
        return
      }
      const skuPrice = JSON.parse(type_result.skuArray)
      let isEmpty = true
      skuPrice.map((item, index) => {
        item.pricing_list.map((item2, index2) => {
          if ((item2.is_default == 10 || item2.status == 11 || !item2.status) && (!item2.market_price || !item2.price)) {
            this.$message.error(`请完善序列${index + 1}中，体系${index2 + 1}的销售价和市场价`)
            isEmpty = false
          }
        })
      })
      if (!isEmpty) return
      const skuPrice2 = skuPrice.map((item, index) => {
        return {
          ...item,
          pricing_list: item.pricing_list.map((item2, index2) => {
            if (item2.is_default == 10 || !item2.is_default) {
              return {
                ...item2,
                status: 11
              }
            } else {
              return {
                ...item2
              }
            }
          })
        }
      })
      type_result.skuArray = JSON.stringify(skuPrice2)
      const detail_result = this.$refs.child_detail.next()
      if (!detail_result) {
        this.$message.error('请完善商品详情信息')
        this.jump('detail')
      }
      const other_result = this.$refs.child_other.next()
      if (!other_result) {
        this.$message.error('请完善商品其他信息')
        this.jump('other')
      }
      const submitResult = {...info_result, ...type_result, ...detail_result, ...other_result}
      submitResult.goods_attribute_id = submitResult.goods_attribute_id || 0 // 修复不能为空字符串的问题
      this.loading = true
      if (this.edit) {
        // console.log("1", JSON.stringify(submitResult));
        const {err, data} = await this.$service.goods.goods_common_api.goodsEditSku(this.$route.params.id, submitResult)
        this.loading = false
        if (err) return
        this.$message.success('商品修改成功')
      } else {
        const {err, data} = await this.$service.goods.add(submitResult)
        this.loading = false
        if (err) return
        this.$message.success('商品发布成功')
      }
      this.$router.back()
    }
  }
}
</script>

<style scoped>
  @import './add.css';
</style>
