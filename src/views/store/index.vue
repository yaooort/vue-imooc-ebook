<template>
  <div class="store">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'index'
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../assets/styles/global";
  .store{
    background: white;
    width: 100%;
    height: 100%;
  }
</style>
