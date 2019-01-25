<template>
  <div>
    <h1>test</h1>
    <router-link to="/">
      go main
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'Test',
    metaInfo: {
      title: '我是测试页'
    },
    created () {
      this.items = [7, 8, 9]
      setTimeout(() => {
        this.items = [1, 2, 3, 4, 5, 6, 7, 8]
      }, 500)
    },
    data () {
      return {
        items: [1, 2, 3]
      }
    }
  }
</script>

<style scoped>
  .test{
    background-color: yellow;
  }
</style>
