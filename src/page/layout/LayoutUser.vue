<template>
  <div class="left-bottom">
    <div class="item">
      <el-dropdown @command="commandChange">
        <span style="color: #d0d0d0">{{shopInfo.shop_name}}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changePassword" @click="changePasswordVisible = true">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--修改密码-->
    <el-dialog title="修改密码" width="420px" :visible.sync="changePasswordVisible">
      <el-form :model="passwordForm" ref="passwordForm" :rules="passwordFormRules">
        <el-form-item label="原密码" prop="old_password">
          <el-input v-model="passwordForm.old_password" placeholder="请输入原密码"/>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="passwordForm.new_password" type="password" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="passwordForm.confirm_password" type="password" placeholder="请再次输入新密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changePasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChangePassword">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vea'

export default {
  name: 'layoutUser',
  created () {
    this.getShopInfo()
  },
  data () {
    const checkPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordFormRules: {
        old_password: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        new_password: [
          {required: true, message: '请输入新密码', trigger: 'change'}
        ],
        confirm_password: [
          {required: true, message: '请再次输入新密码', trigger: 'change'},
          {validator: checkPassword, trigger: 'blur'}
        ]
      },
      passwordForm: {
        old_password: '',
        new_password: '',
        confirm_password: ''
      },
      changePasswordVisible: false, // 修改密码开关

      // 店铺头像
      invite_code: ''
    }
  },
  computed: {
    ...mapState(['shopInfo'])
  },
  methods: {
    ...mapActions(['getShopInfo']),
    submitChangePassword () {
      this.$refs.passwordForm.validate(async (valid) => {
        if (valid) {
          const {err, data} = await this.$service.changePassWord(this.passwordForm)
          if (err) return
          this.$message.success('密码修改成功')
          this.$refs.passwordForm.resetFields()
          this.changePasswordVisible = false
        } else {
          return false
        }
      })
    },
    loginOut () {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sessionStorage.removeItem('user_info')
        this.$router.push('/login')
      })
    },
    commandChange (value) {
      if (value === 'changePassword') {
        this.changePasswordVisible = true
      } else {
        this.loginOut()
      }
    }
  }
}
</script>

<style scoped>
  /*bottom*/
  .left-bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .left-bottom .item {
    color: #e5e5e5;
    background-color: rgba(0, 0, 0, .6);
    height: 40px;
    line-height: 40px;
    overflow: hidden;
  }
</style>
