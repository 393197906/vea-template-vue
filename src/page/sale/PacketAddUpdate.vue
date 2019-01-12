<style scoped>
  @import "./sale.css";

  .packetCon {
    margin: 15px 0px 30px 0px;
    overflow: hidden;
    color: #666;
  }

  .proCon {
    border: 1px solid #eee;
  }

  .packetCon img {
    float: right;
  }

  .ptitle {
    font-size: 16px;
  }

  .info {
    margin-top: 5px;
  }

  .inputcenter {
    width: 100%;
    text-align: center;
  }

  .tips {
    color: #909399;
    margin-left: 5px;
  }

  .submit_btn {
    margin-top: 2rem;
    margin-bottom: 3rem;
  }
</style>

<template>
  <div v-loading="loading">
    <el-tabs class="active_box">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="packetCon">
            <img src="../../images/bonus.png">
          </div>
        </el-col>
        <el-col :span="10">
          <div class="packetCon">
            <p class="ptitle">{{headTitle[tId].title}}</p>
            <p class="info">{{headTitle[tId].content}}</p>
          </div>
        </el-col>
      </el-row>
    </el-tabs>

    <el-tabs class="active_box" v-if="showSubmit">
      <p class="view_title">优惠劵基本信息</p>
      <div>
        <el-form :model="formData" :rules="rules" ref="formData" label-width="140px">
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="优惠劵名称" prop="coupon_name" required>
                <el-input placeholder="请输入优惠劵名称" v-model="formData.coupon_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="优惠劵面值" required prop="coupon_money">
                <el-input @change="setCon" placeholder="请输入优惠劵面值" :min="0" type="number"
                          v-model="formData.coupon_money">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6" v-if="$route.query.type!=3">
              <el-form-item label="优惠劵发放数量" prop="send_num" required>
                <el-input placeholder="请输入优惠劵发放数量" type="number" v-model="formData.send_num"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="$route.query.type==1">
            <el-col :span="12" :offset="6">
              <el-form-item label="门店限领数量" required prop="receive_num">
                <el-input placeholder="请输入面值" v-model="formData.receive_num">
                  <template slot="append">张</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="使用有效期" required>
                <el-date-picker style="width: 100%"
                                v-model="term"
                                type="daterange"
                                align="right"
                                unlink-panels
                                :picker-options="pickerOptions0"
                                value-format="timestamp"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                @change="dateChange">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="使用范围" required prop="range_type">
                <el-radio-group v-model="formData.range_type" @change="srange">
                  <el-radio :label="1">全部商品</el-radio>
                  <el-radio :label="0">部分商品</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="formData.range_type!=1" class="clearfix">
            <el-row>
              <el-col :span="19" :offset="3">
                <SaveGoods :componentKey="componentKey" @goodsDataRight="goodsDataRight" :goodsDataRight="goods_data_right"/>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="14" :offset="6">
              <el-form-item label="使用条件" required prop="coupon_rang">
                <el-radio-group v-model="formData.coupon_rang">
                  <el-radio :label="1">仅限原价购买可用</el-radio>
                  <el-radio :label="2">可与其他优惠、活动一起使用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="最小订单金额限制" required prop="spend_money">
                <el-input type="number" placeholder="请输入最小订单金额限制" v-model="formData.spend_money">
                  <template slot="prepend">购物满</template>
                  <template slot="append">元可用</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row>
        <el-col :span="3" :offset="10">
          <el-button type="primary" class="submit_btn" @click="submitForm('formData')" :loading="loading">确认发布
          </el-button>
        </el-col>
      </el-row>
    </el-tabs>
    <el-tabs class="active_box" v-if="showCheck">
      <p class="view_title">优惠劵基本信息</p>
      <div>
        <el-form :model="cfrom" ref="cfrom" label-width="140px">
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="优惠劵名称">
                {{cfrom.coupon_name}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="优惠劵面值">
                {{cfrom.coupon_money}}元
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="优惠劵发放数量">
                {{cfrom.send_num}}张
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="门店限领数量">
                {{cfrom.receive_num}}张
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="使用有效期">
                <el-col :span="3">
                  {{cfrom.send_start_time}}
                </el-col>
                <el-col class="line" :span="1">
                  <div class="inputcenter">至</div>
                </el-col>
                <el-col :span="11">
                  {{cfrom.send_end_time}}
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="cfrom.goods.length==0">
            <el-col :span="12" :offset="6">
              <el-form-item label="使用范围">
                {{cfrom.range_info}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="cfrom.goods.length>0">
            <el-col :span="8" :offset="6">
              <el-form-item label="使用范围">
                <div class="proCon">
                  <div class="goods_view clearfix" v-for="goodItem in cfrom.goods">
                    <span class="data_tit"><img :src="goodItem.pic_cover_micro" alt=""></span>
                    <span class="data_info">{{goodItem.goods_info}}</span>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="使用条件">
                {{cfrom.coupon_range}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="6">
              <el-form-item label="最小订单金额限制">
                购物满{{cfrom.spend_money}}元可用
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row>
        <el-col :span="3" :offset="6">
          <el-button type="primary" class="submit_btn" @click="backlist">返回列表</el-button>
        </el-col>
      </el-row>
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
    var checkNum = (rule, value, callback) => {
      const regu = /^\+?[1-9][0-9]*$/
      if (value === '') {
        callback(new Error('请输入优惠劵发放数量'))
      } else if (regu.test(value)) {
        if (parseInt(value) < 1) {
          callback(new Error('优惠劵发放数量最小是1'))
        } else {
          callback()
        }
      } else {
        callback(new Error('优惠劵发放数量只能是正整数'))
      }
    }
    var checkminNum = (rule, value, callback) => {
      const regu = /^\+?[1-9][0-9]*$/
      if (value === '') {
        callback(new Error('请输入优惠劵最少领取数量'))
      } else if (regu.test(value)) {
        if (parseInt(value) < 1) {
          callback(new Error('用于限制每个会员领取此优惠劵的数量，最小值为“1”'))
        } else {
          callback()
        }
      } else {
        callback(new Error('优惠劵领取数量只能是正整数'))
      }
    }
    var checkMoney = (rule, value, callback) => {
      const regu = /^\+?[0-9][0-9]*$/
      if (value === '') {
        callback(new Error('优惠劵面值不能为空'))
      } else if (regu.test(value)) {
        if (parseInt(value) < 0) {
          callback(new Error('优惠劵面值不能为负数'))
        } else {
          callback()
        }
      } else {
        callback(new Error('优惠劵领取数量只能是正整数'))
      }
    }
    var checkMinMoney = (rule, value, callback) => {
      const regu = /^\+?[0-9][0-9]*$/
      if (value === '') {
        callback(new Error('最小订单金额限制不能为空'))
      } else if (regu.test(value)) {
        if (parseInt(value) < 0) {
          callback(new Error('最小订单金额限制不能为负数'))
        } else {
          if (parseInt(value) > this.contrast) {
            callback()
          } else {
            callback(new Error('最小订单金额限制必须大于优惠劵面值'))
          }
        }
      } else {
        callback(new Error('最小订单金额限制只能是正整数'))
      }
    }
    return {
      loading: false,
      term: '',
      componentKey: 'mansong',
      formData: {
        coupon_name: '',
        coupon_type: '',
        coupon_money: 0,
        range_type: 1,
        coupon_rang: 1,
        send_num: 1,
        receive_num: 1,
        spend_money: 0,
        send_start_time: '',
        send_end_time: '',
        goods: []
      },
      goods_data_right: [],
      contrast: '',
      rules: {
        coupon_name: [
          {required: true, message: '优惠劵名称不能为空', trigger: 'blur'},
          {max: 30, message: '优惠劵名称不能超过30个字符', trigger: 'blur'},
          {required: true, message: '优惠劵名称不能为空', trigger: 'change'},
          {max: 30, message: '优惠劵名称不能超过30个字符', trigger: 'change'}
        ],
        coupon_money: [
          {validator: checkMoney, trigger: 'blur'},
          {validator: checkMoney, trigger: 'change'}
        ],
        send_num: [
          {validator: checkNum, trigger: 'blur'},
          {validator: checkNum, trigger: 'change'}
        ],
        receive_num: [
          {validator: checkminNum, trigger: 'blur'}
        ],
        range_type: [
          {required: true, message: '请选择使用范围', trigger: 'change'}
        ],
        coupon_rang: [
          {required: true, message: '请选择使用条件', trigger: 'change'}
        ],
        spend_money: [
          {validator: checkMinMoney, trigger: 'blur'},
          {validator: checkMinMoney, trigger: 'change'}
        ]
      },
      showCheck: false,
      showSubmit: true,
      cfrom: {
        coupon_name: '', // 优惠劵名称
        coupon_money: 0, // 优惠劵面值
        send_start_time: '', // 有效期开始时间
        send_end_time: '', // 有效期结束时间
        range_info: '', // 使用范围
        coupon_id: '', // 优惠劵id
        coupon_range: '', // 使用条件
        send_num: 0, // 优惠劵发放数量
        receive_num: 0, // 优惠劵领取数量
        spend_money: 0, // 最小订单金额限制
        goods: []
      },
      tId: 'type_1',
      headTitle: {
        type_1: {title: '到店送优惠券', content: '用户主动领取，领取的场景是：手机或PC端的商品详情页、购物车'},
        type_2: {
          title: '关注送优惠券',
          content: '系统自动派发，系统提醒用户获得优惠券：会员仅当首次收藏店铺时有效 收藏优惠券仅能创建一次，不可删除，您可以选择作废或者过期后重新创建该类型优惠券'
        },
        type_3: {title: '会员送优惠券', content: '卖家主动派发，系统提醒用户获得优惠券'},
        type_5: {title: '推荐人送优惠券', content: '推荐人送优惠券'},
        type_6: {title: '推荐注册门店送优惠券', content: '推荐注册门店送优惠券'}
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created () {
    this.tId = this.$route.query.type ? 'type_' + this.$route.query.type : 'type_1'
    switch (this.$route.query.key) {
      case 'check':
        this.showCheck = true
        this.showSubmit = false
        this.getDetail(this.$route.query.pId)
        break
      default:
        this.formData.coupon_type = this.$route.query.type
        break
    }
  },
  methods: {
    setCon (val) {
      this.contrast = val
    },
    /** 选择商品组件监听 */
    goodsDataRight (data) {
      this.goods_data_right = data
      let arr = new Array()
      for (let item of data) {
        arr.push({goods_id: item.goods_id, sku_id: item.sku[0].sku_id})
      }
      this.formData.goods = JSON.stringify(arr)
    },
    // 获取优惠劵详情
    async getDetail (pId) {
      this.loading = true
      const {err, data} = await this.$service.shopmanager.packet.detail({id: pId})
      this.loading = false
      if (err) return
      this.cfrom = data.result
      if (!data.result.goods) {
        this.cfrom.goods = []
      }
      this.cfrom.goods.forEach(item => {
        let skuName = ''
        if (item.sku.length > 0) {
          skuName = skuName + '('
          item.sku.forEach(iitem => {
            skuName = skuName + iitem.sku_name
          })
          skuName = skuName + ')'
        }
        item.goods_info = item.goods_name + skuName
      })
      this.tId = 'type_' + data.result.coupon_type
    },
    // 返回优惠劵列表
    backlist () {
      this.$router.push({path: '/sale/packet'})
    },
    dateChange (val) {
      this.formData.send_start_time = val ? parseInt(val[0]) / 1000 : ''
      this.formData.send_end_time = val ? (parseInt(val[1]) / 1000) + 86399 : ''
    },
    // 选择使用范围
    srange (val) {
      if (val == 1) {
        this.formData.goods = []
      }
    },
    submitForm (formName) {
      let that = this
      this.$refs[formName].validate(
        async function (valid) {
          if (valid) {
            that.loading = true
            const {err, data} = await that.$service.shopmanager.packet.add(that.formData)
            that.loading = false
            if (err) return
            that.$message({
              type: 'success',
              message: '添加优惠劵成功！'
            })
            that.$router.back()
          } else {
            return false
          }
        })
    }
  }
}
</script>
