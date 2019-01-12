<template>
  <div>
    <table class="table" border="1" cellspacing="0">
      <thead>
      <tr>
        <th>商品信息</th>
        <th width="10%">商品清单</th>
        <th width="10%">商家收货人</th>
        <th width="20%">收货信息</th>
        <th width="14%">订单金额</th>
        <th width="9%">交易状态</th>
        <th width="13%">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="!orderData || orderData.length===0">
        <td colspan="7">
          暂无数据
        </td>
      </tr>
      <template v-for="(item,index) in orderData" :index="index">
        <tr>
          <td colspan="7" class="order_info">
            <span>订单编号：{{item.order_no}}（订单ID：{{item.id}}）</span>
            <span>交易号：{{item.out_order_no}} </span>
            <span>下单时间：{{item.created_at | formatTime}}</span>
          </td>
        </tr>
        <template v-for="(itemGoods,indexGoods) in item.goods" :index="indexGoods">
          <tr>
            <td class="goods_name">
              <div class="clearfix">
                <div class="goods_pic">
                  <img :src="itemGoods.pic_data" alt="">
                </div>
                <div class="goods_title">{{itemGoods.goods_name}}</div>
              </div>

            </td>
            <td>
              <div><p>{{itemGoods.price}}元</p>
                <p>{{itemGoods.num}}件</p></div>
            </td>
            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <div><p>{{item.business_name}}</p>
                <p>{{item.customer_mobile}}</p></div>
            </td>
            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <div>
                <p>{{item.customer_province_name}}{{item.customer_city_name}}{{item.customer_district_name}}</p>
              </div>
            </td>
            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <div>
                <p>总金额：{{itemGoods.goods_info.goods_money}}</p>
                <p>含快递：{{itemGoods.goods_info.adjust_money||"0.00"}}</p>
                <p>{{item.payment_type_info}}</p>
              </div>
            </td>
            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <div>{{item.order_status}}</div>
            </td>

            <td v-if="indexGoods===0" :rowspan="item.goods.length>1?item.goods.length:''">
              <p v-if="$checkActionAccess($ACCESS.AFTER_ORDER_DETAIL)">
                <span class="editBut" @click="data_detail(item.id)">查看详情</span>
              </p>
              <p>
                <span class="editBut" @click="data_detail(item.id)" style="color:#4CAF50">{{orderStatu(index)}}</span>
              </p>
            </td>
          </tr>
        </template>
      </template>
      </tbody>
    </table>

    <el-dialog
      title="备注信息"
      :visible.sync="dialogVisible"
      width="40%"
      center
    >
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 8}"
        placeholder="请输入内容"
        v-model="text">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addNote" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  props: {
    orderData: {}
  },
  data () {
    return {
      dialogVisible: false,
      text: '',
      idNow: '',
      formLabelWidth: '150px'
    }
  },
  computed: {},
  methods: {
    orderStatu (i) {
      if (this.orderData[i].order_status != 3 && this.orderData[i].order_status != 4) {
        if (this.orderData[i].check_status == 1 && this.orderData[i].ship_status == 0) {
          this.active = 0
          return '用户未发货'
        } else if (this.orderData[i].check_status == 1 && this.orderData[i].ship_status == 1) {
          this.active = 1
          return '用户已发货'
        } else if (this.orderData[i].check_status == 2) {
          this.active = 0
          return '审核不通过'
        } else if (this.orderData[i].check_status == 0) {
          this.active = 0
          return '等待审核中'
        } else if (this.orderData[i].ship_status == 2 && this.orderData[i].order_status == 1 && this.orderData[i].refund_status == 0) {
          this.active = 2
          return '商家已签收'
        } else if (this.orderData[i].ship_status == 3) {
          this.active = 2
          return '商家已拒签'
        } else if (this.orderData[i].Data_status == 2 && this.orderData[i].refund_status == 1) {
          this.active = 4
          return '退款成功'
        } else if (this.orderData[i].refund_status == 2) {
          this.active = 3
          return '商家拒绝退款'
        }
      }
    },
    /**
       *   订单详情
       */
    data_detail (id) {
      this.$router.push({
        path: `/order/list/returnDetail/${id}`,
        query: {
          orderId: id
        }
      })
    },

    /**
       *   添加备注
       */
    addNoteDialog (id, text) {
      this.idNow = id
      this.text = text
      this.dialogVisible = true
    },
    async addNote () {
      this.dialogVisible = false
      if (this.text == '') return
      const {err, data} = await this.$service.shopOrder.ordermanager.orderNoteUpdate({
        id: this.idNow,
        remark: this.text
      })
      this.$message({
        type: 'success',
        message: data.message
      })
      if (err) return
    },

    /**
       *   删除订单
       */
    deleteOrder (id, i) {
      this.$confirm('确定要删除该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.shopOrder.ordermanager.orderDelete({
            id: id
          })
          this.orderData.splice(i, 1)
          this.$emit('refresh')
          this.$message({
            type: 'success',
            message: data.message
          })
        })
        .catch(() => {
        })
    }
  }
}
</script>
<style scoped>
  .table {
    font-size: 12px;
    text-align: center;
    width: 100%;
    background: #FFF;
    border: none;
    color: #495060;
  }

  .table thead {
    background: linear-gradient(#fbfbfb, #ececec);
  }

  .table th {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: none;
    background-color: #FFF;
    color: #909399;
  }

  .table td {
    line-height: 24px;
    padding: 10px 0;
    border: 1px solid #DDD;
  }

  .table td > div {
    text-align: left;
    display: inline-block
  }

  .table .order_info {
    text-align: left;
    padding: 0 0 0 10px;
    background: #f0f0f0;
    line-height: 30px;
  }

  .table .order_info > span {
    display: inline-block;
    padding-right: 20px;
  }

  .table .goods_name {
    color: #108cee;
    padding-left: 10px;
    text-align: left;
  }

  .table .goods_name > div {
    display: block;
  }

  .goods_name .goods_pic {
    float: left;
    width: 60px;
    height: 60px;
  / / background: #108cee;
  }

  .goods_name .goods_pic img {
    width: 100%;
  }

  .goods_name .goods_title {
    float: left;
    padding-left: 22px;
    width: calc(100% - 100px)
  }

  .ivu-btn {
    padding: 3px 17px;
  }

  .editBut {
    color: #108cee;
    cursor: pointer;
  }

  .addressForm .el-input {
    width: 458px;
  }

  .el-select {
    width: 150px;
  }
</style>
