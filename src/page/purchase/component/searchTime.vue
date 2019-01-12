<template>
    <el-form-item label-width="100px" label="制单时间：">
        <el-date-picker
                v-model="search_time"
                @change="searchTimeChange"
                type="daterange"
                unlink-panels="true"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
        <span
                class="search-time-item"
                :class="matchingTime === 0 ? 'active' : ''"
                @click="dateChoice(0)">今</span>
        <span
                class="search-time-item"
                :class="matchingTime === 1 ? 'active' : ''"
                @click="dateChoice(1)">昨</span>
        <span
                class="search-time-item"
                :class="matchingTime === 7 ? 'active' : ''"
                @click="dateChoice(7)">最近7天</span>
        <span
                class="search-time-item"
                :class="matchingTime === 30 ? 'active' : ''"
                @click="dateChoice(30)">最近30天</span>
    </el-form-item>
</template>

<script>
export default {
  name: 'search-time',
  data () {
    return {
      search_time: null
    }
  },
  methods: {
    searchTimeChange (val) {
      var startTime = 0
      var endTime = 0
      if (val) {
        startTime = val[0].getTime() / 1000
        endTime = val[1].getTime() / 1000
      }
      this.exportTime(startTime, endTime)
    },
    dateChoice (time) {
      // 按天选择按钮触发
      var date = new Date()
      var timeArr = []
      date.setHours(0)
      date.setSeconds(0)
      date.setMinutes(0)
      date.setMilliseconds(0)
      var currentTime = date.getTime() / 1000
      if (time === 0) {
        // 今天
        timeArr = [new Date(currentTime * 1000), new Date(currentTime * 1000)]
        this.exportTime(currentTime, currentTime)
      } else if (time === 1) {
        // 昨天
        timeArr = [new Date((currentTime - 86400) * 1000), new Date((currentTime - 86400) * 1000)]
        this.exportTime((currentTime - 86400), (currentTime - 86400))
      } else if (time === 7) {
        // 最近七天
        timeArr = [new Date((currentTime - (86400 * 6)) * 1000), new Date(currentTime * 1000)]
        this.exportTime((currentTime - (86400 * 6)), currentTime)
      } else if (time === 30) {
        // 最近三十天
        timeArr = [new Date((currentTime - (86400 * 29)) * 1000), new Date(currentTime * 1000)]
        this.exportTime((currentTime - (86400 * 29)), currentTime)
      }
      this.search_time = timeArr
    },
    exportTime (startTime, endTime) {
      endTime += 86399
      this.$emit('searchTimeChange', {
        startTime,
        endTime
      })
    },
    // 清空时间 外部调用
    clearTime () {
      this.search_time = null
    }
  },
  computed: {
    matchingTime () {
      // 选择筛选时间计算属性
      var date = new Date()
      var status = ''
      date.setHours(0)
      date.setSeconds(0)
      date.setMinutes(0)
      date.setMilliseconds(0)
      var currentTime = date.getTime() / 1000
      var searchTime = this.search_time
      // currentTime - (86400 * 6)  // 最近七天
      // currentTime - (86400 * 29)  // 最近30天
      // currentTime - 86400  // 昨天
      // currentTime 当前时间
      if (searchTime) {
        var startTime = searchTime[0].getTime() / 1000
        var endTime = searchTime[1].getTime() / 1000
        if (endTime === currentTime) {
          if (startTime === currentTime - (86400 * 6)) {
            // 最近七天
            status = 7
          } else if (startTime === currentTime - (86400 * 30)) {
            // 最近三十天
            status = 30
          } else if (startTime === currentTime) {
            // 今天
            status = 0
          } else {
            status = ''
          }
        } else {
          var endT = currentTime - 86400
          if (startTime === endT && endTime === endT) {
            // 昨天
            status = 1
          } else {
            status = ''
          }
        }
      } else {
        status = ''
      }
      return status
    }
  }
}
</script>

<style scoped>
    /*
        搜索时间选择
    */
    .search-time-item {
        margin-left: 10px;
        padding: 2px 4px;
        border: 1px solid #e5e5e5;
        cursor: pointer;
        color: #bbb;
        font-size: 12px;
    }
    .search-time-item:hover, .search-time-item.active {
        color: #38f;
        border-color: #38f;
    }
</style>
