<template>
  <div>
    <!--头部start-->
    <div class="search-box">
      <el-button
        v-if="$checkActionAccess($ACCESS.MEMBER_ADD)"
        icon="el-icon-plus" type="primary" size="small" @click="member.visible = true">添加员工
      </el-button>
      <div class="searcher">
        <span style="float:left;margin-right: 15px">员工名称:</span>
        <div class="type-class">
          <el-input
            size="small"
            v-model="search.user_name"
            placeholder="请输入用户名称"
          />
        </div>
        <el-button size="small" type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
      </div>
    </div>
    <!--头部end-->
    <el-table
      :data="list"
    >
      <el-table-column
        type="selection"
        width="30"/>
      <el-table-column
        prop="user_id"
        align="center"
        label="员工ID"/>
      <!--<el-table-column-->
      <!--label="员工头像"-->
      <!--align="center"-->
      <!--width="100"-->
      <!--&gt;-->
      <!--<div slot-scope="scope" style="width:80px;height:80px;border-radius: 40px">-->
      <!--<img style="width: 100%;height: 100%"-->
      <!--:src="scope.row.img" :alt="scope.row.img">-->
      <!--</div>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="user_name"
        align="center"
        label="员工名">
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        label="员工电话">
      </el-table-column>
      <el-table-column
        prop="email"
        align="center"
        label="员工邮箱">
      </el-table-column>
      <el-table-column
        prop="shop_status_info"
        align="center"
        label="状态">
      </el-table-column>
      <el-table-column
        align="center"
        width="325"
        label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="$checkActionAccess($ACCESS.MEMBER_PERMISSION)"
            size="mini"
            type="primary"
            @click="$router.push({
              path:'/user/member/' + scope.row.user_id
            })">
            权限管理
          </el-button>
          <el-button
            v-if="$checkActionAccess($ACCESS.MEMBER_FORBIDDEN)"
            size="mini"
            :loading="loading"
            @click="doDisEn(scope.row)">
            {{scope.row.shop_status===20?'禁用':'启用'}}
          </el-button>
          <!--@click="doEditMember(scope.row)"-->
          <el-button
            v-if="$checkActionAccess($ACCESS.MEMBER_EDIT)"
            size="mini"
            type="primary"
            @click="doEditMember(scope.row)"
          >修改
          </el-button>
          <el-button
            v-if="$checkActionAccess($ACCESS.MEMBER_DELETE)"
            size="mini"
            type="danger"
            @click="doDeleteMember(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页start-->
    <div class="page-box">
      <el-pagination
        class="text-align"
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :current-page="page.page"
        :page-size="page.pre_page"
        :total="page.total_count">
      </el-pagination>
    </div>
    <!--分页end-->
    <!--添加员工-->
    <el-dialog title="添加员工" :visible.sync="member.visible" width="40%">
      <el-form :model="member.item" :rules="member.rules" label-width="80px" ref="memberForm">
        <el-form-item label="员工手机" prop="phone" required>
          <el-input v-model="member.item.phone" placeholder="请输入员工手机号"/>
        </el-form-item>
        <el-form-item label="员工状态" prop="status">
          <el-switch
            v-model="member.item.status"
            active-text="启用"
            inactive-text="禁用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="member.visible = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="member.loading" @click="doAdd" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改员工姓名" :visible.sync="member.visible_Edit" width="40%">
      <el-form :model="member.item_Edit" :rules="member.rules_Edit" label-width="80px" ref="memberFormEdit">
        <el-form-item label="员工姓名" prop="user_name" required>
          <el-input v-model="member.item_Edit.user_name" placeholder="请输入员工姓名"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="member.visible_Edit = false" size="small">取 消</el-button>
        <el-button type="primary" :loading="member.loading" size="small" @click="userEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'Discount',
  created () {
    const {page, user_name} = this.$route.query
    this.page.page = parseInt(page) || 1
    this.search.user_name = user_name || ''
    this.getList()
  },
  methods: {
    // 添加绑定
    doAdd () {
      this.$refs.memberForm.validate(async valid => {
        if (valid) {
          this.member.loading = true
          const {phone, status} = this.member.item
          const {err, data} = await this.$service.member.search(phone)
          if (err) {
            this.member.loading = false
          }
          const {user_id} = data.result
          if (!user_id) {
            this.member.loading = false
            this.$message.error('不存在的会员')
            return
          }
          const {err: err1} = await this.$service.member.add_staff({user_id: user_id, status: status ? 20 : 10})
          this.member.loading = false
          if (err1) return
          this.member.visible = false
          this.member.item.phone = ''
          this.$message.success('员工添加成功')
          this.getList()
        } else {
          return false
        }
      })
    },
    doEditMember ({user_id}) {
      this.user_ids = user_id
      this.member.visible_Edit = true
    },
    //  修改员工姓名 {
    userEdit () {
      let user_id = this.user_ids
      const name = this.member.item_Edit
      this.$refs.memberFormEdit.validate(async valid => {
        if (valid) {
          const {err, data} = await this.$service.member.staffEdit(user_id, name)
          this.member.visible_Edit = false
          this.getList()
        } else {
          return false
        }
      })
    },
    // 解除绑定
    doDeleteMember ({user_id}) {
      this.$confirm('确定要删除该员工吗?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {err, data} = await this.$service.member.remove_staff(user_id)
        if (err) return
        this.$message.success('员工删除成功')
        this.getList()
      })
    },
    // 禁用启用
    async doDisEn (item) {
      const {shop_status, user_id} = item
      const status = shop_status === 20 ? 10 : 20
      this.loading = true
      const {err, data} = await this.$service.member.dis_en_staff(user_id, {status})
      this.loading = false
      if (err) return
      item.shop_status = status
      item.shop_status_info = status === 10 ? '禁用' : '启用'
      this.$message.success(data.message)
    },
    doSearch () {
      this.page.page = 1
      this.getList()
    },
    // 换页
    changePage (currentPage) {
      this.$router.push({
        path: '/user/member',
        query: {...this.page, page: currentPage, user_name: this.search.username}
      })
    },
    async getList () {
      const {err, data} = await this.$service.member.staff_list({
        page: this.page.page, pre_page: this.page.pre_page, user_name: this.search.user_name
      })
      if (err) return
      const {total_count, result} = data
      this.list = result
      this.page.total_count = total_count
    }
  },
  data () {
    const checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(value))) {
          callback(new Error('请输入正确的手机号'))
        }
        callback()
      }
    }
    return {
      user_ids: '',
      loading: false,
      member: {
        loading: false,
        visible: false,
        visible_Edit: false,
        item_Edit: {
          user_name: ''
        },
        item: {
          phone: '',
          status: true
        },
        rules: {
          phone: [
            {validator: checkPhone, trigger: 'blur'}
          ]
        },
        rules_Edit: {
          user_name: [
            {required: true, message: '请输入员工姓名', trigger: 'blur'}
          ]
        }
      },
      search: {
        user_name: ''
      },
      page: {
        page: 1,
        pre_page: 10,
        total_count: 0
      },
      list: [{}]
    }
  }
}
</script>

<style scoped>
  .search-box {
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
    background: #fff;
    margin-bottom: 10px;
  }

  .searcher {
    float: right;
  }

  .type-class {
    float: left;
    margin-right: 10px;
  }

  .table-head {
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #eee;
  }

  .table-main {
    font-size: 12px;
    text-align: center;
    background: #fff;
  }

  .table-content {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #eee;
    text-align: center;
  }

  .page-box {
    background: #fff;
    text-align: center;
    padding: 10px;
  }

  .text-align {
    text-align: center;
  }

  .table-img img {
    height: 50px;
    width: 50px;
    border-radius: 50px;
    margin-top: 6px;
  }
</style>
