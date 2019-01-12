<template>
  <el-container>
    <el-aside :width="navWidth" class="aside" :style="{height:`${height}px`}">
      <div class="nav-left-container">
        <!--logo-->
        <div class="left-logo">
          <img :src="shop_logo" :alt="shop_logo">
        </div>
        <!--bottom-->
        <LayoutUser/>
        <!--nav-->
        <div v-for="(item,index) in navList" :index="`${index}`" :key="index"
             :class="{'left-item':true,active:index==ac1}" @click="$router.push(item.path)">
          <i :class="item.meta.icon"/>&nbsp;{{item.meta.title}}
        </div>
      </div>
      <!--辅导航-->
      <div class="nav-right-container">
        <template v-for="item in subNavList">
          <div v-if="item.path" :class="{'right-item':true,active:item.INDEX==ac2}" @click="$router.push(item.path)">
            <i :class="item.meta.icon"/>&nbsp;{{item.meta.title}}
          </div>
          <template v-else>
            <div class="right-title-item">{{item.value}}</div>
            <div v-for="child in item.children" :class="{'right-item':true,active:child.INDEX==ac2}"
                 @click="$router.push(child.path)"><i :class="child.meta.icon"/>&nbsp;{{child.meta.title}}
            </div>
          </template>
        </template>
      </div>
    </el-aside>
    <el-main class="main">
      <el-card :body-style="{padding:0}">
        <div id="breadcrumb">
          <p></p>{{currentRouterName}}
          <!--<el-button style="margin-left: 10px;margin-right: 10px" size="mini" class="go-back"-->
                     <!--icon="fa fa-question-circle-o" type="default" round>-->
            <!--建议反馈-->
          <!--</el-button>-->
          <el-button size="mini" class="go-back" style="margin-right: 10px" :icon="`fa fa-${allScreen?'clone':'square-o'}`" type="default" round
                     @click=" allScreen = !allScreen">
            {{allScreen?'取消全屏':'网页全屏'}}
          </el-button>
          <transition name="el-zoom-in-center">
            <el-button class="go-back" v-show="has_back" @click="$router.back()" round size="mini"
                       icon="el-icon-back"
                       type="primary">返回
            </el-button>
          </transition>
        </div>
      </el-card>
      <div id="main" style="padding: 10px 1px 5px 1px" class="main" :style="{height:`${height-50}px`}">
        <GoTop dom="#main"/>
        <keep-alive>
          <router-view v-if="$route.meta.keep"/>
        </keep-alive>
        <router-view v-if="!$route.meta.keep" :key="active"/>
        <!--neworder webscoket-->
        <webSocket
          :webScoketUrl="wsUrl"
          @webScoketExpFn="webScoketOrder"
          :webScoketSendData="webScoketSendData">
        </webSocket>
      </div>
    </el-main>
    <audio :src="audio" ref="audio" loop/>
  </el-container>
</template>

<script>
import shop_logo from '@/assets/images/shop_logo.png'
import LayoutUser from './LayoutUser.vue'
import audio from '../../assets/audio/ordermp.mp3'
import {OrderBus} from '@/page/order/order_bus'
import webSocket from '@/components/webSocket/webSocket.vue'
import GoTop from './GoTop'
import * as util from '@/util/util'
import {Notification} from 'element-ui'

export default {
  components: {
    LayoutUser,
    webSocket,
    GoTop
  },
  mounted () {
    const inv = setInterval(() => {
      let target = document.getElementById('newBridge')
      if (target) {
        target.style.setProperty('display', 'block', 'important')
        console.log(target)
        clearInterval(inv)
      }
    }, 500)
    // target.style.display = 'block !important'
  },
  beforeDestroy () {
    let target = document.getElementById('newBridge')
    target.style.setProperty('display', 'none', 'important')
    // target.style.display = 'none !important'
  },
  data () {
    return {
      allScreen: false,
      shop_logo,
      wsUrl: _WEBSOCKET_URL_,
      audio: audio,
      index: 0,
      active: '0-0',
      currentRouterName: '',
      has_back: false, // 是否有返回按钮
      // 邀请码
      invite_code: 0,
      qrcode_show: false,
      webScoketSendData: {
        contorller: 'NewOrder',
        action: 'createConnect',
        params: {
          platfrom: 'bbc',
          shop_id: 249
        }
      }
    }
  },
  created () {
    // IM
    // (() => {
    //   const im = new BD_IM_SDK({
    //
    //   })
    // })()
    if (util.getUserInfo().shop_info) {
      this.webScoketSendData.params.shop_id = util.getUserInfo().shop_info.id
    }
    // 计算路由激活
    this.getActive(this.$router.currentRoute)
    // 获取屏幕高度
    this.height = window.innerHeight
  },
  watch: {
    $route (to, from) {
      this.getActive(to)
    }
  },
  computed: {
    navWidth () {
      return this.allScreen ? 0 : this.subNavList.length > 1 ? `200px` : this.subNavList[0]['key'] ? '200px' : '90px'
    },
    navList () {
      // return this.$routerConfig[0].children.filter(
      //   item => item.meta.nav && util.checkRouterAccess(item)
      // )
      return this.$routerConfig[0].children.filter(item => {
        const {children = []} = item
        if (item.meta.nav && util.checkRouterAccess(item)) {
          return children.filter(ii => ii.meta.nav && util.checkRouterAccess(ii)).length
        }
      })
    },
    subNavList () {
      let i = 0
      const children = this.navList[this.index].children.reduce(
        (container, item) => {
          if (item.meta.nav && util.checkRouterAccess(item)) {
            item.INDEX = i++
            container.push(item)
          }
          return container
        }, []
      )

      const group = this.navList[this.index].meta.group || {}
      const groupArray = Object.keys(group).map(item => {
        return {
          key: item,
          value: group[item],
          children: children.reduce((container, child) => {
            const {meta: {groupBy}} = child
            if (groupBy === item) {
              child.check = true
              container.push(child)
            }
            return container
          }, [])
        }
      })
      const result = [...groupArray, ...children.filter(item => !item.check)]
      return result
    },
    ac1 () {
      return this.active.split('-')[0]
    },
    ac2 () {
      return this.active.split('-')[1]
    }
  },
  methods: {
    // 來自子组件
    fromSide (shop_info) {
      this.invite_code = shop_info.invite_code
    },
    webScoketOrder (data) {
      // 查询订单webscoket 接受方
      // 有新订单了
      data = JSON.parse(data)
      if (data.data === '有新订单了') {
        this.$refs.audio.play()
        OrderBus.$emit('newOrder')
        this.$notify({
          title: '提示',
          message: '您有新的订单',
          position: 'bottom-right',
          type: 'success',
          duration: 0,
          onClick: () => {
            Notification.closeAll()
            this.$refs.audio.pause()
            this.$router.push('/order/list')
          },
          onClose: () => {
            this.$refs.audio.pause()
          }
        })
      }
    },
    async getNewTip () {
      const {err, data} = await this.$service.orderNewTime()
      if (err) return
      const res = data.data
      let new_order_time = res.create_time

      let orderTime = sessionStorage.getItem('orderTime')

      if (!(orderTime > 0)) {
        sessionStorage.setItem('orderTime', new_order_time)
        return
      }
      if (new_order_time > orderTime) {
        sessionStorage.setItem('orderTime', new_order_time)
        this.$refs.audio.play()
        OrderBus.$emit('newOrder')
        this.$notify({
          title: '提示',
          message: '您有新的订单',
          position: 'bottom-right',
          type: 'success',
          duration: 3000,
          onClick: () => {
            this.$router.push('/order/list')
          }
        })
      }
    },
    click (key) {
      this.index = key
    },
    getActive (route) {
      const {path, meta} = route
      const arr = path.split('/').filter(item => item)
      let active1 = 0,
        active2 = 0
      const nav1 = this.navList.find((item, index) => {
        if (item.name === arr[0]) {
          active1 = index
          return true
        } else {
          return false
        }
      })
      if (nav1) {
        nav1.children.filter(item => item.meta.nav).find((item, index) => {
          if (item.name === arr[1]) {
            active2 = index
            return true
          } else {
            return false
          }
        })
      }
      this.index = active1
      this.active = `${active1}-${active2}`
      this.has_back = !meta.nav
      this.currentRouterName = meta.title
    }
  }
}
</script>
<style scoped>
  .aside {
    overflow: hidden;
    transition: .2s;
  }

  #breadcrumb {
    color: #1c8fef;
    height: 45px;
    line-height: 45px;
    background: #fff;
    /*border: 1px solid #eee;*/
  }

  #breadcrumb > p {
    margin-left: 10px;
    margin-right: 5px;
    height: 16px;
    width: 4px;
    background: #1c8fef;
    float: left;
    margin-top: 16px;
  }

  .go-back {
    float: right;
    cursor: pointer;
    margin-top: 9px;
  }

  .main {
    overflow-x: hidden;
    padding: 0 8px;
    font-size: 14px;
    box-sizing: border-box;
    position: relative;
  }

  /*左侧导航*/
  .nav-left-container {
    background-color: #333;
    width: 90px;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    float: left;
    font-size: 14px;
    position: relative;
  }

  /*logo*/
  .left-logo {
    height: 63px;
    overflow: hidden;
    padding-top: 6px;
    box-sizing: border-box;
  }

  .left-logo img {
    width: 50px;
    height: 50px;
  }

  .nav-left-container .left-item {
    color: #d0d0d0;
    height: 36px;
    line-height: 36px;
    margin-bottom: 14px;
    cursor: pointer;
  }

  .left-item:hover {
    color: #fff;
  }

  .nav-left-container .active {
    background-color: #3a8ee6;
    color: #fff;
  }

  /*右侧导航*/
  .nav-right-container {
    background-color: #fff;
    width: 110px;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
    float: left;
    color: #333;
    padding: 0 10px;
    font-size: 14px;
  }

  .nav-right-container .right-title-item {
    border-bottom: 1px solid #f2f2f2;
    height: 35px;
    line-height: 35px;
    color: #a5a5a5;
  }

  .nav-right-container .right-item {
    text-align: left;
    color: #333;
    cursor: pointer;
    padding: 5px 0;
    margin: 10px 0;
    border-radius: 2px;
  }

  .right-item:hover {
    color: #3a3a3a;
  }

  .nav-right-container .active {
    color: #3a3a3a;
    background-color: #f2f7ff;
  }
</style>
