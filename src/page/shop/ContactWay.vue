<template>
  <div class="shop" >
    <slot name="breadcrumb"></slot>
    <div class="shopmain">
      <contact-header v-if="$checkActionAccess($ACCESS.CONTACT_ADD)"></contact-header>
      <contact-list></contact-list>
    </div>
  </div>
</template>

<script>
import contactHeader from './ContactHeader.vue'
import contactList from './ContactList.vue'

export default {
  components: {
    contactHeader,
    contactList
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
  .shopmain {
  }
</style>
