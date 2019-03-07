<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title"/>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            @onScroll="onScroll"
            ref="scroll"
            :bottom="scrollBottom"
            v-if="ifShowList">
      <shelf-list :top="42" :data="shelfCategory.itemList"/>
    </scroll>
    <div class="story-shelf-empty-view" v-else>
      <span>{{$t('shelf.groupNone')}}</span>
    </div>
    <shelf-footer/>
  </div>
</template>

<script>
  // <!--书架页面-->
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import { storeShelfMixin } from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'

  export default {
    name: 'StoreShelf',
    mixins: [storeShelfMixin],
    components: { ShelfFooter, ShelfList, Scroll, ShelfTitle },
    watch: {
      isEditMode (isEditMode) {
        this.scrollBottom = isEditMode ? 48 : 0
        this.$nextTick(() => {
          if (this.$refs.scroll) {
            this.$refs.scroll.refresh()
          }
        })
      }
    },
    data () {
      return {
        scrollBottom: 0
      }
    },
    computed: {
      ifShowList () {
        return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      }
    },
    methods: {
      onScroll (offsetY) {
        this.setOffsetY(offsetY)
      }
    },
    mounted () {
      this.getCategoryList(this.$route.query.title)
      this.setCurrentType(2)
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

    .story-shelf-empty-view {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      font-size: px2rem(14);
      color: #333;
      @include center;
    }
  }
</style>
