<template>
  <div class="contact-header">
    <el-button type="warning" size="small" @click="toAdd()" icon="el-icon-plus">添加轮播图</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    toAdd () {
      this.$router.push('/sale/Carousel/carouselAdd')
    }
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
