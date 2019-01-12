<template>
  <div>
    <div class="search-box-warp">
      <div class="search-box">
        <el-row>
          <el-col :span="24">
            <div style="float:right;" class="grid-content bg-purple-light">
              <span class="el_input_text"> 时间:</span>
              <div class="type-class">
                <el-date-picker
                  v-model="params.date"
                  :clearable="false"
                  size="small"
                  type="daterange"
                  unlink-panels
                  range-separator="-"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="timestamp"
                  start-placeholder="请选择开始日期"
                  end-placeholder="请选择结束日期">
                </el-date-picker>
              </div>
              <!--<span class="el_input_text"> 门店:</span>-->
              <!--<div class="type-class">-->
              <!--<el-input size="small" class="el_input_width" v-model="params.storeName"-->
              <!--:clearable="true" placeholder="请输入门店名称"/>-->
              <!--</div>-->
              <span class="el_input_text">商品名称:</span>
              <div class="type-class el_input_width">
                <el-input size="small" class="el_input_width" v-model="params.goodsName"
                          :clearable="true" placeholder="请输入商品名称"/>
              </div>
              <el-button class="el_button_left" size="small" type="primary" @click="search">搜索</el-button>
              <el-button size="small" typ="warning" @click="exportData">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="background: #fff;margin-top: 10px;">
      <el-table :header-cell-style="setHeaderStyle" border
                v-loading="loading"
                highlight-current-row
                show-summary
                :summary-method="getSummaries"
                :data="items"
                :height="height"
                style="width: 100%">
        <el-table-column label="序号" type="index" width="50" align="center"/>
        <el-table-column prop="goodsName" label="商品名称" align="center" width="220"/>

        <el-table-column prop="totalGoodsWeight" label="重量" align="center"/>
        <el-table-column prop="unit" label="单位" align="center"/>
        <el-table-column label="收入" align="center">
          <el-table-column prop="totalGoodsPrice" label="销售单价" align="center"/>
          <el-table-column prop="totalGoodsMoney" label="销售金额" align="center"/>
        </el-table-column>
        <el-table-column label="成本" align="center">
          <el-table-column prop="totalCostPrice" label="成本单价" align="center"/>
          <el-table-column prop="totalCostMoney" label="成本金额" align="center"/>
        </el-table-column>
        <el-table-column prop="totalProfit" label="毛利" align="center"/>
        <el-table-column prop="totalProfitRate" label="毛利率" align="center"/>
      </el-table>
    </div>
    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="pageChange"
        :current-page="params.pageIndex"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      const [start, end] = (() => {
        const firstDate = new Date()
        firstDate.setDate(1) // 第一天
        const endDate = new Date(firstDate)
        endDate.setMonth(firstDate.getMonth() + 1)
        endDate.setDate(0)
        return [firstDate * 1 / 1, endDate * 1 / 1]
      })()
      return {
        height: 0,
        loading: false,
        total_count: 0,
        items: [],
        params: {
          page: 1,
          pageSize: 10,
          // storeName: '', // 门店名称
          goodsName: '', // 商品名称，
          date: [start, end]
        }
      }
    },
    async created () {
      this.height = window.innerHeight - 181
      this.getItems()
    },
    activated () {
    },
    methods: {
      async exportData () {
        const {err, data: {data}} = await this.$service.exportFile.export({
          ...this.handleParams(),
          export: 'sellReport'
        })
        if (err) return
        // console.log(data)
        window.location.href = data
      },
      // 处理参数
      handleParams () {
        const {date, ...rest} = this.params
        const [startTime = '', endTime = ''] = date.map((item, index) => {
          const result = parseInt(item / 1000)
          if (index && item === date[0]) {
            return result + 24 * 3600 - 1
          }
          return result
        })
        return {startTime, endTime, reportType: 1, ...rest}
      },
      // 获取数据
      async getItems () {
        this.loading = true
        const {err, data} = await this.$service.stock.orderGoodsStatistics(this.handleParams())
        this.loading = false
        if (err) return
        this.total_count = data.data.total
        this.items = data.data.data
      },
      search () {
        this.getItems()
      },
      pageChange (page) {
        this.params.page = page
        this.getItems()
      },
      handleSizeChange (size) {
        this.params.pageSize = size
        this.getItems()
      },
      // 设置表头样式
      setHeaderStyle () {
        return 'background:#f5f7fa'
      },
      getSummaries (param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if ([1, 2, 4, 6, 9].includes(index)) {
            sums[index] = ''
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = parseInt(values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0))
          } else {
            sums[index] = ''
          }
        })

        return sums
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
