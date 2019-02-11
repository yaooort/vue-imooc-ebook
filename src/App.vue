<template>
  <div id="app">
    <span class="text">你好，七月abcdABCD</span>
    <router-view/>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      // 计算属性，将test注入进this
      ...mapGetters(['test'])
    },
    mounted () {
      this.$store.dispatch('setTest', 77).then(() => {
        console.log(this.test)
      })
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })
</script>
<style lang="scss" scoped>
  @import "./assets/styles/global";

  .text {
    font-family: "Days One";
    font-size: px2rem(20);
    color: orange;
  }
</style>
