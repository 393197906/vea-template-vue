<template>
  <div>
    <img
      src="@/assets/logo.png"
      alt=""
    >
    <h1>main</h1>
    <router-link to="/test">
      go test
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    metaInfo: {
      title: '我是首页'
    }
  }
</script>

<style scoped>

</style>
