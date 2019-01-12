<template>
  <div class="go-top" v-show="show" @click="goTop">
    <slot>
      <a>↑</a>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'GoTop',
  props: {
    dom: {
      type: String,
      default: 'body'
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    goTop () {
      const dom = document.querySelector(this.dom)
      const intvel = setInterval(() => {
        if (dom.scrollTop <= 0) {
          clearInterval(intvel)
          return
        }
        dom.scrollTop -= 15
      })
    }
  },
  mounted () {
    const dom = document.querySelector(this.dom)
    dom.addEventListener('scroll', () => {
      const top = dom.scrollTop
      this.show = top > 100
    })
  }
}
</script>

<style scoped>
  .go-top {
    position: fixed;
    bottom: 20px;
    right: 40px;
    z-index: 999999;
    cursor: pointer;
  }

  .go-top a {
    display: inline-block;
    font-size: 14px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background-color: #3a8ee6;
    border-radius: 20px;
  }
</style>
