<template>
  <div>
    <div class="search-box-warp">
      <div class="search-box">
        <div style="padding-left:18px;" class="grid-content bg-purple" v-if="$checkActionAccess($ACCESS.USER_ALLOT_PRICE)">
          <el-popover
            placement="right"
            align="center"
            v-model="recommend.show"
            trigger="click">
            <el-radio :key="item.id" v-model="recommend_selected" v-for="item in recommend.select"
                      :disabled="parseInt(item.type)===10" :label="item.id" border
                      size="small">
              {{parseInt(item.type)===10?`${item.name}(渠道)`:item.name}}
            </el-radio>

            <p style="text-align: center;margin-top: 15px">
              <el-button size="mini" @click="recommend.show=false">取消</el-button>
              <el-button type="primary" @click="setThePrice" size="mini">保存</el-button>
            </p>
            <el-button size="mini" slot="reference" type="primary">
              分配价格体系
            </el-button>
          </el-popover>
        </div>
        <div class="searcher">
          <div class="capital-search">
            <span style="float:left;margin-right: 10px;width: 65px;">注册时间:</span>
            <div class="type-class">
              <el-date-picker size="small" v-model="valueData" type="daterange"
                              value-format="yyyy-MM-dd"
                              range-separator="至"
                              unlink-panels="true"
                              start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <div class="capital-search capital-search-fl">
            <span style="float:left;margin-right: 10px;width: 65px;">用户名称:</span>
            <div class="type-class">
              <el-input size="small" v-model="params.store_name"
                        placeholder="请输入用户名称"/>
            </div>
          </div>
          <div class="capital-search">
            <span style="float:left;margin-right: 10px;width: 65px;">渠道类型:</span>
            <div class="type-class">
              <el-cascader
                clearable
                :props="{value: 'channel_id', label: 'channel_name'}"
                :options="channelItems"
                change-on-select
                size="small"
                v-model="params.channel_id">
              </el-cascader>
            </div>
          </div>
          <div class="capital-search capital-search-fl">
            <span style="float:left;margin-right: 10px;width: 65px;">负责人:</span>
            <div class="type-class">
              <el-input size="small" v-model="params.store_person"
                        placeholder="请输入负责人"/>
            </div>
          </div>
          <div class="capital-search capital-search-fl">
            <span style="float:left;margin-right: 10px;width: 65px;">手机号:</span>
            <div class="type-class">
              <el-input size="small" v-model="params.store_phone"
                        placeholder="请输入手机号"/>
            </div>
          </div>
          <div class="capital-search-btn">
            <el-button size="small" type="primary" icon="el-icon-search" @click="goStore">搜索</el-button>
            <el-button type="primary" size="small" plain icon="el-icon-upload2" @click="exportData"  v-if="$checkActionAccess($ACCESS.USER_EXPORT)">导出</el-button>
          </div>
        </div>
      </div>
    </div>
    <div style="background: #fff;margin-top: 10px;">
      <el-table
        highlight-current-row
        @selection-change="handleSelectionChange"
        :data="storeData"
        style="width: 100%">
        <el-table-column type="selection">
        </el-table-column>
        <!--<el-table-column prop="shop_id" label="店铺编号" align="center">
        </el-table-column>-->
        <el-table-column prop="store_name" label="用户名称" align="center">
        </el-table-column>
        <el-table-column prop="store_person" label="负责人" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center">
        </el-table-column>
        <el-table-column prop="channel_name" label="渠道类型" align="center">
        </el-table-column>
        <el-table-column prop="store_address" label="店铺地址" align="center">
        </el-table-column>
        <el-table-column prop="price_type_name" label="价格类型" align="center">
        </el-table-column>
        <el-table-column prop="created_at" label="店铺注册时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="$router.push('/user/store/detail/'+ scope.row.id)">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="page-box">
      <el-pagination background layout="prev, pager, next" :page-size="params.pre_page" :current-page="params.page"
                     @current-change="pageChange"
                     :total="total_count">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      recommend_selected: '',
      recommend: {
        show: false,
        select: []
      }, // 添加价格类型
      multipleSelection: [],
      showSearch: true,
      total_count: 1,
      storeData: [],
      channelItems: [],
      value: '',
      paramsList: {
        page: 1,
        pre_page: 5
        // type:11
      },
      params: {
        page: 1,
        pre_page: 10,
        //  以下是搜索
        store_name: '', //  用户名称
        store_person: '', //  负责人
        channel_id: [], //  渠道类型
        strat_time: '', //  店铺注册时间
        end_time: '', // 结束时间
        store_phone: '' //  手机号
      },
      valueData: []
    }
  },
  async created () {
    this.getStoreList()
    this.getPricingList()
    this.getChannel()
  },
  activated () {
    this.getStoreList()
    this.getPricingList()
    this.getChannel()
  },
  methods: {
    // 导出
    async exportData () {
      this.valueData = this.valueData || []
      const params = {
        ...this.params,
        strat_time: this.valueData[0] || '',
        end_time: this.valueData[1] || '',
        channel_id: this.params.channel_id[this.params.channel_id.length - 1] || ''
      }
      const {err, data} = await this.$service.store.store_list({...params, pre_page: 3000, export: 1})
      if (err) return
      console.log(data)
      // window.open(data.result)
      window.location.href = data.result
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
    //  获取用户列表
    async getStoreList () {
      this.valueData = this.valueData || []
      const params = {
        ...this.params,
        strat_time: this.valueData[0] || '',
        end_time: this.valueData[1] || '',
        channel_id: this.params.channel_id[this.params.channel_id.length - 1] || ''
      }
      const {err, data} = await this.$service.store.store_list(params)
      if (err) return
      this.storeData = data.result
      this.total_count = data.total_count || 1
    },
    // 分类列表
    async getPricingList () {
      const {err, data} = await this.$service.goods.pricing.pricing_list(this.paramsList)
      if (err) return
      this.recommend.select = data.result.map(item => {
        const {price_type_id, price_type_name, type} = item
        return {name: price_type_name, id: price_type_id, type}
      })
    },
    // 添加
    async setThePrice () {
      if (!this.recommend_selected) {
        this.$message.warning('请选择价格体系')
        return false
      }
      if (!this.multipleSelection.length) {
        this.$message.warning('请选择需要分配的用户')
        return false
      }

      const price = this.recommend.select.find(item => item.id == this.recommend_selected) || {}
      const price_type_name = price.name || ''
      const {err, data} = await this.$service.store.add_store({
        store_id: this.multipleSelection.join(','),
        price_type_id: this.recommend_selected,
        price_type_name
      })
      if (err) return
      // console.log(data);
      if (parseInt(data.status) === 200) {
        this.$message.success(data.msg)
        // this.multipleSelection = [];
        this.recommend_selected = ''
        this.recommend.show = false
        this.getStoreList()
      } else {
        this.$Message.error(data.msg)
      }
    },

    //  获取渠道类型
    async getChannel () {
      const {err, data} = await this.$service.channel.list()
      if (err) return
      this.channelItems = data.result
    },

    //  搜索
    goStore () {
      this.params.page = 1
      this.getStoreList()
    },

    //  分页
    pageChange (val) {
      this.params.page = val
      this.getStoreList()
    },
    //  选中的价格类型
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    handleSelectionChange (val) {
      this.multipleSelection = []
      val.forEach(item => {
        if (item.id) {
          this.multipleSelection.push(item.id)
        }
      })
    }
  }
}
</script>

<style scoped>
  .search-box-warp {
    margin-bottom: 10px;
  }

  .search-box {
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  .search-box {
    height: 240px;
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
    margin-bottom: 20px;
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

  .num_cor {
    color: #1c8fef;
    cursor: pointer;
  }

  .capital-search {
    width: 100%;
    height: 55px;
    padding-left: 20px;
  }

  .capital-search-btn {
    padding-left: 110px;
  }

  .capital-search-fl {
    float: left;
    width: 280px;
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
      width: 170px;
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
      width: 150px;
    }

    .el_button_left {
      margin-left: 10px;
    }

    .selected_date {
      width: 200px;
    }
  }

</style>
