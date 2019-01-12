<template>
  <div class="contact-header">
    <router-link to="/shop/contactWay/contactAdd">
      <el-button type="warning" size="small" icon="el-icon-plus">添加联系方式</el-button>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style scoped>
  .contact-header {
    background-color: white;
    height: 55px;
    line-height: 55px;
    padding-left: 10px;
  }
</style>
