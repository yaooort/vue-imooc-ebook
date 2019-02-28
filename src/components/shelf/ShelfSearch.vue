<template>
  <div class="shelf-search-wrapper" :class="{'search-top':ifInputClicked,'hide-shadow':ifHideShadow}">
    <div class="shelf-search" :class="{'search-top':ifInputClicked}">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input type="text" class="search-input"
                 :placeholder="$t('shelf.search')"
                 @click="onSearchClick"
                 v-model="searchText">
        </div>
        <div class="icon-clear-wrapper" v-if="searchText.length>0" @click="clearInput">
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <div class="icon-locale-wrapper" v-if="!ifInputClicked" @click="switchLocale">
        <span class="icon-cn icon" v-if="lang==='cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
        <span class="cancel-text">{{$t('shelf.cancel')}}</span>
      </div>
    </div>
    <transition name="shelf-tab-slide-up">
      <div class="shelf-search-tab-wrapper" v-if="ifInputClicked">
        <div class="shelf-search-tab-item" v-for="(item) in tabs" :key="item.id" @click="clickTabItem(item.id)">
          <span class="shelf-search-tab-text" :class="{'is-selected':item.id===selectedTab}">{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { setLocalStorage } from '../../utils/localStorage'
  import { storeShelfMixin } from '../../utils/mixin'

  export default {
    name: 'ShelfSearch',
    mixins: [storeShelfMixin],
    data () {
      return {
        ifHideShadow: true,
        ifInputClicked: false,
        searchText: '',
        selectedTab: 1
      }
    },
    watch: {
      offsetY (offsetY) {
        if (offsetY > 0 && this.ifInputClicked) {
          this.ifHideShadow = false
        } else {
          this.ifHideShadow = true
        }
      }
    },
    computed: {
      lang () {
        return this.$i18n.locale
      },
      tabs () {
        return [
          {
            id: 1,
            text: this.$t('shelf.default')
          },
          {
            id: 2,
            text: this.$t('shelf.progress')
          },
          {
            id: 3,
            text: this.$t('shelf.purchase')
          }
        ]
      }
    },
    methods: {
      clickTabItem (id) {
        this.selectedTab = id
      },
      clearInput () {
        this.searchText = ''
      },
      switchLocale () {
        if (this.lang === 'en') {
          this.$i18n.locale = 'cn'
        } else {
          this.$i18n.locale = 'en'
        }
        setLocalStorage('locale', this.$i18n.locale)
      },
      onSearchClick () {
        this.ifInputClicked = true
        this.setShelfTitleVisible(false)
      },
      onCancelClick () {
        this.ifInputClicked = false
        this.setShelfTitleVisible(true)
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-search-wrapper {
    position: relative;
    z-index: 105;
    width: 100%;
    height: px2rem(94);
    font-size: px2rem(16);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);

    &.hide-shadow {
      box-shadow: none;
    }

    &.search-top {
      position: fixed;
      left: 0;
      top: 0;
    }

    .shelf-search {
      position: absolute;
      top: px2rem(42);
      left: 0;
      z-index: 105;
      width: 100%;
      height: px2rem(52);
      display: flex;
      transition: top $animationTime linear;

      &.search-top {
        top: 0;
      }

      .search-wrapper {
        flex: 1;
        display: flex;
        margin: px2rem(8) 0 px2rem(8) px2rem(10);
        border: px2rem(1) solid #ccc;
        border-radius: px2rem(3);
        box-sizing: border-box;

        .icon-search-wrapper {
          flex: 0 0 px2rem(22);
          @include right;

          .icon-search {
            font-size: px2rem(12);

          }
        }

        .search-input-wrapper {
          flex: 1;
          padding: 0 px2rem(10);
          box-sizing: border-box;
          @include center;

          .search-input {
            width: 100%;
            font-size: px2rem(14);
            border: none;
            color: #333;

            &:focus {
              outline: none;
            }

            &::-webkit-input-placeholder {
              font-size: px2rem(14);
              color: #ccc;
            }
          }
        }

        .icon-clear-wrapper {
          flex: 0 0 px2rem(24);
          @include left;

          .icon-close-circle-fill {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }

      .icon-locale-wrapper {
        flex: 0 0 px2rem(55);
        @include center;

        .icon-cn, .icon-en {
          font-size: px2rem(24);
          color: #666;
        }
      }

      .cancel-btn-wrapper {
        flex: 0 0 px2rem(55);
        @include center;

        .cancel-text {
          font-size: px2rem(14);
          color: $color-blue;
        }
      }
    }

    .shelf-search-tab-wrapper {
      position: absolute;
      top: px2rem(52);
      left: 0;
      width: 100%;
      z-index: 105;
      display: flex;
      height: px2rem(42);

      .shelf-search-tab-item {
        flex: 1;
        @include center;

        .shelf-search-tab-text {
          font-size: px2rem(12);
          color: #999;

          &.is-selected {
            color: $color-blue;
          }
        }
      }
    }
  }
</style>
