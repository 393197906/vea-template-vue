<style scoped>
  @import "./order_style.css";
</style>
<template>
  <div class="order_box" v-loading="loading">
    <ul>
      <li class="order_view">
        <div class="order_title">订单状态</div>
        <el-steps :active="active" finish-status="success" style="margin-top:20px" align-center
                  v-if="order.payment_type == 4">
          <el-step title="买家下单" :description="order.create_time ? order.create_time : ''  | formatTime "></el-step>
          <el-step title="待发货" :description="order.pay_type_info"></el-step>
          <el-step title="商家已发货" :description="order.consign_time ? order.consign_time :'' | formatTime"></el-step>
          <el-step title="已收货" :description="order.sign_time ? order.sign_time : '' | formatTime"></el-step>
          <el-step title="已收款"></el-step>
          <el-step title="交易完成" :description="order.finish_time ? order.finish_time : '' | formatTime"></el-step>
        </el-steps>
        <el-steps :active="active" finish-status="success" style="margin-top:20px" align-center
                  v-if="order.payment_type != 4">
          <el-step title="买家下单" :description="order.create_time ? order.create_time : ''  | formatTime "></el-step>
          <el-step title="买家付款,待发货" :description="order.pay_time ? order.pay_time : '' | formatTime"></el-step>
          <el-step title="商家已发货" :description="order.consign_time ? order.consign_time : '' | formatTime"></el-step>
          <el-step title="已收货" :description="order.sign_time ? order.sign_time : '' | formatTime"></el-step>
          <el-step title="交易完成" :description="order.finish_time ? order.finish_time : '' | formatTime"></el-step>
        </el-steps>
        <div class="order_main" style="border:none">
          <p style="margin:20px">
            <i class="el-icon-warning" style="margin-right:10px"></i>订单状态:<span>{{orderStatu}}</span>
              <template v-if="!isDialog">
              <el-button
                type="primary"
                size="mini"
                @click="order_ship"
                v-if="order.order_status == 1 && $checkActionAccess($ACCESS.ORDER_OUT_BILL)"
                style="margin:10px 10px 10px 20px;"
              >生成出库单
              </el-button>
              <el-button
                type="primary"
                size="mini"
                style="margin:10px 10px 10px 20px;"
                v-if="order.order_status == 1 && $checkActionAccess($ACCESS.ORDER_ADDRESS_CHANGE)"
                @click="changeAddress"
              >修改地址
              </el-button>
              <el-button
                type="primary"
                size="mini"
                style="margin:10px 10px 10px 20px;"
                v-if=" $checkActionAccess($ACCESS.ORDER_PRICE_CHANGE) && (order.order_status == 0 || ( order.payment_type == 4 && order.order_status == 1))"
                @click="changeOrder(order)"
              >修改价格
              </el-button>
              <el-button
                type="primary"
                size="mini"
                style="margin:10px 10px 10px 20px;"
                @click="comfirmRecipe"
                v-if="order.order_status == 2 && $checkActionAccess($ACCESS.ORDER_COMMIT)"
              >确认收货
              </el-button>
              <el-button
                type="primary"
                size="mini"
                style="margin:10px 10px 10px 20px;"
                @click="comfirmMoney"
                v-if="order.payment_type == 4 && order.pay_status == 0 && order.order_status == 3"
              >确认收款
              </el-button>
              <el-button
                v-if=" $checkActionAccess($ACCESS.ORDER_NOTE_ADD)"
                type="primary"
                size="mini"
                style="margin:10px 10px 10px 20px;"
                @click="addNoteDialog"
              >添加备注
              </el-button>
              <el-button
                type="primary"
                size="mini"
                style="margin:10px 10px 10px 20px;"
                v-if="order.order_status!=5 && $checkActionAccess($ACCESS.ORDER_PRINT)"
                onClick="printJS({
              printable: 'print_order',
              type: 'html',
              documentTitle:'',
              targetStyles: ['*']
            })"
                @click="printNext"
              >打印订单 (<i class="print-cor">{{order.print_num}}</i>) 次
              </el-button>
              <el-button
                type="danger"
                size="mini"
                style="margin:10px 10px 10px 20px;"
                @click="cancelOrder"
                v-if="$checkActionAccess($ACCESS.ORDER_CANCEL) && (order.pay_status == 0 && (order.payment_type == 1 || order.payment_type == 2) && order.order_status !=5 ) || (order.pay_type == 4 && order.order_status == 1)"
              >取消订单
              </el-button>
              </template>
          </p>
        </div>

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
      </li>

      <li class="order_view">
        <div class="order_title">订单信息</div>
        <div class="order_main">
          <div class="order_ul clearfix">
            <div class="order_li">
              <span>订单编号：</span>
              <span>{{order.order_no}}</span>
            </div>
            <div class="order_li">
              <span>订单状态：</span>
              <span class="bolder">{{order.order_status_info}}</span>
            </div>
            <div class="order_li">
              <span>支付方式：</span>
              <span class="bolder">{{order.payment_type_info}}</span>
            </div>

          </div>
          <div class="order_ul clearfix">
            <div class="order_li">
              <span>会员名称：</span>
              <span>{{order.user_name}}</span>
            </div>
            <div class="order_li">
              <span>店铺名称：</span>
              <span>{{order.shop_name}}</span>
            </div>
            <div class="order_li">
              <span>订单类型：</span>
              <span>{{order.order_type_info}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li">
              <span>收货人号码：</span>
              <span>{{order.receiver_mobile}}</span>
            </div>
            <div class="order_li">
              <span>创建时间：</span>
              <span>{{order.create_time | formatTime }}</span>
            </div>
            <div class="order_li">
              <span>配送方式：</span>
              <span>{{order.shipping_type_info}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li order_li_row">
              <span>买家留言：</span>
              <span>{{order.buyer_message}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li order_li_row">
              <span>订单备注：</span>
              <span>{{order.seller_memo}}</span>
            </div>
          </div>
        </div>
      </li>
      <li class="order_view">
        <div class="order_title">
          <span>商品信息</span>
          <template v-if="!isDialog">
            <el-button
              v-if="$checkActionAccess($ACCESS.ORDER_GOODS_ADD) && [2, 1].includes(parseInt(order.payment_type))&& parseInt(order.order_status) ===0 || (parseInt(order.payment_type) === 4  && [0, 1].includes(parseInt(order.order_status)))"
              style="float: right; margin-top:3px" size="small" type=primary @click="addGoodsChange">添加商品
            </el-button>
          </template>
        </div>
        <div class="order_main order_table">
          <el-table
            :data="goods_data"
            border
            style="width: 100%">
            <el-table-column
              prop="pic_cover_micro"
              label="商品图片"
              align="center">
              <template slot-scope="scope">
                <img :src="scope.row.pic_cover_micro" style="width:80px;height:80px">
              </template>
            </el-table-column>
            <el-table-column
              prop="goods_name"
              label="商品名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="sku_name"
              align="center"
              label="规格">
            </el-table-column>
            <el-table-column
              prop="price"
              align="center"
              label="价格">
            </el-table-column>
            <el-table-column
              prop="num"
              align="center"
              label="数量">
            </el-table-column>
            <el-table-column
              prop="goods_money"
              align="center"
              label="小计">
            </el-table-column>
            <el-table-column
              prop="shipping_status_info"
              align="center"
              label="物流状态">
            </el-table-column>
            <template v-if="!isDialog" >
            <el-table-column
              label="操作"
              align="center"
              width="200"
              v-if="[2, 1].includes(parseInt(order.payment_type))&& parseInt(order.order_status) ===0 || (parseInt(order.payment_type) === 4  && [0, 1].includes(parseInt(order.order_status)))">
              <template slot-scope="scope" >
                <!--<router-link :to="{path:'/goods/goodsskuedit/' + scope.row.goods_id}">-->
                  <!--<el-button type="text">编辑</el-button>-->
                <!--</router-link>-->
                <el-button
                  type="text"
                  v-if="$checkActionAccess($ACCESS.ORDER_GOODS_EDIT)"
                  @click="editGoods(scope.row)"
                  >编辑</el-button>
                <el-button
                  type="text"
                  v-if="$checkActionAccess($ACCESS.ORDER_GOODS_REMOVE)"
                  @click="removeGoods(scope.row.order_goods_id)">删除</el-button>
              </template>
            </el-table-column>
            </template>
            <!--<el-table-column
              prop="return_weight"
              align="center"
              label="退货数量">
            </el-table-column>-->
            <!--<el-table-column prop="return_weight" align="center" label="退货数量">-->
            <!--<template slot-scope="scope">-->
            <!--&lt;!&ndash;<span class="num_cor" @click="storageDetail(scope.row.order_goods_id)" >-->
            <!--{{goods_data[0].return_weight}}-->
            <!--</span>&ndash;&gt;-->
            <!--<span>-->
            <!--{{goods_data[0].return_weight}}-->
            <!--</span>-->
            <!--&lt;!&ndash;return_weight&ndash;&gt;-->
            <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
        </div>
      </li>
      <li class="order_view">
        <div class="order_title">收货信息</div>
        <div class="order_main">
          <div class="order_ul clearfix">
            <div class="order_li">
              <span>收货人姓名：</span>
              <span>{{order.receiver_name}}</span>
            </div>
            <div class="order_li">
              <span>手机号码：</span>
              <span>{{order.receiver_mobile}}</span>
            </div>
            <!-- <div class="order_li">
              <span>邮编：</span>
              <span>{{order.receiver_zip}}</span>
            </div> -->
          </div>
          <!-- <div class="order_ul clearfix">
            <div class="order_li">
              <span>买家要求配送时间：</span>
              <span>{{order.shipping_time || ""}}</span>
            </div>
          </div> -->
          <div class="order_ul clearfix">
            <div class="order_li order_li_row">
              <span>收货地址：</span>
              <span>{{order.province_name}} {{order.city_name}} {{order.district_name}} {{order.receiver_address}}</span>
            </div>
          </div>
        </div>
      </li>

      <li class="order_view">
        <div class="order_title">费用信息</div>
        <div class="order_main">
          <div class="order_ul clearfix">
            <div class="order_li order_li_row">
              <span class="money_row">商品总价：<strong>{{ order.goods_money | money }}</strong> + 物流运费 : <strong>{{ order.shipping_money | money }}</strong> + 发票税额 : <strong>{{ order.fp_money | money }}</strong></span>
            </div>
          </div>
          <!-- 张龙说先隐藏!!! -->
          <!--<div class="order_ul clearfix">
            <div class="order_li order_li_row">
              <span class="money_row">退货金额：<strong> ¥{{returnMoney | formatCurrency}}</strong></span>
            </div>
          </div>-->
          <div class="order_ul clearfix">
            <div class="order_li order_li_row">
              <span class="money_row">订单总金额 : <strong>{{ order.order_money | money}}</strong></span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li order_li_row">
              <span
                class="money_row">- 优惠券金额 : <strong>{{ order.coupon_money | money}}</strong> - 满减活动优惠金额 : <strong>{{ order.promotion_money | money}}</strong> - 打折活动优惠金额 : <strong>{{ order.discount_money | money}}</strong>- 退货金额 : <strong>{{ order.refund_money | money}}</strong>
                <!--   - 积分抵用金额 : <strong>{{ order.point_money | money}}</strong>  - 代金券支付金额 : <strong>{{ order.coupon_money | money}}</strong>  --></span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li order_li_row clearfix">
              <span class="money_row">应付款金额 : <strong
                style="color:#f56c6c">{{ order.pay_money | money}}</strong> <span  v-if="order.refund_money>0">（退货后订单金额：<strong>￥{{order.afterReturnMoney||0}}元</strong>）</span></span>

            </div>
          </div>
        </div>
      </li>
      <li class="order_view">
        <div class="order_title">操作日志</div>
        <div class="order_main order_table">
          <el-table
            :data="handle_data"
            border
            style="width: 100%">
            <el-table-column
              prop="order_status_text"
              label="订单状态"
              align="center">
            </el-table-column>
            <el-table-column
              prop="action"
              label="操作事项"
              align="center">
            </el-table-column>
            <el-table-column
              prop="user_name"
              align="center"
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="created_at"
              align="center"
              label="操作时间">
              <template slot-scope="scope">
                {{ scope.row.created_at}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </li>
    </ul>
    <OrderAddress :orderId="orderId" :addDilogShow.sync="addDilogShow" @refresh="_getOrderData" ref='orderAddress'
                  :order="order"/>
    <OrderShip :orderId="orderId" :shipDialogVisible.sync="shipDialogVisible" @refresh="refresh" ref='orderShip'/>
    <OrderChange :changeDialogVisible.sync="changeDialogVisible" @closeChangeDilog="closeChangeDilog" @refresh="refresh"
                 ref='orderChange'/>
    <div style="width:100%;height:100%;text-align:center;display: none;">
      <div class="order_view" id="print_order">
        <div class="header">优鲜供应链销售订单</div>
        <div class="order_main no_border_main" style="width: 80%;display: inline-block;">
          <div class="order_ul clearfix">
            <div class="order_li">
              <span>订单编号：</span>
              <span>{{order.order_no}}</span>
            </div>
            <div class="order_li">
              <span>下单时间：</span>
              <span>{{order.created_at }}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li" style="width: 33.3%">
              <span><strong>收货人：</strong></span>
              <span>{{order.receiver_name}}</span>
            </div>
            <div class="order_li" style="width: 33.3%">
              <span><strong>收货人电话：</strong></span>
              <span>{{order.receiver_mobile}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li order_li_row" style="width: 100%;">
              <span><strong>收货地址：</strong></span>
              <span>{{order.province_name}}{{order.city_name}}{{order.district_name}}{{order.receiver_address}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li_row order_li" style="width: 100%;">
              <span><strong>买家留言：</strong></span>
              <span>{{order.buyer_message}}</span>
            </div>
          </div>
          <div class="order_ul clearfix">
            <div class="order_li" style="width: 33.3%">
              <span><strong>用户名称：</strong></span>
              <span>{{order.stroe_name}}</span>
            </div>
            <div class="order_li" style="width: 33.3%">
              <span><strong>配送方式：</strong></span>
              <span>{{order.shipping_type_info}}</span>
            </div>
            <div class="order_li" style="width: 33.3%">
              <span><strong>打印次数：</strong></span>
              <span>第{{order.print_num + 1}}次打印</span>
            </div>
          </div>
        </div>
        <div class="qrcode_img">
          <img src="../../images/yxapp.jpg" style="width:113px;height:101px">
          <p style="font-size:12px"><strong>下载优鲜供应链APP</strong></p>
          <p style="font-size:12px"><strong>享更多优惠</strong></p>
        </div>
        <div>
          <div class="table_div1 clearfix">
            <span style="width:35%"><strong>商品名称</strong></span>
            <span style="width:15%"><strong>数量</strong></span>
            <!--<span style="width:14%"><strong>优惠价</strong></span>-->
            <!--<span style="width:15%"><strong>优惠类型</strong></span>-->
            <span style="width:17%"><strong>计价单位</strong></span>
            <span style="width:15%"><strong>原售价</strong></span>
            <span style="border-right:1px solid #000;width:18%"><strong>总价</strong></span>
          </div>
          <div :key="item.order_goods_id" v-for="item in goods_data" class="clearfix">
            <div class="table_div">
              <span style="width:35%">{{item.goods_name}}</span>
              <span style="width:15%">{{item.num}}</span>
              <!--<span style="width:14%">{{// item.adjust_money}}</span>-->
              <!--<span style="width:13%">{{// item.price}}</span>-->
              <span style="width:17%">{{item.sku_name}}</span>
              <span style="width:15%">{{item.price}}</span>
              <span style="border-right:1px solid #000;width:18%">{{item.goods_money}}</span>
            </div>
          </div>
          <div>
            <div class="table_div1 clearfix" style="border-right: 1px solid black;">
              <span style="width:35%">优惠前金额: {{ order.goods_money | money }}</span>
              <span style="width:15%">优惠金额: {{ order.promotion_money | money }}</span>
              <span style="width:17%">实际金额: {{ order.pay_money | money }}</span>
              <span style="width:33%"><strong>应付金额: {{ order.pay_money | money }}</strong></span>
            </div>
            <div class="table_div1 clearfix" style="border-bottom: 1px solid black;border-right: 1px solid black;">
              <span style="width:67%">物流运费: {{ order.shipping_money | money }}</span>
              <span style="width:33%;border-top: none;">支付方式: {{order.payment_type_info}}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <div style="border-bottom: 1px solid #000;padding: 3px 0" class="clearfix">
            <span>商家：{{order.shop_name}}</span>
            <span>商家电话:{{order.company_phone}}</span>
            <span>商家地址:{{order.bussiness_address?order.bussiness_address.province_id_info+'-'+order.bussiness_address.city_id_info+'-'+order.bussiness_address.district_id_info+'-'+order.bussiness_address.address:''}}</span>
          </div>
          <div style="border-bottom: 1px solid #000;padding: 3px 0" class="clearfix">
            <span>运营方：优鲜供应链</span>
            <span>中国冷冻食材电商服务开拓者</span>
            <span>投诉电话 : 400-017-0006</span>
          </div>
        </div>
      </div>
    </div>

    <!--<el-dialog title="退货单详情" :visible.sync="dialogVisibles" width="85%" v-if="dialogVisibles">
      <StorageInfo :sreId="sre_id"></StorageInfo>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibles = false">确 定</el-button>
      </span>
    </el-dialog>-->
    <el-dialog title="商品列表" size="small" width='800px' :visible.sync="dialogTableVisible">
      <el-dialog
        width="50%"
        title="选择规格"
        :visible.sync="inner_sku_dialog"
        append-to-body>
        <el-table :data="sku_list_now" @row-dblclick="innerTableClick">
          <el-table-column label="单位" align="center" property="sku_name"></el-table-column>
          <el-table-column label="库存" align="center" property="stock"></el-table-column>
        </el-table>
      </el-dialog>
      <div style="text-align: right">
        <el-input v-model="goods_name" size="small" placeholder="请输入商品名称" style="width:200px;"></el-input>
        <el-button size="small" type="primary" @click="goodsSearch">搜索</el-button>
      </div>
      <el-table :data="gridData">
        <el-table-column property="date" label="商品" width="300" align="center">
          <template slot-scope="scope">
            <div>
              <div style="height:80px; width:80px;float:left;">
                <img style='height:100%;width:100%;' :src="scope.row.pic_cover_small" alt="">
              </div>
              <div style="float:left; margin-left: 10px">
                <p style="margin:10px 0"><span>{{scope.row.goods_name}}</span></p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="name" label="单位" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="innerShow(scope.row.goods_id)">{{ storeGoodsMap[scope.row.goods_id]
              ? (storeGoodsMap[scope.row.goods_id].sku_name||'选择单位') : '选择单位' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center">
          <template slot-scope="scope">
            {{ storeGoodsMap[scope.row.goods_id]?storeGoodsMap[scope.row.goods_id].stock||'':'' }}
          </template>
        </el-table-column>
        <el-table-column property="address" label="购买数量" align="center">
          <template slot-scope="scope">
            <el-input-number  v-model="storeGoodsMap[scope.row.goods_id].num"
                              controls-position="right"
                              :min="0"
                              :max="parseInt(storeGoodsMap[scope.row.goods_id].stock)>0?parseInt(storeGoodsMap[scope.row.goods_id].stock):0"
                              size="small"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination
          class="text-align"
          background
          layout="prev, pager, next"
          :page-size="pre_page"
          :current-page="page"
          @current-change="handleCurrentChange"
          :total="total_count">
        </el-pagination>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoods" :loading="goods_loading">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑商品" size="small" width='800px' :visible.sync="edit_dialog">

      <el-table :data="edit_goods_data">
        <el-table-column property="date" label="商品" width="300" align="center">
          <template slot-scope="scope">
            <div>
              <div style="height:80px; width:80px;float:left;">
                <img style='height:100%;width:100%;' :src="scope.row.pic_cover_micro" alt="">
              </div>
              <div style="float:left; margin-left: 10px">
                <p style="margin:10px 0"><span>{{scope.row.goods_name}}</span></p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="name" label="单位" align="center">
          <template slot-scope="scope">
           {{scope.row.sku_name}}
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center">
          <template slot-scope="scope">
            {{ scope.row.stock}}
          </template>
        </el-table-column>
        <el-table-column property="address" label="购买数量" align="center">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.num" controls-position="right" :min="0"
                             :max="scope.row.numMax"
                             size="small"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit_dialog = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsSubmit" :loading="edit_loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import OrderAddress from '@/components/order/OrderAddress'
import OrderShip from '@/components/order/OrderShip'
import OrderChange from '@/components/order/OrderChange.vue'
import PrintJs from 'print-js'
import 'print-js/dist/print.min.css'
import StorageInfo from '@/page/stock/storageInfo.vue'
import lodash from 'lodash'

export default {
  props: {
    comId: '',
    isDialog: false // 是否为弹窗
  },
  data () {
    return {
      page: 1,
      pre_page: 5,
      total_count: 1,
      goods_name: '',
      loading: false,
      edit_loading: false,
      edit_dialog: false,
      goods_loading: false,
      order: {},
      orderId: '',
      gridData: [],
      goods_data: [],
      handle_data: [],
      active: 0,
      pickup_id: '',
      dialogVisible: false,
      shipDialogVisible: false,
      dialogTableVisible: false,
      changeDialogVisible: false,
      text: '',
      formLabelWidth: '150px',
      addDilogShow: false,
      tag: false,
      dialogVisibles: false,
      purchase_quantity: 0,
      storeGoodsMap: {},
      sku_list_now: [],
      list_tag: '',
      edit_goods_data: [],
      inner_sku_dialog: false
      // sre_id: ''
    }
  },
  components: {
    OrderAddress,
    OrderShip,
    OrderChange,
    StorageInfo
  },
  created () {
    this.orderId = this.$route.query.orderId || this.comId
    this._getOrderData()
    this.getGoodsList()
  },
  computed: {
    // 退货金额
    returnMoney () {
      return this.goods_data.reduce((container, item) => {
        const {refund_real_money = 0} = item
        return container += parseFloat(refund_real_money)
      }, 0)
    },
    receiverInfo () {
      return (
        this.order.province_name +
          this.order.city_name +
          this.order.district_name +
          this.order.receiver_address +
          ' ' +
          this.order.receiver_name +
          ' ' +
          this.order.receiver_mobile
      )
    },
    orderStatu () {
      if (this.order.order_status == 0) {
        if (this.order.pay_status == 0) {
          this.active = 1
          return '待付款'
        } else if (this.order.pay_status == 3) {
          this.active = 0
          return '交易已关闭'
        } else if (this.order.pay_status == 4) {
          this.active = 0
          return '交易已撤销'
        }
      } else if (this.order.order_status == 1) {
        if (this.order.payment_type == 1 || this.order.payment_type == 2) {
          this.active = 2
          return '买家已付款,待发货'
        } else if (this.order.payment_type == 4) {
          this.active = 2
          return '货到付款,待发货'
        }
      } else if (this.order.order_status == 2) {
        if (this.order.payment_type == 1 || this.order.payment_type == 2) {
          this.active = 3
          return '商家已发货,等待收货'
        } else if (this.order.payment_type == 4) {
          this.active = 3
          return '商家已发货,等待收货'
        }
      } else if (this.order.order_status == 3) {
        if (this.order.payment_type == 1 || this.order.payment_type == 2) {
          this.active = 5
          return '买家已收货'
        } else if (this.order.payment_type == 4) {
          if (this.order.pay_status == 0) {
            this.active = 4
            return '买家已收货,未收到货款'
          } else if (this.order.pay_status == 2) {
            this.active = 6
            return '交易已完成'
          }
        }
      } else if (this.order.order_status == 4) {
        if (this.order.payment_type == 1 || this.order.payment_type == 2) {
          this.active = 5
          return '交易已完成'
        } else if (this.order.payment_type == 4) {
          if (this.order.pay_status == 2) {
            this.active = 6
            return '交易已完成'
          }
        }
      } else if (this.order.order_status == 5) {
        this.active = 0
        return '交易已关闭'
      }
    }
  },
  filters: {
    money: function (value) {
      value = value || '0.00'
      return '¥' + value + '元'
    },
    undf: function (value) {
      return value || ''
    }
  },
  watch: {
    gridData (newVal, oldVal) {
      newVal.forEach(item => {
        if (!Object.keys(this.storeGoodsMap).includes(item.goods_id + '')) {
          let info = {
            num: 0,
            stock: '',
            sku_id: '',
            sku_name: '',
            goods_id: item.goods_id,
            price: '',
            picture: ''
          }
          this.storeGoodsMap[item.goods_id] = info
        }
      })
    }
  },
  methods: {
    // 增加商品
    async addGoods () {
      let goods_data = []
      for (let [key, value] of Object.entries(this.storeGoodsMap)) {
        if (value.sku_id && value.num) {
          goods_data.push({
            goods_id: key,
            sku_id: value.sku_id,
            num: value.num,
            price: value.price,
            goods_picture: value.picture,
            sales_price_total: lodash.multiply(value.num, value.price)
          })
        }
      }
      const obj = {
        order_no: this.order.order_no,
        order_id: this.orderId,
        buyer_id: this.order.buyer_id,
        goods_data: JSON.stringify(goods_data)
      }
      this.goods_loading = true
      const {err, data} = await this.$service.shopOrder.ordermanager.orderAddGoods(obj)
      this.goods_loading = false
      if (err) return
      // this.storeGoodsMap = {}
      for (let i in this.storeGoodsMap) {
        this.storeGoodsMap[i] = {
          num: 0,
          stock: 0,
          sku_name: ''
        }
      }
      this.dialogTableVisible = false
      await this._getOrderData()
      this.page = 1
    },
    // 移除商品
    removeGoods (id) {
      this.$confirm('确定将删除该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (parseInt(this.goods_data.length) < 2) {
          this.$message.error('商品信息中至少保留一种商品！！！')
        } else {
          const obj = {
            order_no: this.order.order_no,
            order_id: this.orderId,
            order_goods_id: id
          }
          const {err, data} = await this.$service.shopOrder.ordermanager.orderRemoveGoods(obj)
          if (err) return
          this.$message.success(data.msg)
          await this._getOrderData()
        }
      })
    },
    // 选择规格
    async innerShow (id) {
      this.inner_sku_dialog = true
      await this.getSelectedTable(id)
    },
    // 获取待选商品sku信息
    async getSelectedTable (gId) {
      this.sku_list_now = []
      const obj = {
        id: gId,
        store_id: this.order.store_id,
        member_id: this.order.buyer_id
      }
      const {err, data} = await this.$service.shopmanager.checkstand.goodsku(obj)
      if (err) return
      if (data.data.sku) {
        data.data.sku.forEach(item => {
          this.sku_list_now.push({
            sku_name: item.sku_name,
            sku_id: item.sku_id,
            stock: item.stock,
            goods_id: gId,
            price: item.price,
            picture: data.data.picture
          })
        })
      }
    },
    innerTableClick (row) {
      let temp = {...this.storeGoodsMap}
      temp[row.goods_id].sku_id = row.sku_id
      temp[row.goods_id].sku_name = row.sku_name
      temp[row.goods_id].stock = row.stock
      temp[row.goods_id].price = row.price
      temp[row.goods_id].picture = row.picture
      this.storeGoodsMap = temp
      this.inner_sku_dialog = false
    },
    // 商品分页
    handleCurrentChange (val) {
      this.page = val
      this.getGoodsList()
    },
    // 添加商品
    addGoodsChange () {
      this.dialogTableVisible = true
    },
    // 编辑商品
    editGoods (data) {
      this.edit_dialog = true
      this.edit_goods_data = [{...data,
        num: data.num * 1,
        numMax: (data.stock * 1 > data.num * 1) ? data.stock * 1 : (data.num * 1 + data.stock * 1)}]
    },
    async editGoodsSubmit () {
      this.edit_loading = true
      const {err, data} = await this.$service.shopOrder.ordermanager.orderUpdateGoods(this.edit_goods_data[0].order_goods_id, {
        order_id: this.orderId,
        num: this.edit_goods_data[0].num
      })
      this.edit_loading = false
      if (err) return
      this.edit_dialog = false
      await this._getOrderData()
      for (let i in this.storeGoodsMap) {
        this.storeGoodsMap[i] = {
          num: 0,
          stock: 0,
          sku_name: ''
        }
      }
      this.page = 1
    },
    // 商品名称搜索
    goodsSearch () {
      this.page = 1
      this.getGoodsList()
    },
    // 商品列表
    async getGoodsList () {
      const {err, data} = await this.$service.goods.goods_common_api.goodsList({
        page: this.page,
        pre_page: this.pre_page,
        state: 1,
        goods_name: this.goods_name
      })
      if (err) return
      this.gridData = data.result
      this.total_count = data.total_count
    },
    //
    closeChangeDilog () {
      this.changeDialogVisible = false
    },
    // 订单价格修改
    changeOrder (item) {
      this.$refs.orderChange.changeDataInit(item)
      this.changeDialogVisible = true
    },
    // 修改地址
    changeAddress () {
      this.$refs.orderAddress._addressInit(this.order)
      this.addDilogShow = true
    },
    // 添加备注
    addNoteDialog () {
      this.text = this.order.seller_memo
      this.dialogVisible = true
    },
    async addNote () {
      this.dialogVisible = false
      if (this.text == '') return
      const {
        err,
        data
      } = await this.$service.shopOrder.ordermanager.orderNoteUpdate({
        id: this.orderId,
        remark: this.text
      })
      if (err) return
      this.$message({
        type: 'success',
        message: data.message
      })
      this._getOrderData()
    },
    // 获取订单数据
    async _getOrderData () {
      this.loading = true
      const {
        err,
        data
      } = await this.$service.shopOrder.ordermanager.orderDetail({
        id: this.orderId
      })
      this.loading = false
      if (err) return
      data.result.afterReturnMoney = Number(data.result.afterReturnMoney).toFixed(2)
      data.result.refund_money = Number(data.result.refund_money).toFixed(2)
      this.order = data.result
      this.goods_data = data.result.goods
      this.handle_data = data.result.order_action
      this.pickup_id = data.result.pickup_id
    },

    // 确认收货
    comfirmRecipe () {
      this.$confirm('确认买家已收到货物？', '提示', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.shopOrder.ordermanager.orderConfirmRecipe({
            id: this.orderId,
            status: 1
          })
          this.$message({
            type: 'sucess',
            message: data.message
          })
          this._getOrderData()
        })
        .catch(() => {
        })
    },
    //  打印订单次数
    async printNext () {
      let id = this.orderId
      const {err, data} = await this.$service.shopOrder.ordermanager.orderPrint(id)
      if (err) return
      this._getOrderData()
    },
    // 取消订单
    cancelOrder () {
      this.$confirm('确认取消订单', '提示', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.shopOrder.ordermanager.cancelOrder({
            id: this.orderId
          })
          this.$message({
            type: 'sucess',
            message: data.message
          })
          this._getOrderData()
        })
        .catch(() => {
        })
    },
    // 确认收款
    comfirmMoney () {
      this.$confirm('确认已收到货款？', '提示', {
        comfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            err,
            data
          } = await this.$service.shopOrder.ordermanager.orderConfirmRecipe({
            id: this.orderId,
            status: 2
          })
          this.$message({
            type: 'sucess',
            message: data.message
          })
          this._getOrderData()
        })
        .catch(() => {
        })
    },
    // 打开发货窗口
    order_ship () {
      this.$refs.orderShip.getShipData(this.orderId)
    },
    // 确认发货信息后刷新
    refresh () {
      this._getOrderData()
    }
    //  获取当前点击的订单
    /* storageDetail(id) {
         this.sre_id = id
         this.dialogVisibles = true
       } */
  }
}
</script>
<style scoped>
  .addressForm .el-input {
    width: 458px;
  }

  .addressForm .el-select {
    width: 150px;
  }

  .el-dialog__body {
    padding: 0 20px 20px 20px;
  }

  .el-radio {
    display: block;
    margin: 15px 10px;
  }

  .bolder {
    font-weight: bold;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 5px 0;
  }

  .box-card {
    width: 100%;
  }

  strong {
    font-weight: bold;
  }

  .money_row {
    margin-right: 10px;
    float: right;
  }

  #print_order {
    position: relative;
    padding: 0;
  }

  #print_order .order_li {
    width: 50%;
    text-align: left;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .money_row_1 {
    float: left;
    width: 33.3%;
    box-sizing: border-box;
  }

  .money_row_2 {
    float: left;
    width: 33.3%;
    height: 25px;
    line-height: 25px;
    text-align: center;
    padding-left: 0;
    box-sizing: border-box;
  }

  .no_border_main {
    border: none !important;
    margin-top: 3px;
  }

  .no_border_main .order_ul {
    border-bottom: none;
    padding: 6px 0;
    text-align: right;
  }

  #print_order {
    height: 100%;
    padding-bottom: 3px;
    text-align: left
  }

  #print_order .footer {
    width: 100%;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
  }

  #print_order .footer span {
    float: left;
    width: 33.3%;
    text-align: center;
    box-sizing: border-box;
    padding-left: 0;
  }

  .table_div span,
  .table_div1 span {
    float: left;
    border: 1px solid #000;
    box-sizing: border-box;
    text-align: center;
    height: 25px;
    line-height: 25px;
    border-right: none;
    font-size: 12px;
    border-bottom: none;
  }

  .table_div1 span {
    border-bottom: none;
  }

  .order_money {
    width: calc(100% - 2px);
    height: 25px;
    line-height: 25px;
    text-align: center;
    border: 1px solid #000;
    font-size: 13px;
  }

  .clearfix {
    overflow: auto;
    zoom: 1;
  }

  .header {
    font-size: 18px;
    text-align: center;
    width: 100%;
    font-weight: 600;
  }

  .qrcode_img {
    position: absolute;
    right: 5px;
    top: 5px;
    text-align: center;
  }

  .print-cor {
    color: #e6a23c;
    padding: 0 5px;
  }

  .num_cor {
    color: #1c8fef;
    cursor: pointer;
    text-decoration: underline;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }
</style>
