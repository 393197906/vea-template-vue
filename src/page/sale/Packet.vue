<template>
  <div v-loading="loading">
    <el-tabs type="border-card" v-model="activePane" @tab-click="clickTab">
      <el-tab-pane label="优惠券列表" name="couponlist">
        <div class="explanation_warp">
          <el-collapse accordion v-model="accordion">
            <div class="explanations">
              <el-collapse-item name="1">
                <template slot="title">
                  <div class="title explain-checkZoom">
                    <i class="fa fa-bullhorn"></i>
                    <h4>温馨提示</h4>
                  </div>
                </template>
                <ul class="explain-panel">
                  <li>
                    <span>店铺优惠券：由店铺发放的优惠券，买家领取后仅能在该店铺使用</span>
                  </li>
                </ul>
                <ul class="explain-panel">
                  <li>
                    <span>手动设置优惠券失效后，买家将不能继续领取优惠券，但是已经领取的优惠券仍然可以使用</span>
                  </li>
                </ul>
                <ul class="explain-panel">
                  <li>
                    <span>优惠券过期后自动失效</span>
                  </li>
                </ul>
              </el-collapse-item>
            </div>
          </el-collapse>
        </div>

        <div class="toptime" style="margin-top:15px;">
          <div class="ipt"><span>关键字： </span>
            <div class="el-input el-input--small">
              <input type="text" v-model="config.coupon_name" autocomplete="off" placeholder="请输入关键字"
                     class="el-input__inner"></div>
          </div>
          <div class="block">
            <span>有效期: </span>
            <el-date-picker @change="sTime" size="small" v-model="term" type="daterange" value-format="timestamp"
                            unlink-panels="true"
                            start-placeholder="请选择开始日期"
                            end-placeholder="请选择结束日期">
            </el-date-picker>
          </div>
          <div class="ipt"><span>状态： </span>
            <div class="el-input el-input--small">
              <el-select v-model="config.status" placeholder="请选择">
                <el-option :key="item.val" v-for="item in status" :label="item.name" :value="item.val"></el-option>
              </el-select>
            </div>
          </div>
          <div class="coding">
            <span data-v-278b3304="">优惠券类型: </span>
            <div class="el-input el-input--small el-input--suffix" style="width: 160px">
              <el-select v-model="config.coupon_type" placeholder="请选择类型">
                <el-option v-bind:key="item.val" v-for="item in coupon_status" :label="item.name"
                           :value="item.val"></el-option>
              </el-select>
            </div>
          </div>
          <button type="button" @click="searchPacket" class="el-button el-button--primary el-button--small">
            <i class="el-icon-search"></i>
            <span>搜索</span>
          </button>
          <div style="float: right;margin-right: 10px">
            <el-button size="small" type="text" @click="clear">一键清空失效</el-button>
          </div>
        </div>
        <!-- 列表 -->
        <div class="issuedData">
          <el-table :data="tableData" style="width: 100%;border: 1px solid #e5e5e5;border-bottom: 0;">
            <el-table-column prop="coupon_id" label="编号" align="center"></el-table-column>
            <el-table-column prop="coupon_name" label="活动名称" align="center"></el-table-column>
            <el-table-column prop="coupon_money" label="面值" align="center"></el-table-column>
            <el-table-column prop="coupon_info" label="优惠券类型" align="center"></el-table-column>
            <el-table-column prop="send_num" label="发放数量" align="center"></el-table-column>
            <el-table-column prop="coupon_did" label="已领取数量" align="center"></el-table-column>
            <el-table-column prop="coupon_stop" label="已使用数量" align="center"></el-table-column>
            <el-table-column prop="flage_info" label="状态" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="300">
              <template slot-scope="scope">
                <el-button size="mini" v-if="scope.row.coupon_type==3 && scope.row.distribute_status"
                           @click="distribute(scope.row)">派发
                </el-button>
                <el-button size="mini" @click="handleClick(scope.row)">查看</el-button>
                <el-button size="mini" @click="sendClick(scope.row)">已发放</el-button>
                <el-button v-if="scope.row.flage_info=='有效' || (scope.row.flage_info=='未开始' && scope.row.coupon_did>0)"
                           size="mini" type="danger"
                           @click="handleDelete(scope.$index, scope.row)">作废
                </el-button>
                <el-button
                  v-if="(scope.row.flage_info=='未开始' && scope.row.coupon_did==0) || (scope.row.flage_info=='作废' && ( parseInt(Date.now()/1000)<parseInt(scope.row.send_start_time) || parseInt(Date.now()/1000)>parseInt(scope.row.send_end_time)))"
                  size="mini" type="danger"
                  @click="del(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination background @current-change="handleCurrentChange" :page-size="config.pre_page"
                       layout="prev, pager, next" :total="pCount"></el-pagination>
      </el-tab-pane>
      <el-tab-pane  v-if="$checkActionAccess($ACCESS.COUPON_ADD)" label="添加优惠券" name="couponadd">
        <el-row :gutter="10">
          <!--到店送优惠券-->
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div class="m-b-15">
                <el-row style="height:100%">
                  <el-col :span="9" class="trcon">
                    <div class="icon">
                      <span class="activity-logo "><i id="activity-logo-1" class="fa fa-bank"></i></span>
                      <a @click="pubUrl('add',1)" class="btn btn-primary public">立即发布</a>
                    </div>
                  </el-col>
                  <el-col :span="15">
                    <div class="desc">
                      <h3 class="f20">到店送优惠券</h3>
                      <p class="m-t-5">门店下用户主动领取，领取的场景是：手机或PC端的商品详情页、购物车</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <!--关注送优惠券-->
          <el-col :span="12" :xs="12">
            <div class="grid-content bg-purple">
              <div class=" m-b-15">
                <el-row style="height:100%">
                  <el-col :span="9" class="trcon">
                    <div class="icon">
                  <span class="activity-logo ">
                    <i id="activity-logo-2" class="fa fa-star"></i>
                  </span>
                      <a @click="pubUrl('add',2)" class="btn btn-primary public">立即发布</a>
                    </div>
                  </el-col>
                  <el-col :span="15">
                    <div class="desc">
                      <h3 class="f20">关注送优惠券</h3>
                      <p class="m-t-5">系统自动派发，系统提醒门店创始人获得优惠券：会员仅当首次收藏店铺时有效 收藏优惠券仅能创建一次，不可删除，您可以选择作废或者过期后重新创建该类型优惠券</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
        <div style="width: 100%;height: 20px;"></div>
        <el-row :gutter="10">
          <!--会员送优惠券-->
          <el-col :span="12" :xs="12">
            <div class="grid-content bg-purple">
              <div class=" m-b-15">
                <el-row style="height:100%">
                  <el-col :span="9" class="trcon">
                    <div class="icon">
                  <span class="activity-logo ">
                    <i id="activity-logo-3" class="fa fa-user"></i>
                  </span>
                      <a @click="pubUrl('add',3)" class="btn btn-primary public">立即发布</a>
                    </div>
                  </el-col>
                  <el-col :span="15">
                    <div class="desc">
                      <h3 class="f20">会员送优惠券</h3>
                      <p class="m-t-5">卖家主动派发，系统提醒门店创始人获得优惠券</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <!--推荐注册送优惠券-->
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <div class="m-b-15">
                <el-row style="height:100%">
                  <el-col :span="9" class="trcon">
                    <div class="icon">
                      <span class="activity-logo "><i id="activity-logo-4" class="fa fa-share"></i></span>
                      <a @click="pubUrl('add',5)" class="btn btn-primary public">立即发布</a>
                    </div>
                  </el-col>
                  <el-col :span="15">
                    <div class="desc">
                      <h3 class="f20">推荐人送优惠券</h3>
                      <p class="m-t-5">推荐人送优惠券</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
        <div style="width: 100%;height: 20px;"></div>
        <el-row :gutter="10">
          <!--会员送优惠券-->
          <el-col :span="12" :xs="12">
            <div class="grid-content bg-purple">
              <div class=" m-b-15">
                <el-row style="height:100%">
                  <el-col :span="9" class="trcon">
                    <div class="icon">
                  <span class="activity-logo ">
                    <i id="activity-logo-5" class="fa fa-user"></i>
                  </span>
                      <a @click="pubUrl('add',6)" class="btn btn-primary public">立即发布</a>
                    </div>
                  </el-col>
                  <el-col :span="15">
                    <div class="desc">
                      <h3 class="f20">推荐注册门店送优惠券</h3>
                      <p class="m-t-5">推荐注册门店送优惠券</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane  v-if="$checkActionAccess($ACCESS.COUPON_STORE_ADD)" label="已发放门店优惠券列表" name="couponsend">
        <div class="common-title">
          <div class="ftitle">
            <h3>已发放优惠券列表</h3>
            <h5>
              (&nbsp;共
              <span data-total-record="true">{{fsCount}}</span>
              条记录&nbsp;)
            </h5>
          </div>
        </div>
        <div class="issuedData">
          <el-table :data="issuedData" style="width: 100%;border:1px solid #e5e5e5;">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="coupon_code" label="优惠券序号" align="center"></el-table-column>
            <el-table-column prop="coupon_money" label="优惠券金额" align="center"></el-table-column>
            <el-table-column prop="coupon_info" label="优惠券类型" align="center"></el-table-column>
            <el-table-column prop="status_info" label="使用状态" align="center"></el-table-column>
            <el-table-column prop="store_name" label="门店" align="center"></el-table-column>
            <el-table-column prop="receive_time" label="领取时间" align="center"></el-table-column>
            <el-table-column prop="utility_time" label="使用时间" align="center"></el-table-column>
          </el-table>
        </div>
        <el-pagination background @current-change="handleChange" layout="prev, pager, next"
                       :total="fsCount"></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activePane: 'couponlist',
      accordion: '1',
      isShow: true,
      term: '',
      loading: false,
      activeNames: ['1'],
      coupon_status: [
        {
          val: '',
          name: '全部'
        },
        {
          val: '1',
          name: '到店领优惠劵'
        },
        {
          val: '2',
          name: '关注送优惠劵'
        },
        {
          val: '3',
          name: '会员送优惠劵'
        },
        {
          val: '5',
          name: '推荐人送优惠劵'
        },
        {
          val: '6',
          name: '推荐注册门店送优惠券'
        }

      ],
      status: [
        {
          val: '',
          name: '全部'
        },
        {
          val: '1',
          name: '正常'
        },
        {
          val: '2',
          name: '作废'
        }
      ],
      tableData: [],
      issuedData: [],
      pCount: 0, // 优惠劵总记录数
      fsCount: 0,
      config: {
        page: 1,
        pre_page: 10,
        status: '',
        coupon_name: '',
        coupon_type: '',
        send_start_time: '',
        send_end_time: ''
      },
      spage: 1,
      spre_page: 10,
      active_couponId: ''
    }
  },
  created () {
    this._packetList()
  },
  watch: {
    activePane (val) {
      if (val == 'couponsend') {
        this.getSendData()
      } else {
        this.active_couponId = ''
      }
    }
  },
  methods: {
    // 一键清空
    async clear () {
      this.loading = true
      const {err, data} = await this.$service.shopmanager.packet.clear({})
      this.loading = false
      if (err) return
      this._packetList()
    },
    showToggle () {
      this.isShow = !this.isShow
    },
    // 查看
    handleClick (row) {
      this.$router.push({path: '/sale/packet/saveupdate', query: {pId: row.coupon_id, key: 'check'}})
    },
    // 查看已发放
    sendClick (row) {
      this.active_couponId = row.coupon_id
      this.activePane = 'couponsend'
    },
    // 点击tab
    clickTab () {
      if (this.activePane == 'couponsend') {
        this.sendConfig = {}
      }
    },
    // 查看已发放到用户的优惠劵
    async getSendData () {
      this.loading = true
      let opts = {
        page: this.spage,
        pre_page: this.spre_page,
        coupons_id: this.active_couponId
      }
      const {err, data} = await this.$service.shopmanager.packet.send(opts)
      this.loading = false
      if (err) return
      this.issuedData = data.result
      this.fsCount = data.total_count
    },
    // 作废
    handleDelete (index, row) {
      this.$confirm('作废后将无法恢复，您确定要作废选中的优惠劵吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {err, data} = await this.$service.shopmanager.packet.cancle({id: row.coupon_id, data: {data_flage: 2}})
        if (err) return
        this.$message({
          type: 'success',
          message: '操作成功！'
        })
        this.tableData[index].flage_info = '作废'
      }).catch(() => {
        console.log('操作失败！')
      })
    },
    // 删除优惠劵
    del (index, row) {
      this.$confirm('删除后将无法恢复，您确定要删除选中的优惠劵吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {err, data} = await this.$service.shopmanager.packet.delete(row.coupon_id)
        if (err) return
        this.$message({
          type: 'success',
          message: '操作成功！'
        })
        this._packetList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '操作失败！'
        })
      })
    },
    // 派发
    async distribute (row) {
      this.loading = true
      const {err, data} = await this.$service.shopmanager.packet.distribute({id: row.coupon_id})
      this.loading = false
      if (err) return
      this.$message.success(data.message)
      this._packetList()
    },
    // 点击优惠劵列表查询按钮
    searchPacket () {
      this._packetList()
    },
    pubUrl (key, type) {
      this.$router.push({path: '/sale/packet/saveupdate', query: {type: type, key: key}})
    },
    sTime (val) {
      this.config.send_start_time = val ? parseInt(val[0]) / 1000 : ''
      this.config.send_end_time = val ? parseInt(val[1]) / 1000 : ''
    },
    // 点击优惠劵分页页数
    handleCurrentChange (val) {
      this.config.page = val
      this._packetList()
    },
    handleChange (val) {
      this.spage = val
      this.getSendData()
    },
    // 请求列表
    async _packetList () {
      this.loading = true
      const {err, data} = await this.$service.shopmanager.packet.list(this.config)
      this.loading = false
      if (err) return
      this.tableData = data.result
      this.pCount = data.total_count
    }
  }
}
</script>

<style scoped>

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  .explanation_warp {
    color: #BA8941;
    background-color: #ffffdc;
    border: 0;
    border-left: 4px solid #EDD28A;
    display: block;
    padding: 6px 9px;
    position: relative;
    overflow: hidden;
    border-radius: 0px;

  }

  .explain-checkZoom {
    background-color: rgb(255, 255, 220);
    height: 100%;
  }

  .explanation_warp .title {
    white-space: nowrap;
    position: relative;
    cursor: pointer;
    height: auto;
    line-height: 49px;
  }

  .explanation_warp .title i {
    color: #ba8959;
    font-size: 16px;
    vertical-align: middle;
    margin-right: 6px;
  }

  .explanation_warp .title h4 {
    color: #ba8959;
    font-size: 15px;
    font-weight: bold;
    line-height: 20px;
    height: 20px;
    display: inline-block;
  }

  .style-seller .explanation_warp ul {
    padding-left: 10px;
  }

  .explanation_warp ul {
    margin-left: 10px;
    padding-left: 20px;
    transition: opacity .5s;

  }

  .explanation_warp li {
    line-height: 16px;
    padding-left: 10px;
    margin-bottom: 4px;
    list-style-position: outside;
  }

  .explanation_warp li {
    color: #ba8959;
    line-height: 20px;
    padding-left: 10px;
    margin-bottom: 2px;
    list-style-type: disc;
    list-style-position: outside;
    font-size: 8px;
  }

  .explanation_warp li span {
    color: #BA8941;
    font-size: 14px;
  }

  .el-pagination {
    float: right !important;
    margin-top: 10px;
  }

  .common-title {
    color: #333;
    white-space: nowrap;
    display: block;
    position: relative;
    z-index: 4;
    height: 30px;
    margin-top: 15px;
  }

  .ftitle {
    font-size: 0;
    height: 24px;
    float: left;
  }

  .ftitle h3 {
    font-size: 16px;
    color: #333;
    margin-right: 6px;
    float: left;
  }

  .ftitle h5 {
    font-size: 12px;
    font-weight: normal;
    line-height: 24px;
    color: #999;
    vertical-align: bottom;
    letter-spacing: normal;
    display: inline-block;
  }

  .toptime {
    height: 66px;
    line-height: 66px;
    padding-left: 10px;
    margin-bottom: 10px;
    border: 1px solid #e5e5e5;
    background: #f9fafa;
  }

  .block {
    float: left;
  }

  .simple-form-field {
    float: left;
  }

  .search-term .simple-form-field {
    margin: 4px 8px 4px 0px;
    display: inline-block;
    vertical-align: middle;
  }

  a {
    color: #666;
    text-decoration: none;
    outline: none;
  }

  .ft-bar {
    font-style: normal;
  }

  .ipt {
    float: left;
    margin-left: 10px;
    margin-right: 10px;
  }

  .el-input--small {
    width: 150px;
    margin-left: 8px;
  }

  .coding .el-input {
    width: 150px;
    margin-left: 8px;
  }

  .coding {
    float: left;
    margin-right: 10px;
  }

  .public {
    cursor: pointer;
  }

  /* 添加优惠券 */

  @media (min-width: 1200px) {
    .m-b-15 {
      width: 49%;
    }
  }

  .m-b-15 {
    float: left;
    border: solid 1px #ddd;
    height: 200px;
    width: 100%;
    background-color: #F9F9F9;
    position: relative;
    display: inline-block;
  }

  .m-b-15:hover {
    border: 1px solid #418fe2;
  }

  .icon {
    padding: 44px;
    text-align: center;
    /*background: #fff;*/
  }

  .trcon {
    height: 100%;
    background: #fff;
  }

  .col-sm-4 {
    width: 30%;
    float: left;
  }

  @media (min-width: 1330px) {
    .col-sm-4 {
      width: 20%;
    }
  }

  .activity-logo {
    width: 60px;
    height: 60px;
    line-height: 60px;
    display: inline-block;
    text-align: center;
    border-radius: 4px;
    color: #FFF;
  }

  #activity-logo-1 {
    background-position: -15px -220px;
  }

  #activity-logo-2 {
    background-position: -105px -215px;
  }

  #activity-logo-3 {
    background-position: -105px -292px;
  }

  #activity-logo-4 {
    background-position: -188px -218px;
  }

  .icon span.activity-logo i {
    font-size: 26px;
    margin: 0px;
    display: block;
    background: url("../../images/icon_small.png") -15px -220px;
    width: 60px;
    height: 60px;
    text-indent: -9999px;
  }

  .icon a {
    display: block;
    margin: auto;
    margin-top: 17px;
    text-align: center;
  }

  .btn {
    font-size: 12px;
    padding: 8px 16px;
    line-height: 14px;
    border-radius: 3px;
    vertical-align: middle;
  }

  .btn-primary {
    background: #418fe2;
    border-color: #418fe2;
    color: #fff;
  }

  .col-sm-8 {
    width: 55%;
    float: left;
  }

  @media (min-width: 1330px) {
    .col-sm-8 {
      width: 58%;
    }
  }

  .desc {
    margin-top: 20px;
    margin-left: 20px;
  }

  .f20 {
    color: #6a6666;
    line-height: 35px;
    font-size: 20px !important;
  }

  .desc p {
    line-height: 20px;
    color: #999;
  }

  .m-t-5 {
    margin-top: 5px !important;
  }

  .issuedData {
  }

</style>
<style>
  .issuedData .el-table th {
    background: #f9fafa;
  }

  .explanations .el-collapse-item__wrap {
    background: #ffffdc;
    border: 0;
  }

  .explanations .el-collapse-item__header {
    background: #ffffdc;
    border: 0;
    line-height: 20px;
  }

  .explanation_warp .el-collapse {
    border: 0;
  }
</style>
