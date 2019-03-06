<template>
  <div class="shelf-item" :class="{'shelf-item-shadow':this.data.type!==3}" @click="onItemClick">
    <component class="shelf-item-component" :class="{'isEdit': isEditMode && data.type === 2}" :is="item" :data="data"/>
    <div class="icon-selected" :class="{'isSelected':data.selected}" v-show="isEditMode && data.type === 1"></div>
  </div>
</template>

<script>
  import { storeShelfMixin, storeHomeMixin } from '../../utils/mixin'
  import ShelfItemBook from './ShelfItemBook'
  import ShelfItemCategory from './ShelfItemCategory'
  import ShelfItemAdd from './ShelfItemAdd'
  import { gotoStoreHome } from '../../utils/store'

  export default {
    name: 'ShelfItem',
    components: { ShelfItemAdd, ShelfItemCategory, ShelfItemBook },
    mixins: [storeShelfMixin, storeHomeMixin],
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
    },
    methods: {
      onItemClick () {
        if (this.isEditMode) {
          this.data.selected = !this.data.selected
          if (this.data.selected) {
            this.shelfSelected.pushWithOutDuplicate(this.data)
          } else {
            this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
          }
        } else {
          switch (this.data.type) {
            case 1:
              this.showBookDetail(this.data)
              break
            case 2:
              this.$router.push(
                {
                  path: '/store/category',
                  query: {
                    title: this.data.title
                  }
                }
              )
              break
            case 3:
              gotoStoreHome(this)
              break
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-item {
    position: relative;
    width: 100%;
    height: 100%;

    &.shelf-item-shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
    }

    .shelf-item-component {
      opacity: 1;

      &.isEdit {
        opacity: 0.5;
      }
    }

    .icon-selected {
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0, 0, 0, 0.5);

      &.isSelected {
        color: $color-blue;
      }
    }
  }
</style>
