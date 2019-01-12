<template>
  <el-menu :default-active="defaultMenu" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item v-for="item in menuOptions" :key="item.status" :index="item.status">{{item.label}}</el-menu-item>
  </el-menu>
</template>
<script>
export default {
  props: {
    defaultMenu: [String],
    menuOptions: [Array]
  },
  data () {
    return {}
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$emit('stateChange', key)
    }
  }
}
</script>
