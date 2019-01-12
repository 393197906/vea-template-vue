<template>
    <div class="module-box">
        <div class="tips-info">
            <img src="./component/start-icon.png" width="80" height="80" alt="">
            <div>
                <p class="tips">期初库存</p>
                <p class="tips-p">在进行系统管理之前已经发生过进销存业务，可以使用本功能完成初始库存与成本价的设置。</p>
            </div>
        </div>
        <!---->
        <el-form inline>
            <el-form-item>
                <el-button
                        v-if="$checkActionAccess($ACCESS.INITIAL_STOCK_ADD)"
                        type="primary"
                        @click="$router.push({path: '/stock/start/newStart'})"
                        size="small">设置期初库存</el-button>
            </el-form-item>
        </el-form>
        <!---->
        <!-- 表格 -->
        <el-table style="width: 100%" :data="begin_stoke">
            <el-table-column prop="sheetCode" align="center" label="单据号" ></el-table-column>
            <el-table-column prop="warehouseName" align="center" label="仓库" ></el-table-column>
            <el-table-column prop="operator" align="center" label="操作人" ></el-table-column>
            <el-table-column prop="createTime" align="center" label="制单时间" >
              <template slot-scope="scope">
                    <p>{{formatTime(scope.row.createTime)}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="mark" align="center" label="备注" ></el-table-column>
            <el-table-column prop="date" align="center" label="操作" v-if="$checkActionAccess($ACCESS.INITIAL_STOCK_DETAIL)">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="$router.push({path: '/stock/start/startInfo',query:{id:scope.row.id}})">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- // 表格 -->
        <div class="page">
            <!--分页-->
            <el-pagination
            v-if="total_data"
                    @current-change="handleCurrentChange"
                    :current-page.sync="page"
                    :page-size="pageSize"
                            background
                            layout="prev, pager, next"
                            :total="total_data">
                    </el-pagination>
            <!-- // 分页 -->
        </div>
    </div>
</template>

<script>
import {formatTime} from '@/util/util.js'
export default {
  name: 'start',
  data () {
    return {
      pageSize: 10,
      page: 1,
      total_data: 1,
      begin_stoke: []
    }
  },
  activated () {
    this.getData()
  },
  created () {
    this.getData()
  },
  methods: {
    formatTime: formatTime,
    async getData () {
      const {
        err,
        data: { data }
      } = await this.$service.beginStock.getAllBeginStock({
        page: this.page,
        pageSize: this.pageSize
      })
      if (err) return

      this.begin_stoke = data.data
      this.total_data = data.total
    },
    handleCurrentChange (page) {
      this.page = page
      this.getData()
    }
  }
}
</script>

<style scoped>
.module-box {
  padding: 15px;
  background-color: #ffffff;
}
.tips-info {
  background-color: #f2f2f2;
  height: 85px;
  padding: 15px;
  display: flex;
  margin-bottom: 30px;
}
.tips-info img {
  margin-right: 15px;
}
.tips-info .tips {
  font-size: 14px;
  color: #333333;
  margin-bottom: 10px;
}
.tips-info .tips-p {
  font-size: 12px;
  color: #666666;
}
.page {
  text-align: center;
  padding: 10px;
}
</style>
