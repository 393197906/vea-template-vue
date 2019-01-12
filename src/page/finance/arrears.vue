<template>
  <div v-loading="loading">
    <div class="search-box-warp">
      <div class="search-box">
        <el-row>
          <el-col :span="24">
            <span class="el_input_text">时间:</span>
            <div class="type-class">
              <el-date-picker
                v-model="time"
                type="daterange"
                size="small"
                value-format="timestamp"
                @change="timeChange"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <span class="el_input_text">筛选条件:</span>
            <div class="type-class">
              <el-select clearable  v-model="params.search " placeholder="请选择" size="small">
                <el-option
                  v-for="item in search_term"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="24">
            <div  class="grid-content bg-purple-light">
              <span class="el_input_text">用户:</span>
              <div class="type-class">
                <el-input size="small" class="el_input_width" v-model="params.store_name"
                          :clearable="true" placeholder="请输入用户名称"/>
              </div>
              <span class="el_input_text">用户编码:</span>
              <div class="type-class">
                <el-input size="small" class="el_input_width" v-model="params.store_id"
                          :clearable="true" placeholder="请输入用户编码"/>
              </div>

              <!--<span class="el_input_text">欠款区间:</span>-->
              <!--<div class="type-class">-->
                <!--<el-col :span="11">-->
                  <!--<el-input type="number" size="small" v-model="params.start_num" placeholder="请输入开始金额"-->
                            <!--style="width: 100%;"-->
                            <!--:clearable="true"></el-input>-->
                <!--</el-col>-->
                <!--<el-col style="text-align: center" :span="2">—</el-col>-->
                <!--<el-col :span="11">-->
                  <!--<el-input type="number" size="small" v-model="params.end_num" placeholder="请输入结束金额"-->
                            <!--style="width: 100%;"-->
                            <!--:clearable="true"></el-input>-->
                <!--</el-col>-->
              <!--</div>-->
              <span class="el_input_text">手机号:</span>
              <div class="type-class">
                <el-input size="small" class="el_input_width" v-model="params.phone"
                          :clearable="true" placeholder="请输入手机号"/>
              </div>
              <!--<span class="el_input_text">是否有余额:</span>-->
              <!--<div class="type-class">-->
                <!--<el-select v-model="params.balance" size="small" placeholder="请选择">-->
                  <!--<el-option-->
                    <!--v-for="item in balance"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</div>-->
              <el-button class="el_button_left" size="small" type="primary" @click="goStore">搜索</el-button>
              <!--<el-button type="primary" size="small" plain icon="el-icon-upload2" @click="exportData">导出</el-button>-->
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="background: #fff;margin-top: 10px;">
      <el-table highlight-current-row :data="arrearData" :header-cell-style="setHeaderStyle" border style="width: 100%">
        <el-table-column prop="id" label="用户编码" align="center"></el-table-column>
        <el-table-column prop="store_name" label="用户名称" align="center"></el-table-column>
        <el-table-column prop="begin_balance" label="期初余额" align="center"></el-table-column>
        <el-table-column prop="current_money" label="本期应收" align="center"></el-table-column>
        <el-table-column prop="current_real_money" label="本期收款" align="center"></el-table-column>
        <!--<el-table-column prop="arrear" label="当前欠款" align="center"></el-table-column>-->
        <el-table-column prop="end_balance" label="期末余额" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text"  v-if="$checkActionAccess($ACCESS.FINANCIAL_YSK_CWSK)" @click="showArrearDialog(scope.row)">财务收款</el-button>
            <el-button type="text"  v-if="$checkActionAccess($ACCESS.FINANCIAL_YSK_CWLL)" @click="showFlow(scope.row)">财务流水</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="pageChange"
        :current-page="params.page_index"
        :page-size="params.page_size"
        layout="prev, pager, next"
        :total="total_count">
      </el-pagination>
    </div>
    <receipt-form v-if="centerDialogVisible" :showDialog="centerDialogVisible" :base-data.sync="tmpForm"
                  @isShow="showData"></receipt-form>
    <el-dialog title="财务流水" :visible.sync="flowVisible" width="60%">
      <el-table highlight-current-row :data="billData" style="width: 100%" :border="true" v-loading="flowLoading">
        <el-table-column prop="no" label="单据编号" align="center">
        </el-table-column>
        <el-table-column prop="store_name" label="相关单位" align="center">
        </el-table-column>
        <el-table-column prop="type" label="单据类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type=='1'">收款单</span>
            <span v-else-if="scope.row.type=='2'">付款单</span>
            <span v-else-if="scope.row.type=='3'">欠款单</span>
            <span v-else>优惠单</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="单据时间" align="center">
        </el-table-column>
        <el-table-column prop="arrear" label="欠款" align="center">
          <template slot-scope="scope">
            <span v-if="parseFloat(scope.row.diff_money)>0">{{scope.row.diff_money}}</span>
            <span v-else>0.00</span>
          </template>
        </el-table-column>
        <el-table-column prop="payment" label="付款" align="center">
          <template slot-scope="scope">
            <span v-if="parseFloat(scope.row.diff_money)<0">{{scope.row.diff_money}}</span>
            <span v-else>0.00</span>
          </template>
        </el-table-column>
        <el-table-column prop="total_money" label="累计欠款" align="center">
        </el-table-column>
        <el-table-column prop="operator_name" label="操作人" align="center">
        </el-table-column>
      </el-table>
      <div class="page-box">
        <el-pagination layout="prev, pager, next" @current-change="flowPageChange" :total="flow_count"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="flowVisible = false">关 闭</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
import receiptForm from './components/arrearReceipt.vue'

// 获取本月 最后一天
const getLastDay = () => {
  const seperator1 = '-'
  const date = new Date()
  const newMonth = date.getMonth() + 1
  // 取当前的年份
  const newYear = date.getFullYear()
  // 取当年当月中的第一天
  // new Date(newYear,newMonth,1);
  const newDate = new Date(newYear, newMonth, 1)
  // 获取当月最后一天日期
  // (new Date(newDate.getTime()-1000*60*60*24)).getDate();
  const currentdate = newYear + seperator1 + newMonth + seperator1 + (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate()
  return currentdate
}
export default {
  components: {receiptForm},
  data () {
    return {
      time: [],
      search_term: [
        {value: 10, label: '无发生额不显示'}
      ],
      flowLoading: false,
      loading: false,
      flowVisible: false,
      centerDialogVisible: false,
      total_count: 2,
      flow_page: 1,
      flow_count: 0,
      tmpStore: '',
      arrearData: [],
      tmpForm: {},
      page_index: 1,
      page_size: 10,
      params: {
        search: '',
        store_id: '',
        store_name: '',
        start_time: '',
        end_time: '',
        start_num: '',
        end_num: '',
        phone: '',
        balance: '1'
      },
      billData: [],
      balance: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '2',
          label: '否'
        },
        {
          value: '0',
          label: '全部'
        }
      ]
    }
  },
  async created () {
    // 默认显示当前时间
    const startTime = parseInt(new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-1') / 1000)
    // 默认本月最后一天
    const endTime = parseInt(new Date(getLastDay() + ' 23:59:59') / 1000)
    this.params.start_time = startTime
    this.params.end_time = endTime
    this.time = [startTime * 1000, endTime * 1000]
    this.getArrears()
  },
  // activated () {
  //   this.getArrears()
  // },
  methods: {
    // 设置表头样式
    setHeaderStyle () {
      return 'background:#f5f7fa'
    },
    // 导出
    async exportData () {
      this.valueData = this.valueData || []
      const params = {
        ...this.params
      }
      const {err, data} = await this.$service.financemanager.arrearList({...params, pre_page: 3000, export: 1})
      if (err) return
      console.log(data)
      // window.open(data.result)
      window.location.href = data.data
      /*  if (!data.result.length) {
          this.$message.warning('没有需要导出的数据')
          return
        }
        const json2excel = await import('yt-json2excel/src/index')
        json2excel.default('订单数据', data.result.map(item => {
          const {order_status: orderStatus, ...rest} = item
          return rest
        }), [{
          store_name: '门店名称',
          store_person: '负责人',
          phone: '负责人电话',
          channel_name: '渠道类型',
          store_address: '门店地址',
          price_type_name: '价格类型',
          first_time: '首次下单时间',
          last_time: '末次下单时间',
          created_at: '注册时间'
        }]) */
    },
    // 打开显示财务流水弹框
    showFlow (row) {
      this.$router.push({
        path: '/finance/customerflow',
        query: {
          store_id: row.store_id,
          store_name: row.store_name
        }
      })
    },
    async getFlowList () {
      this.flowLoading = true
      const tmpobj = {
        page: this.flow_page,
        pre_page: 8,
        store_id: this.tmpStore
      }
      const {err, data} = await this.$service.financemanager.flowList(tmpobj)
      this.flowLoading = false
      if (err) return
      this.billData = data.data
      this.flow_count = data.total_count
    },
    // 打开添加收款单
    showArrearDialog (row) {
      this.tmpForm = {...row, real_money: Number(row.amount_in_arrear)}
      this.centerDialogVisible = true
    },
    showData (tmp) {
      this.centerDialogVisible = tmp
      if (!tmp) {
        this.getArrears(this.page_index)
      }
    },
    // 获取欠款列表
    async getArrears (page) {
      this.loading = true
      let obj = {
        page_index: page,
        page_size: this.page_size,
        ...this.params
      }
      const {err, data} = await this.$service.financemanager.arrearList(obj)
      if (err) return
      this.loading = false
      this.arrearData = data.data
      this.total_count = data.total_count || 0
      return false
    },
    //  搜索
    goStore () {
      this.page_index = 1
      this.getArrears(this.page_index)
    },
    //  分页
    pageChange (val) {
      this.page_index = val
      this.getArrears(val)
    },
    flowPageChange (val) {
      this.flow_page = val
      this.getFlowList()
    },
    handleSizeChange (val) {
      this.params.page_size = val
      // this.getArrears()
    },
    timeChange (val) {
      this.params.start_time = parseInt(val[0] / 1000)
      this.params.end_time = parseInt(val[1] / 1000)
    }
  }
}
</script>

<style scoped>
  .search-box-warp {
    margin-bottom: 10px;
  }

  .search-box {
    /*height: 54px;*/
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  @media screen and (min-width: 1400px) {
    .type-class {
      float: left;
    }

    .el_input_text {
      float: left;
      margin: 0 10px;
    }

    .el_input_width {
      width: 150px;
    }

    .el_button_left {
      margin-left: 10px;
    }

    .selected_date {
      width: 230px;
    }
  }

  @media screen and (min-width: 1750px) {
    .type-class {
      float: left;
    }

    .el_input_text {
      float: left;
      margin: 0 10px;
    }

    .el_input_width {
      width: 220px;
    }

    .el_button_left {
      margin-left: 10px;
    }

    .selected_date {
      width: 300px;
    }
  }

  @media screen and (max-width: 1400px) {
    .type-class {
      float: left;
    }

    .el_input_text {
      float: left;
      margin: 0 5px;
    }

    .el_input_width {
      width: 130px;
    }

    .el_button_left {
      margin-left: 10px;
    }

    .selected_date {
      width: 200px;
    }
  }

</style>
