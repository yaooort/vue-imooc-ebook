<template>
  <div class="shelf-item shelf-item-shadow">
    <component :is="item" :data="data"/>
  </div>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItemBook from './ShelfItemBook'
  import ShelfItemCategory from './ShelfItemCategory'
  import ShelfItemAdd from './ShelfItemAdd'

  export default {
    name: 'ShelfItem',
    components: { ShelfItemAdd, ShelfItemCategory, ShelfItemBook },
    mixins: [storeShelfMixin],
    props: {
      data: Object
    },
    computed: {
      item () {
        return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
      }
    },
    data () {
      return {
        book: ShelfItemBook,
        category: ShelfItemCategory,
        add: ShelfItemAdd
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-item {
    width: 100%;
    height: 100%;

    &.shelf-item-shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
    }
  }
</style>
