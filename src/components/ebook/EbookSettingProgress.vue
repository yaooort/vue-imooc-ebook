<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="reader-time-wrapper">
          <span class="reader-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection()">
            <span class="icon-back"></span>
          </div>
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @change="onProgressChange($event.target.value)" @input="onProgressInput($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSelectionName}}</span>
          <span>（{{bookAvailable ? progress + '%' : '加载中...'}}）</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'

  export default {
    name: 'EbookSettingProgress',
    mixins: [ebookMixin],
    computed: {},
    methods: {
      onProgressChange (progress) {
        this.setProgress(progress).then(() => {
          this.disPlayProgress()
          this.updateProgressBg()
        })
      },
      onProgressInput (progress) {
        this.setProgress(progress).then(() => {
          this.updateProgressBg()
        })
      },
      prevSection () {
        // console.log(this.section)
        if (this.section > 0 && this.bookAvailable) {
          this.displaySection(this.section - 1)
        }
      },
      nextSection () {
        if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
          this.displaySection(this.section + 1)
        }
      },
      displaySection (section) {
        this.setSection(section).then(() => {
          const sectionInfo = this.currentBook.section(this.section)
          if (sectionInfo && sectionInfo.href) {
            this.display(sectionInfo.href)
          }
        })
      },
      updateProgressBg () {
        this.$refs.progress.style.cssText = `background-size:${this.progress}% 100% !important`
      },
      disPlayProgress () {
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
        this.display(cfi)
      }
    },
    updated () {
      this.updateProgressBg()
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 101;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);

    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;

      .reader-time-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        font-size: px2rem(12);
        @include center;
      }

      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;

        .progress-icon-wrapper {
          font-size: px2rem(20);
        }

        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          margin: 0 px2rem(10);

          &:focus {
            outline: none;
          }

          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            border: px2rem(1) solid #ddd;
          }
        }
      }

      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(10);
        width: 100%;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        font-size: px2rem(12);
        @include center;

        &.progress-section-text {
          @include ellipsis;
        }
      }
    }
  }
</style>
