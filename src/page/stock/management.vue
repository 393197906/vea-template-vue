<template>
    <div class="module-box">
        <div class="tips-info">
            <img src="./component/management-icon.png" width="80" height="80" alt="">
            <div>
                <p class="tips">仓库管理</p>
                <p class="tips-p">支持根据供货地区（如杭州仓、北京仓）、使用场景（如销售仓、售后仓）的不同创建不同仓库并进行进销存管理。</p>
            </div>
        </div>
        <!---->
        <el-form inline>
            <div class="form-box">
                <el-form-item>
                    <el-button
                            v-if="!stock_list.length && $checkActionAccess($ACCESS.WAREHOUSEA_ADD)"
                            type="primary"
                            @click="$router.push({path: '/stock/management/newWarehouse'})"
                            size="small" >新建仓库</el-button>
                </el-form-item>
                <el-form-item>
                    <el-select clearable placeholder="请选择仓库状态" size="small" class="select-item" v-model="stock_status" @change="statusChange">
                        <el-option label="全部" :value="0"></el-option>
                        <el-option label="启用" :value="5"></el-option>
                        <el-option label="停用" :value="6"></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
        <!---->
        <!-- 表格 -->
        <el-table style="width: 100%" :data="stock_list">
            <el-table-column prop="id" align="center" label="仓库ID" ></el-table-column>
            <el-table-column prop="warehouseName" align="center" label="仓库名称" ></el-table-column>
            <el-table-column prop="contactName" align="center" label="联系人" ></el-table-column>
            <el-table-column prop="mobile" align="center" label="联系方式" ></el-table-column>
            <el-table-column prop="address" align="center" label="仓库地址" ></el-table-column>
            <el-table-column prop="status" align="center" label="状态" >
                <template slot-scope="scope">
                    {{scope.row.status==5?"启用":"禁用"}}
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="操作"  min-width="150">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"    v-if="$checkActionAccess($ACCESS.WAREHOUSEA_EDIT)" @click="$router.push({path: '/stock/management/eitWarehouse',query:{id:scope.row.id}})">编辑</el-button>
                    <el-button :type="scope.row.status==5? 'danger' : 'success'" size="mini" v-if="$checkActionAccess($ACCESS.WAREHOUSEA_CLOSE)" @click="openStock(scope.row.id,scope.row.status==5?2:1)">{{scope.row.status==5?"停用":"启用"}}</el-button>
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
              :page-size="pre_page"
                    background
                    layout="prev, pager, next"
                    :total="total_data">
            </el-pagination>
            <!-- // 分页 -->
        </div>
    </div>
</template>

<script>
export default {
  name: 'management',
  data () {
    return {
      stock_status: '',
      stock_list: [],
      page: 1,
      pre_page: 10,
      total_data: 10
    }
  },
  activated () {
    this.getData()
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      const { err, data } = await this.$service.stock.getAllWarehouse({
        page: this.page,
        pre_page: this.pre_page,
        status: this.stock_status
      })
      if (err) return
      this.stock_list = data.data.data
      this.total_data = data.data.total
    },
    /** 分页切换 */
    handleCurrentChange (page) {
      this.page = page
      this.getData()
    },
    /** 状态筛选 启用或禁用 */
    statusChange (e) {
      this.getData()
    },
    /** 启用或禁用功能 */
    async openStock (id, type) {
      const { err, data } = await this.$service.stock.updateWarehouseStatus({
        id: id,
        type: type
      })
      if (err) return
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
.form-box {
  display: flex;
  justify-content: space-between;
}
.form-box .select-item {
  width: 150px;
}
.page {
  text-align: center;
  padding: 10px;
}
</style>
