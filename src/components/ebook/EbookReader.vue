<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import Epub from 'epubjs'

  global.ePub = Epub
  export default {
    mixins: [ebookMixin],
    methods: {
      prevPage () {
        //  进入上一页
        if (this.rendition) {
          this.rendition.prev()
          this.hideTitleAndMenu()
        }
      },
      nextPage () {
        // 进入下一页
        if (this.rendition) {
          this.rendition.next()
          this.hideTitleAndMenu()
        }
      },
      toggleTitleAndMenu () {
        // 显示菜单标题
        if (this.menuVisible) {
          this.setSettingVisible(-1)
        }
        this.setMenuVisible(!this.menuVisible)
      },
      hideTitleAndMenu () {
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
      },
      initEpub () {
        const baseUrl = 'http://localhost:8081/epub/' + this.fileName + '.epub'
        this.book = new Epub(baseUrl)
        this.setCurrentBook(this.book)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
        })
        this.rendition.display()
        //  监听触摸事件开始
        this.rendition.on('touchstart', event => {
          // 触摸起始X坐标
          this.touchStartX = event.changedTouches[0].clientX
          // 触摸起始时间
          this.touchStartTime = event.timeStamp
        })
        //  监听触摸事件结束
        this.rendition.on('touchend', event => {
          const offsetX = event.changedTouches[0].clientX - this.touchStartX
          const time = event.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            //  如果时间小于500毫秒，并且距离大于40 就返回上一页
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            // 下一页
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          // 禁止事件继续传播
          event.preventDefault()
          event.stopPropagation()
        })
      }
    },
    mounted () {
      console.log(this.$route.params.fileName)
      this.setFileName(this.$route.params.fileName.split('|').join('/')).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
</style>
