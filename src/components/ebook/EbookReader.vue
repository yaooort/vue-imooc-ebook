<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize,
    getTheme,
    saveTheme
  } from '../../utils/localStorage'
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
          this.setFontFamilyVisible(false)
        }
        this.setMenuVisible(!this.menuVisible)
      },
      hideTitleAndMenu () {
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },
      initFontSize () {
        let fontSize = getFontSize(this.filename)
        if (!fontSize) {
          saveFontSize(this.filename, this.defaultFontSize)
        } else {
          this.currentBook.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
      },
      initFontFamily () {
        let font = getFontFamily(this.filename)
        if (!font) {
          saveFontFamily(this.filename, this.defaultFontFamily)
        } else {
          this.currentBook.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
      initTheme () {
        let defaultTheme = getTheme(this.filename)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.filename, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme)
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
      },
      initEpub () {
        const baseUrl = process.env.VUE_APP_RES_URL + 'epub/' + this.fileName + '.epub'
        this.book = new Epub(baseUrl)
        this.setCurrentBook(this.book)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
        })
        this.rendition.display().then(() => {
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
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
        this.rendition.hooks.content.register(contents => {
          Promise.all([
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}fonts/daysOne.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}fonts/cabin.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}fonts/montserrat.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}fonts/tangerine.css`)
            ]
          ).then(() => {
            console.log('字体加载完毕')
          })
        })
        this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.filename) / 16)).then(locations => {
            this.setBookAvailable(true)
          })
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
