<template>
  <div class="store-shelf">
    <shelf-title/>
    <scroll class="store-shelf-scroll-wrapper" :top="0">
      <shelf-search></shelf-search>
    </scroll>
  </div>
</template>

<script>
  // <!--书架页面-->
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import { storeShelfMixin } from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import ShelfSearch from '../../components/shelf/ShelfSearch'
  import { shelf } from '../../api/store'

  export default {
    name: 'StoreShelf',
    mixins: [storeShelfMixin],
    components: { ShelfSearch, Scroll, ShelfTitle },
    methods: {
      getShelfList () {
        shelf().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            this.setShelfList(response.data.bookList)
          }
        })
      }
    },
    mounted () {
      this.getShelfList()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .store-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;

    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
  }
</style>
