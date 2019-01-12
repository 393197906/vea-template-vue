<template>
  <div>
    <!--
      @webScoketExpFn  监控数据返回导出方法
      :webScoketUrl    监控地址
      :webScoketSendData 发送数据

      调用方式
      <webSocket
            webScoketUrl="ws://113.209.24.23:9502"
            @webScoketExpFn="webScoketOrder"
            :webScoketSendData="webScoketSendData">
      </webSocket>
    -->
  </div>
</template>

<script>
export default {
  name: 'ws',
  data () {
    return {}
  },
  props: {
    webScoketUrl: {
      type: String,
      required: true
    },
    webScoketSendData: {
      type: Object
    }
  },
  methods: {
    webScoket () {
      var webSkData = JSON.stringify(this.webScoketSendData)
      var That = this
      var ws = new WebSocket(this.webScoketUrl)
      ws.onopen = function (evt) {
        // console.log('打开webScoket连接')
        // 传入参数
        ws.send(webSkData)
      }

      ws.onmessage = function (evt) {
        That.$emit('webScoketExpFn', evt.data)
        // ws.close() // 关闭连接
      }

      ws.onclose = function (evt) {
        // console.log('与服务器断开连接')
      }
    }
  },
  created () {
    this.webScoket()
  }
}
</script>
