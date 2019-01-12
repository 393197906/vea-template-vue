<template>
  <div class="contact-list">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        label="轮播图片"
        align="center"
        width="160">
        <template slot-scope="scope">
          <img :src="scope.row.ad_image" style="width: 140px;height: 140px"/>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="link_url"-->
        <!--align="center"-->
        <!--label="链接地址"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <el-table-column
        prop="type_sdf_china"
        align="center"
        label="类型">
      </el-table-column>
      <el-table-column
        align="center"
        prop="join_type_sdf_china"
        label="跳转类型">
      </el-table-column>
      <el-table-column
        prop="id_name"
        align="center"
        label="跳转指向">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
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
      tableData: []
    }
  },
  mounted () {
    this._getCarouselList()
  },
  methods: {
    handleEdit ($index, $row) {
      const id = $row.id
      this.$router.push('/sale/Carousel/carouselEdit/' + id)
    },
    async handleDelete ($index, $row) {
      const id = $row.id
      const {err, data} = await this.$service.shopmanager.carousel.del(id)
      if (err) return
      this.$message.success('删除成功')
      this._getCarouselList()
    },
    async _getCarouselList () {
      const {err, data} = await this.$service.shopmanager.carousel.list()
      if (err) return
      const res = data.data
      this.tableData = res
    }
  }
}
</script>

<style scoped>

</style>
