<template>
  <div v-loading="loading">
    <!--查看营业执照-->
    <el-dialog title="营业执照" :visible.sync="yshow">
      <img :src="orbuderInfo.store_avatar" :alt="orbuderInfo.store_avatar" class="img"/>
    </el-dialog>

    <!--mini导航栏 (>^ω^<)  -->
    <div class='orbuder_warp'>
      <div class='box'>
        <a href='' @click.prevent="jump('orbuderInfo')">
          <div class='card bg-01'><span class='card-content'>订单信息</span></div>
        </a>
      </div>
      <div class='box'>
        <a href='' @click.prevent="jump('shopOrder')">
          <div class='card bg-02'><span class='card-content'>订单记录</span></div>
        </a>
      </div>
      <div class='box'>
        <a href='' @click.prevent="jump('storeContact')">
          <div class='card bg-03 hovers'><span class='card-content'>店铺联系人</span></div>
        </a>
      </div>
    </div>
    <div class="order_view">
      <div id="orbuderInfo" class="order_title" style="padding-top: 15px;">用户详情</div>
      <div class="order_main">
        <div class="order_ul clearfix">
          <div class="order_li">
            <span>店铺名称：</span>
            <span>{{orbuderInfo.store_name}}</span>
          </div>
          <div class="order_li">
            <span>负责人：</span>
            <span class="bolder">{{orbuderInfo.store_person}}</span>
          </div>
          <div class="order_li">
            <span>负责人电话：</span>
            <span class="bolder">{{orbuderInfo.phone}}</span>
          </div>
        </div>
        <div class="order_ul clearfix">
          <!--  暂时木有店铺类型这个字段啦~  -->
          <!--<div class="order_li">
            <span>店铺类型：</span>
            <span>sdfgsaf</span>
          </div>-->
          <div class="order_li">
            <span>价格体系：</span>
            <span>{{orbuderInfo.price_type_name}}</span>
          </div>
          <div class="order_li">
            <span>用户地址：</span>
            <span>{{orbuderInfo.address}}</span>
          </div>
          <div class="order_li">
            <span>详细地址：</span>
            <span>{{orbuderInfo.store_address}}</span>
          </div>
        </div>
        <div class="order_ul clearfix">
          <div class="order_li">
            <span>注册时间：</span>
            <span>{{orbuderInfo.created_at}}</span>
          </div>
          <div class="order_li">
            <span>营业执照：</span>
            <el-button type="text" @click="yshow=true">点击查看</el-button>
          </div>
        </div>
      </div>
    </div>

    <!--  店铺订单记录  -->
    <div style="background: #FFF;margin-bottom: 10px;">
      <div id="shopOrder" class="order_title order_title_small">店铺订单记录</div>
      <div class="searcher">
        <span style="float:left;line-height: 35px;">订单号：</span>
        <div class="type-class">
          <el-input size="small" v-model="order_no" placeholder="请输入订单号"/>
        </div>
        <span style="float:left;line-height: 35px;">收货人：</span>
        <div class="type-class">
          <el-input size="small" v-model="receiver_name" placeholder="请输入收货人姓名"/>
        </div>
        <span style="float:left;line-height: 35px;">订单状态：</span>
        <div class="type-class">
          <el-select v-model="order_status" placeholder="请选择订单状态" size="small">
            <el-option
              v-for="item in orderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button size="small" type="primary" @click="doSearch">搜索</el-button>
      </div>
      <el-table :data="shopOrderData" style="width: 100%">
        <!--<el-table-column type="selection"/>-->
        <el-table-column prop="order_no" label="订单号" align="center">
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" align="center">
        </el-table-column>
        <el-table-column prop="receiver_name" label="收货人" align="center">
        </el-table-column>
        <el-table-column prop="order_money" label="总金额" align="center">
        </el-table-column>
        <el-table-column prop="pay_money" label="预付金额" align="center">
        </el-table-column>
        <el-table-column prop="order_status" label="订单状态" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleClick(scope.row)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <div class="page-box">
          <el-pagination
            class="text-align"
            background
            layout="prev, pager, next"
            @current-change="changePage"
            :current-page="page"
            :page-size="pre_page"
            :total="total_count">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 店铺联系人 -->
    <div style="background: #FFF;">
      <div id="storeContact" class="order_title order_title_small">店铺联系人</div>
      <div class="searcher">
        <span style="float:left;line-height: 35px;">用户名：</span>
        <div class="type-class">
          <el-input size="small" v-model="member_name" placeholder="请输入用户名"/>
        </div>
        <span style="float:left;line-height: 35px;">手机号：</span>
        <div class="type-class">
          <el-input size="small" v-model="user_phone" placeholder="请输入手机号"/>
        </div>
        <el-button size="small" type="primary" @click="person_search">搜索</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="member_name" label="用户名" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center">
        </el-table-column>
        <el-table-column prop="work_name" label="职位" align="center">
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间" align="center">
        </el-table-column>
        <el-table-column prop="updated_at" label="修改时间" align="center">
        </el-table-column>
        <!--<el-table-column label="操作" align="center">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button size="mini">编辑-->
        <!--</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
    <!--  分页  -->
    <div class="page-box">
      <div class="page-box">
        <el-pagination
          class="text-align"
          background
          layout="prev, pager, next"
          @current-change="pageChange"
          :current-page="person_page"
          :page-size="person_pre_page"
          :total="person_total_count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: true,
        yshow: false,
        page: 1,
        person_page: 1,
        pre_page: 5,
        person_pre_page: 5,
        total_count: 1,
        person_total_count: 1,
        member_name: '',
        user_phone: '',
        receiver_name: '',
        order_no: '',
        order_status: '',
        orderStatus: [
          {
            value: '0',
            label: '待付款'
          },
          {
            value: '1',
            label: '待发货'
          },
          {
            value: '2',
            label: '待收货'
          },
          {
            value: '3',
            label: '已收货'
          },
          {
            value: '4',
            label: '已完成'
          },
          {
            value: '5',
            label: '已关闭'
          }
        ],
        orbuderInfo: [],
        shopOrderData: [], // 订单详情
        tableData: []
      }
    },
    created () {
      this.initData()
    },
    activated () {
      if (this.$route.params.id != this.id) {
        this.page = 1
        this.person_page = 1
      }
      this.initData()
    },
    methods: {
      async initData () {
        this.loading = true
        this.id = this.$route.params.id
        await Promise.all([
          this.getstore_data(),
          this.getStore_info_list(),
          this.getStore_person_list()
        ])
        this.loading = false
      },
      jump (archorName) {
        let anchorElement = document.getElementById(archorName)
        if (anchorElement) {
          anchorElement.scrollIntoView()
        }
      },
      //  获取详情
      async getstore_data () {
        const {err, data} = await this.$service.store.store_detail(this.id)
        if (err) return
        this.orbuderInfo = data.result || {}
      },
      // 获取门店列表详情
      async getStore_info_list () {
        const {err: error, data} = await this.$service.store.store_info_list(this.id, {
          page: this.page,
          pre_page: this.pre_page,
          receiver_name: this.receiver_name,
          order_status: this.order_status,
          order_no: this.order_no
        })
        if (error) return
        this.shopOrderData = data.data.map(item => {
          switch (item.order_status) {
            case 0:
              item.order_status = '待付款'
              break
            case 1:
              item.order_status = '待发货'
              break
            case 2:
              item.order_status = '待收货'
              break
            case 3:
              item.order_status = '已收货'
              break
            case 4:
              item.order_status = '已完成'
              break
            case 5:
              item.order_status = '已关闭'
              break
          }
          return item
        })
        this.total_count = data.total_count
      },
      // 分页
      changePage (val) {
        this.page = val
        this.getStore_info_list()
      },
      // 搜索
      doSearch () {
        this.page = 1
        this.getStore_info_list()
      },
      handleClick (row) {
        if (!this.$checkActionAccess(this.$ACCESS.ORDER_DETAIL)) {
          this.$message.warning('您暂时没有订单详情权限')
        } else {
          this.$router.push('/order/list/detail/' + row.order_id + '?orderId=' + row.order_id)
        }
      },

      // 门店员工列表
      async getStore_person_list () {
        const {err, data} = await this.$service.store.store_person_list({
          page: this.person_page,
          pre_page: this.person_pre_page,
          store_id: this.id,
          user_name: this.member_name,
          phone: this.user_phone
        })
        if (err) return
        this.tableData = data.data
        this.person_total_count = data.total_count
      },
      pageChange (val) {
        this.person_page = val
        this.getStore_person_list()
      },
      person_search () {
        this.person_page = 1
        this.getStore_person_list()
      }

    }
  }
</script>

<style scoped>
  .orbuder_warp {
    position: fixed;
    right: 0;
    z-index: 999;
  }

  .orbuder_style {
    color: #606266;
  }

  .search-box {
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
    margin-bottom: 10px;
  }

  .searcher {
    float: right;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
  }

  .type-class {
    float: left;
    margin-right: 10px;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  /*    ~(=^.^=)~ 我是皮新瑜~   */
  .order_view {
    color: #666;
    background: #fff;
    border-radius: 5px;
    margin-bottom: 10px;
    transition: all .2s ease-in-out;
  }

  .order_title {
    color: #1C8FEF;
    font-weight: 600;
    line-height: 25px;
    padding-left: 10px;
  }

  .order_title_small {
    float: left;
    line-height: 55px;
  }

  .order_ul {
    padding: 12px 0;
    font-size: 12px;
    line-height: 30px;
    border-bottom: 1px solid #f0f0f0;
  }

  .order_li {
    width: 33.3%;
    float: left;
  }

  .order_li span:first-child {
    padding-left: 5%;
  }

  .order_ul:last-child {
    border-bottom: 0 none;
  }

  .order_li_row {
    width: 100%;
  }
</style>
<style scoped>
  @import './store_detail.css';
</style>
