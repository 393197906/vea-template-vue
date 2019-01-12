<template>
  <div class="form_view">
    <el-form ref="formValidate" label-width="100px">
      <el-form-item label="权限分配:">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checked_role" @change="handleCheckedChange">
          <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{role.role_name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formValidate')" size="small" :loading="loading">提交</el-button>
        <el-button @click="$router.back()" size="small">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      id: '',
      checkAll: false,
      isIndeterminate: true,
      roles: [],
      role_id: [],
      checked_role: []
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getUserDetail()
    this.getroleList()
  },
  methods: {
    handleCheckAllChange (val) {
      this.checked_role = val ? this.role_id : []
      this.isIndeterminate = false
    },
    handleCheckedChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.role_id.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.role_id.length
    },
    // 提交表单
    async submitForm (name) {
      this.loading = true
      const {err, data} = await this.$service.member.user_bind({
        user_id: this.id,
        role: this.checked_role.join(',')
      })
      this.loading = false
      if (err) return
      this.$message.success('提交成功')
      this.$router.push({
        path: '/user/member'
      })
    },
    // 获取节点列表
    async getroleList () {
      const {err, data} = await this.$service.member.roleList({
        status: 10
      })
      if (err) return
      if (data.result) {
        data.result.forEach(item => {
          this.roles.push({
            id: item.id,
            role_name: item.role_name
          })
          this.role_id.push(item.id)
        })
      }
    },
    // 获取角色节点
    async getUserDetail () {
      const {err, data} = await this.$service.member.user_detail(this.id)
      if (err) return
      if (data.result) {
        const {role} = data.result
        role.forEach(item => {
          this.checked_role.push(item.id)
        })
      }
    }
  }
}
</script>
<style scoped>
  .form_view {
    background-color: #FFF;
    height: 100%;
    padding-top: 15px;
  }
</style>
