<template>
  <div class="store-shelf">
    <shelf-title/>
    <scroll class="store-shelf-scroll-wrapper" :top="0" @onScroll="onScroll" ref="scroll" :bottom="scrollBottom">
      <shelf-search></shelf-search>
      <shelf-list/>
    </scroll>
    <shelf-footer/>
  </div>
</template>

<script>
  // <!--书架页面-->
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import { storeShelfMixin } from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import ShelfSearch from '../../components/shelf/ShelfSearch'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'

  export default {
    name: 'StoreShelf',
    mixins: [storeShelfMixin],
    components: { ShelfFooter, ShelfList, ShelfSearch, Scroll, ShelfTitle },
    watch: {
      isEditMode (isEditMode) {
        this.scrollBottom = isEditMode ? 48 : 0
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      }
    },
    data () {
      return {
        scrollBottom: 0
      }
    },
    methods: {
      onScroll (offsetY) {
        this.setOffsetY(offsetY)
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
