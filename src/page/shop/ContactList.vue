<template>
  <div class="contact-list">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="name"
        label="站点名称"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        label="地址"
      >
      </el-table-column>
      <el-table-column
        prop="contact"
        align="center"
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        label="联系电话">
      </el-table-column>
      <el-table-column
        align="center"
        prop="create_time"
        label="发布时间">
      </el-table-column>
      <el-table-column
        prop="default_address"
        align="center"
        label="是否默认">
        <template slot-scope="scope">
          <i class="el-icon-success icon_success" v-if="scope.row.default_address===1"></i>
          <i class="el-icon-error icon_error" v-if="scope.row.default_address===0"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="320"
      >
        <template slot-scope="scope">
            <el-button
              v-if="$checkActionAccess($ACCESS.CONTACT_SET_DEFAULT)"
                        size="mini"
                       :disabled = "scope.row.default_address == 1 ? true : false"
                       icon="el-icon-edit"
                       @click="setDefault(scope.row.id,scope.row)">设为默认
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-edit"
              v-if="$checkActionAccess($ACCESS.CONTACT_EDIT)"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
          <el-button
            v-if="$checkActionAccess($ACCESS.CONTACT_DELETE)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        //            {id:1,
        //            name: '菏泽点1',
        //            address: '山东省-菏泽市-牡丹区-菏泽1号',
        //            contact: '彭',
        //            phone: '13344445555',
        //            create_time: '1517625591'}
      ]
    }
  },
  mounted () {
    this._getContactList()
  },
  methods: {
    /** 设为默认 */
    async setDefault (id, item) {
      this.$confirm(item.default_address ? '确定取消默认账户?' : '确定要把该账户设为默认账户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {err, data} = await this.$service.shop.point.defaultAddress(id, {
            default_address: item.default_address ? 0 : 1
          })
          this.$message({
            type: 'success',
            message: data.status === 200 ? '设置成功' : data.message
          })
          this._getContactList()
        })
        .catch(() => {
        })
    },
    handleEdit ($index, $row) {
      const id = $row.id
      this.$router.push('/shop/contactWay/contactEdit/' + id)
    },
    async handleDelete ($index, $row) {
      const id = $row.id
      const {err, data} = await this.$service.shop.point.del(id)
      if (err) {
        this.$message({
          message: '失败',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '成功',
        type: 'success'
      })
      window.location.reload()
    },
    async _getContactList () {
      const {err, data} = await this.$service.shop.point.list()
      if (err) return
      const res = data.data
      this.tableData = res
    }
  }
}
</script>

<style scoped>
  .icon_success {
    color: #67c23a;
  }

  .icon_error {
    color: #f56c6c;
  }
</style>
