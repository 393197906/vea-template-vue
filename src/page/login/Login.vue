<template>
  <div class="centent">
    <div class="banner" :style="{height:`${height/2}px`}">
    </div>
    <div class="search_img" :style="{top:`${height/2+55}px`}">
      <p class="font">后台管理系统登录</p>
      <p class="excellent">优鲜供应链</p>
      <p class="city">城市合伙人管理中心</p>
      <p class="user">
        <i class="icon iconfont icon-guanbi"></i>
        <input class="username" v-model.trim="account.phone" type="text" placeholder="请输入账户名" @keyup.enter="login">
      </p>
      <p class="pass">
        <i class="icon iconfont icon-mima"></i>
        <input v-model.trim="account.password" @blur="checkPass" class="password" type="password" placeholder="请输入密码"
               @keyup.enter="login"></p>
      <div class="land" @click="login">登录</div>
    </div>
    <div class="message" :style="{height:`${height/2}px`}"></div>
  </div>
</template>

<script>
import '@/assets/icon/iconfont.css'

export default {
  name: 'Login',
  methods: {
    checkPass (event) {
      const regu = /^[\w]{6,12}$/
      if (!event.target.value.match(regu)) {
        this.account.password = ''
        this.$message.error('密码至少输入6位！')
      }
    },
    async login () {
      const {phone, password} = this.account
      if (!phone) {
        this.$message.error('请输入用户名')
        return
      }
      if (!password) {
        this.$message.error('请输入用户密码')
        return
      }
      const {err, data} = await this.$service.login({phone, password})
      if (err) return
      data.result.node = Array.isArray(data.result.node) ? data.result.node.map(item => {
        let {check_node = ''} = item
        return {...item, check_node: check_node.toLowerCase()}
      }) : []
      sessionStorage.setItem('user_info', JSON.stringify(data.result))
      this.$router.push('/')
    }
  },
  created () {
    if (sessionStorage.getItem('user_info')) {
      this.$router.push('/')
    }
    const height = window.innerHeight
    this.height = height
  },
  data () {
    return {
      height: 0,
      account: {
        // phone: '18888888888',
        // password: 'admin123',
        phone: '',
        password: ''
      }
    }
  }
}
</script>
<style scoped>
  input:-webkit-autofill {
    box-shadow: 0 0 0px 1000px white inset;
  }

  .iconfont {
    display: inline-block;
    width: 39px;
    height: 45px;
    text-align: center;
    line-height: 45px;
  }

  .icon-guanbi:before {
    font-size: 22px;
    color: #000;
  }

  .icon-mima:before {
    font-size: 30px;
    color: #999;
  }

  .centent {
    position: relative;
  }

  .banner {
    background-image: url("../../images/banner.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .font {
    width: 325px;
    font-size: 1.9rem;
    margin: 0 auto;
    color: #fff;
    letter-spacing: 10px;
    position: absolute;
    left: 258px;
    top: -90px;
    transform: translate(-50%, 16%);
  }

  .search_img {
    position: absolute;
    top: 65%;
    left: 50%;
    width: 490px;
    height: 390px;
    -webkit-transform: translate(-50%, -65%);
    transform: translate(-50%, -65%);
    background-image: url("../../images/moment.png");
    background-repeat: no-repeat;
    background-size: 490px 390px;
  }

  .excellent {
    font-size: 1.75rem;
    font-family: "PingFang-SC-Heavy";
    color: #2ccd32;
    text-align: center;
    padding-top: 20px;
    letter-spacing: 2px;
  }

  .city {
    font-size: 18px;
    font-family: "PingFang-SC-Medium";
    color: #999;
    text-align: center;
    letter-spacing: 1.5px;
  }

  .user {
    width: 380px;
    height: 46px;
    position: absolute;
    top: 120px;
    left: 50px;
    border: 1px solid #c1c1c1;
    border-radius: 2px;
  }

  .username {
    width: 320px;
    height: 30px;
    background: #fff;
    border-radius: 2px;
    font-size: 17px;
    padding-left: 20px;
    border-left: 1px solid #c1c1c1;
    font-family: "MicrosoftYaHei";
    letter-spacing: 1px;
    margin-top: 8px;
    float: right;
  }

  .pass {
    width: 380px;
    height: 46px;
    position: absolute;
    top: 185px;
    left: 50px;
    border: 1px solid #c1c1c1;
    border-radius: 2px;
  }

  .password {
    width: 320px;
    height: 30px;
    background: #fff;
    border-radius: 2px;
    font-size: 17px;
    padding-left: 20px;
    border-left: 1px solid #c1c1c1;
    font-family: "MicrosoftYaHei";
    letter-spacing: 1px;
    margin-top: 8px;
    float: right;
  }

  .verif {
    width: 380px;
    height: 46px;
    position: absolute;
    top: 255px;
    left: 50px;
    border: 1px solid #c1c1c1;
    border-radius: 2px;
  }

  .verification {
    width: 245px;
    height: 30px;
    font-size: 17px;
    padding-left: 10px;
    border-right: 1px solid #c1c1c1;
    font-family: "MicrosoftYaHei";
    letter-spacing: 1px;
    margin-top: 8px;
  }

  ::-webkit-input-placeholder {
    color: #c4c2c2;
  }

  .land {
    cursor: pointer;
    font-size: 18px;
    color: #fff;
    line-height: 50px;
    text-align: center;
    position: absolute;
    top: 270px;
    left: 45px;
    letter-spacing: 10px;
    width: 388px;
    height: 50px;
    background: rgba(15, 103, 177, 1);
    border-radius: 6px;
    box-shadow: 1px 0px 40px rgba(15, 103, 177, 0.17);
  }

  .message {
    background: #fff;
  }
</style>
