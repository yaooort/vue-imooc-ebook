<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper">
        <span class="icon-down" ref="iconDown"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="15" :height="35"></bookmark>
    </div>
  </div>
</template>

<script>
  import { realPx } from '../../utils/utils'
  import Bookmark from '../common/Bookmark'
  import { ebookMixin } from '../../utils/mixin'
  import { getBookmark, saveBookmark } from '../../utils/localStorage'

  const BLUE = '#346CBC'
  const WHITE = '#FFF'
  export default {
    name: 'EbookBookmark',
    components: {
      Bookmark
    },
    mixins: [ebookMixin],
    computed: {
      height () {
        return realPx(35)
      },
      threshold () {
        return realPx(55)
      },
      fixedStyle () {
        return {
          position: 'fixed',
          top: 0,
          right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
        }
      }
    },
    watch: {
      offsetY (v) {
        if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
          return
        }
        if (v >= this.height && v < this.threshold) {
          // 第二状态显示下拉书签图标吸住顶部
          this.beforeThreshold(v)
        } else if (v >= this.threshold) {
          // 改变文字到达第三状态，松手即可添加或删除书签
          this.afterThreshold(v)
        } else if (v > 0 && v < this.height) {
          // 第一状态，什么都没有触发
          this.beforeHeight()
        } else if (v === 0) {
          // 归位
          this.restore()
        }
      },
      isBookmark (isBookmark) {
        if (isBookmark) {
          this.color = BLUE
          this.isFixed = true
        } else {
          this.color = WHITE
          this.isFixed = false
        }
      }
    },
    data () {
      return {
        text: this.$t('book.pulldownAddMark'),
        color: WHITE,
        isFixed: false
      }
    },
    methods: {
      addBookMark () {
        this.bookmark = getBookmark(this.fileName)
        if (!this.bookmark) {
          this.bookmark = []
        }
        const currentLocation = this.currentBook.rendition.currentLocation()
        const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
        const cfiStart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiEnd = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
        const cfiRange = `${cfibase}!,${cfiStart},${cfiEnd})`
        // console.log(cfiRange)
        this.currentBook.getRange(cfiRange).then(range => {
          const text = range.toString().replace(/\s\s/g, '')
          this.bookmark.push({
            cfi: currentLocation.start.cfi,
            text: text
          })
          saveBookmark(this.fileName, this.bookmark)
        })
      },
      removeBookMark () {
        const currentLocation = this.currentBook.rendition.currentLocation()
        const startCfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName)
        if (this.bookmark) {
          saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== startCfi))
          this.setIsBookmark(false)
        }
      },
      restore () {
        setTimeout(() => {
          this.$refs.bookmark.style.top = `${-this.height}px`
          this.$refs.iconDown.style.transform = 'rotate(0deg)'
        }, 200)
        this.setIsBookmark(this.isFixed)
        if (this.isFixed) {
          this.addBookMark()
        } else {
          this.removeBookMark()
        }
      },
      beforeHeight () {
        // 当前页是否为书签
        if (this.isBookmark) {
          this.text = this.$t('book.pulldownDeleteMark')
          this.color = BLUE
          this.isFixed = true
        } else {
          this.text = this.$t('book.pulldownAddMark')
          this.color = WHITE
          this.isFixed = false
        }
      },
      beforeThreshold (v) {
        this.$refs.bookmark.style.top = `${-v}px`
        this.beforeHeight()
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === 'rotate(180deg)') {
          iconDown.style.transform = 'rotate(0deg)'
        }
      },
      afterThreshold (v) {
        this.$refs.bookmark.style.top = `${-v}px`
        // 当前页是否为书签
        if (this.isBookmark) {
          this.text = this.$t('book.releaseDeleteMark')
          this.color = WHITE
          this.isFixed = false
        } else {
          this.text = this.$t('book.releaseAddMark')
          this.color = BLUE
          this.isFixed = true
        }
        const iconDown = this.$refs.iconDown
        if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
          iconDown.style.transform = 'rotate(180deg)'
        }
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
    z-index: 200;
    width: 100%;
    height: px2rem(35);

    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;

      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all 0.2s linear;
        @include center;

        .icon-down {
          transition: all 0.2s linear;
          -webkit-transition: all 0.2s linear;;
        }
      }

      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }

    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
