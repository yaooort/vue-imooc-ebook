<template>
  <div class="shelf-list" :style="{'top':shelfListTop}">
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <shelf-item :data="item" :style="{height: itemHeight}"/>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItem from './ShelfItem'
  import { realPx, px2rem } from '../../utils/utils'

  export default {
    name: 'ShelfList',
    components: { ShelfItem },
    mixins: [storeShelfMixin],
    props: {
      top: {
        type: Number,
        default: 94
      },
      data: Array
    },
    computed: {
      shelfListTop () {
        return px2rem(this.top) + 'rem'
      },
      itemHeight () {
        return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-list {
    position: absolute;
    left: 0;
    z-index: 100;
    width: 100%;

    #shelf-list {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      padding: 0 px2rem(15);
      box-sizing: border-box;

      .shelf-list-item-wrapper {
        flex: 0 0 33.333%;
        width: 33.333%;
        padding: px2rem(15);
        box-sizing: border-box;

        &.list-leave-active {
          display: none;
        }

        &.list-move {
          transition: transform 0.5s;
        }

        .shelf-list-title-wrapper {
          margin-top: px2rem(10);
        }
      }
    }
  }
</style>
