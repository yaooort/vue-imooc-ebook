<template>
  <div class="shelf-title">
    <div class="shelf-title-text-wrapper">
      <span class="shelf-title-text">{{$t('shelf.title')}}</span>
      <span class="shelf-title-sub-text">{{selectedText}}</span>
    </div>
    <div class="shelf-title-btn-wrapper shelf-title-left">
      <span class="shef-title-btn-text">{{$t('shelf.clearCache')}}</span>
    </div>
    <div class="shelf-title-btn-wrapper shelf-title-right">
      <span class="shef-title-btn-text">{{$t('shelf.edit')}}</span>
    </div>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'

  export default {
    name: 'ShelfTitle',
    mixins: [storeShelfMixin],
    computed: {
      selectedText () {
        return this.$t('shelf.selectBook')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-title {
    position: relative;
    width: 100%;
    height: px2rem(42);
    background: white;

    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;

      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }

      .shelf-title-sub-text {
        font-size: px2rem(10);
        color: #333;
      }
    }

    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      height: 100%;
      @include center;

      .shef-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }

      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }

      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);
      }
    }
  }
</style>
