<template>
    <HeaderBlock msg="HeaderBlock"/>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import HeaderBlock from '@/components/HeaderBlock.vue';

  @Component({
    components: {
      HeaderBlock
    },
  })
  export default class Home extends Vue {
  }
</script>

<style lang="scss">

</style>
