<template>
  <div class="store-shelf">
    <shelf-title/>
  </div>
</template>

<script>
  // <!--书架页面-->
  import ShelfTitle from '../../components/shelf/ShelfTitle'

  export default {
    name: 'StoreShelf',
    components: { ShelfTitle }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .store-shelf {
    width: 100%;
    height: 100%;
    background: wheat;
  }
</style>
