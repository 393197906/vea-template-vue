<template>
  <div v-loading="loading">
    <div class="search-box-warp">
      <div class="search-box">
        <el-row>
          <el-col :span="24">
            <div style="float:right;" class="grid-content bg-purple-light">
              <span class="el_input_text">单据类型:</span>
              <div class="type-class el_input_width">
                <el-select size="small" v-model="params.type" placeholder="请选择" :clearable="true">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <span class="el_input_text">单据日期:</span>
              <div class="type-class">
                <el-date-picker @change="sTime"size="small" v-model="valueData" type="daterange"
                                value-format="timestamp"
                                unlink-panels="true"
                                range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </div>
              <el-button class="el_button_left" size="small" type="primary" @click="goStore">搜索</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="background: #fff;margin-top: 10px;">
      <el-table highlight-current-row border :data="billData" style="width: 100%" :header-cell-style="setHeaderStyle">
        <el-table-column prop="supplier_name" label="供应商" align="center"/>
        <el-table-column prop="no" label="单据编号" align="center">
        </el-table-column>
        <el-table-column prop="order_no" label="流水编号" align="center">
          <template slot-scope="scope">
            {{scope.row.operation_type ==1?scope.row.sheet_code:scope.row.operation_type ==2?scope.row.sheet_retreat_code:'--'}}
          </template>
        </el-table-column>
        <el-table-column prop="type_name" label="单据类型"  width="80" align="center"/>
        <el-table-column prop="created_at" label="单据时间" width="180" align="center">
        </el-table-column>
        <el-table-column prop="real_money" label="付款" align="center">
          <template slot-scope="scope">
            {{Math.floor(scope.row.real_money * 10000) / 10000}}
          </template>
        </el-table-column>
        <el-table-column  label="操作前金额" align="center">
          <template slot-scope="scope">
            {{Math.floor(scope.row.before_amount * 10000) / 10000}}
          </template>
        </el-table-column>
        <el-table-column prop="after_amount" label="操作后金额" align="center">
          <template slot-scope="scope">
            {{Math.floor(scope.row.after_amount * 10000) / 10000}}
          </template>
        </el-table-column>
        <el-table-column prop="operator_name" label="操作人" width="220" align="center">
        </el-table-column>
      </el-table>
    </div>

    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="pageChange"
        :current-page="params.page"
        :page-size="params.pre_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_count">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      loading: false,
      total_count: 2,
      billData: [], // 列表数据
      valueData: '', // 搜索 开始日期与结束日期
      order_id: '',
      params: {
        supplier_id: '', // 供应商id
        shop_id: '', // shop_id
        page: 1,
        pre_page: 10,
        type: '', // 订单状态
        start_time: 0, // 开始时间戳
        end_time: parseInt(Date.now() / 1000)// 结束时间戳
      },
      typeOptions: [
        {value: '1', label: '应付单'},
        {value: '2', label: '付款单'}
      ]
    }
  },
  async created () {
    this.params.supplier_id = this.$route.params.id || ''
    this.params.shop_id = JSON.parse(sessionStorage.getItem('user_info')).shop_info.id || ''
    this.getFlow()
  },
  activated () {
    this.getFlow()
  },
  methods: {
    // 修改表头
    changeLabel (h, {column, $index}) {
      return (
        <el-popover placement = 'top-start' trigger = 'hover' content = '操作待收款订单才会生成订单号' >
          < span slot = 'reference' > 订单号 <i class= 'el-icon-question'> </i></span >
        </el-popover>
      )
    },
    // 设置表头样式
    setHeaderStyle () {
      return 'background:#f5f7fa'
    },
    sTime (val) {
      this.params.start_time = val ? parseInt(val[0]) / 1000 : ''
      this.params.end_time = val ? ((parseInt(val[1]) / 1000) + 86400) : ''
    },
    // 获取流水列表数据
    async getFlow () {
      this.loading = true
      const {err, data} = await this.$service.financemanager.purchaseEvidenceList(this.params)
      if (err) return
      this.loading = false
      data.data.forEach(item => {
        if (item.children) {
          let tmp = 0
          item.children.forEach(iitem => {
            tmp = tmp + parseFloat(iitem.pmt_money)
          })
          item.pmt_total = tmp.toFixed(2)
        }
      })
      this.billData = data.data
      this.total_count = data.total_count || 0
    },
    //  搜索
    goStore () {
      this.params.page = 1
      this.getFlow()
    },

    //  分页
    pageChange (val) {
      this.params.page = val
      this.getFlow()
    },
    handleSizeChange (val) {
      this.params.page = 1
      this.params.pre_page = val
      this.getFlow()
    }
  }
}
</script>

<style scoped>
  .search-box-warp {
    margin-bottom: 10px;
  }

  .search-box {
    height: 54px;
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
      width: 350px;
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
      width: 230px;
    }
  }

</style>
