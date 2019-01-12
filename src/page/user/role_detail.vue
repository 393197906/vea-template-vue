<template>
  <div class="form_view">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="100px">
      <el-form-item label="角色名称:" prop="role_name">
        <el-input v-model="formValidate.role_name" placeholder="请输入角色名称" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="使用状态:" required>
        <el-radio v-model="formValidate.status" :label="10">启用</el-radio>
        <el-radio v-model="formValidate.status" :label="20">禁用</el-radio>
      </el-form-item>
      <el-form-item label="权限分配" prop="id" id="role-detail">
        <el-checkbox :indeterminate="indeterminate" :value="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-tree
          style="margin-top:10px"
          :data="treeData"
          node-key="id"
          ref="tree"
          :props="treeProps"
          show-checkbox
          default-expand-all
          @check="handleCheckedChange"
        >
        </el-tree>
      </el-form-item>
      <el-form-item class="el-form-item">
        <el-button type="primary" @click="submitForm('formValidate')" :loading="loading" size="small">提交</el-button>
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
      checkAll: false,
      indeterminate: true,
      node_id: [],
      role_all: [],
      id: '',
      role_nodes: '',
      treeData: [],
      treeProps: {
        childre: 'children',
        label: 'node_name',
        id: 'id'
      },
      formValidate: {
        role_name: '',
        status: 10
      },
      expanded_keys: [],
      ruleValidate: {
        role_name: [
          {
            required: true,
            message: '角色名字不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  async mounted () {
    this.id = this.$route.params.id
    await this.getFullTree()
    this.getRoleDetail()
  },
  methods: {
    // 全选按钮
    handleCheckAllChange () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        this.$refs.tree.setCheckedKeys(this.role_all)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    handleCheckedChange (data, node) {
      let checkedCount = node.checkedKeys.length
      let len = this.role_all.length
      if (checkedCount === len) {
        this.indeterminate = false
        this.checkAll = true
      } else if (checkedCount > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    async submitForm (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          const node_id = this.$refs.tree.getCheckedKeys()
          const half_node_id = this.$refs.tree.getHalfCheckedKeys()
          console.log('被选中：', node_id)
          console.log('半选中：', half_node_id)
          // return false
          this.loading = true
          const {err, data} = await this.$service.member.roleEdit({
            ...this[name],
            node_id: [...node_id, ...half_node_id].join(','),
            id: this.id
          })
          this.loading = false
          if (err) return
          this.$message.success('提交成功')
          this.$router.push({
            path: '/user/role'
          })
        } else {
          this.$message.warning('请补全信息!')
        }
      })
    },
    // 获取树完整节点
    async getFullTree () {
      const {err, data} = await this.$service.member.roleNode({
        sys_mark: 'bbc'
      })
      if (err) return
      this.treeData = data.result
      this.treeData.forEach(item => {
        this.role_all.push(item.id)
        if (item.children) {
          item.children.forEach(i => {
            this.role_all.push(i.id)
          })
        }
      })
    },
    // 获取角色节点
    async getRoleDetail () {
      const {err, data} = await this.$service.member.roleDetail({
        id: this.id
      })
      if (err) return
      let role_nodes = []
      data.result.node.forEach(item => {
        role_nodes.push(item.node_id)
      })
      this.expanded_keys = role_nodes
      const {role_name, status, id} = data.result
      this.formValidate.role_name = role_name
      this.formValidate.status = status
      this.id = id

      function find (id, list) {
        const has = list.find(da => da.id === id)
        if (has) {
          return has && has.children
        }
        for (let item of list) {
          const {children = []} = item
          const has2 = children.find(da => da.id === id)
          if (has2) {
            return has2 && has2.children
          }
        }
      }
      role_nodes = role_nodes.filter(item => {
        return !find(item, this.treeData)
      })
      this.$refs.tree.setCheckedKeys(role_nodes)
    }
  }
}
</script>
<style scoped>
  .form_view {
    background-color: #FFF;
    padding-top: 15px;
  }

  .el-form-item {
    padding-bottom: 20px;

  }
</style>
<style>
  #role-detail .el-tree-node__content[style*="18"] + .el-tree-node__children .el-tree-node {
    display: inline-block;
    float: left;
  }

</style>
