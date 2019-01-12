<template>
  <div class="shop">
    <slot name="breadcrumb"></slot>
    <div class="shopmain">
      <carousel-header></carousel-header>
      <carousel-list></carousel-list>
    </div>
  </div>
</template>

<script>
import carouselHeader from './CarouselHeader.vue'
import carouselList from './CarouselList.vue'
export default {
  components: {
    carouselHeader,
    carouselList
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .shopmain{
  }
</style>
