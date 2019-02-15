<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hidePopup">
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-item" v-for="(item, index) in fontFamilyList" :key="index" @click="setFontFamily(item)">
          <div class="ebook-popup-item-text" :class="{'selected':isSelected(item)}">{{item.font}}</div>
          <div class="ebook-popup-item-check" v-if="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { FONT_FAMILY } from '../../utils/book'
  import { ebookMixin } from '../../utils/mixin'
  import { saveFontFamily } from '../../utils/localStorage'

  export default {
    name: 'EbookSettingFontPopup',
    mixins: [ebookMixin],
    data () {
      return {
        fontFamilyList: FONT_FAMILY
      }
    },
    methods: {
      hidePopup () {
        this.setFontFamilyVisible(false)
      },
      isSelected (item) {
        return this.defaultFontFamily === item.font
      },
      setFontFamily (item) {
        this.setDefaultFontFamily(item.font)
        saveFontFamily(this.fileName, item.font)
        if (item.font === 'Default') {
          this.currentBook.rendition.themes.font('Times New Roman')
        } else {
          this.currentBook.rendition.themes.font(item.font)
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-popup-list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 300;
    width: 100%;
    background: white;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);

    .ebook-popup-title {
      position: relative;
      padding: px2rem(15);
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #b8b9bb;
      text-align: center;
      @include center;

      .ebook-popup-title-icon {
        position: absolute;
        top: 0;
        left: px2rem(15);
        font-size: px2rem(16);
        font-weight: bold;
        height: 100%;
        @include center;
      }

      .ebook-popup-title-text {
        font-size: px2rem(14);
        font-weight: bold;
      }
    }

    .ebook-popup-list-wrapper {
      .ebook-popup-item {
        display: flex;
        padding: px2rem(15);

        .ebook-popup-item-text {
          flex: 1;
          font-size: px2rem(14);
          text-align: left;

          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }

        .ebook-popup-item-check {
          flex: 1;
          font-size: px2rem(16);
          text-align: right;
          font-weight: bold;
          color: #346cb9;
        }
      }
    }
  }
</style>
