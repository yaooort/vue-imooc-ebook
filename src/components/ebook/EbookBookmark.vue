<template>
  <div class="ebook-bookmark">
    <div class="ebook-bookmark-text-warpper">
      <div class="ebook-bookmark-down-warpper">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-warpper">
      <bookmark :color="WHITE"></bookmark>
    </div>
  </div>
</template>

<script>
  import Bookmark from '../common/Bookmark'
  const BLUE = '#346CBC'
  const WHITE = '#FFF'
  export default {
    name: 'EbookBookmark',
    components: {
      Bookmark
    },
    data () {
      return {
        text: this.$t('book.pulldownAddMark')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    width: 100%;
    z-index: 200;
    height: px2rem(35);

    .ebook-bookmark-text-warpper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;

      .ebook-bookmark-down-warpper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center
      }

      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }

    .ebook-bookmark-icon-warpper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
