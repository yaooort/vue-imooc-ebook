<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask"
         @click="onMaskClick"
         @touchmove="move"
         @touchend="moveend"
         @mousedown.left="onMouseEnter"
         @mousemove="onMouseMove"
         @mouseup="onMouseUp"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { flatten } from '../../utils/book'
  import { getLocalForage } from '../../utils/localForage'
  import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize,
    getTheme,
    saveTheme,
    getLocation
  } from '../../utils/localStorage'
  import Epub from 'epubjs'

  global.ePub = Epub
  export default {
    mixins: [ebookMixin],
    methods: {
      onMouseEnter (event) {
        this.mouseState = 1
        this.mouseStartTime = event.timeStamp
        // 禁止事件继续传播
        event.preventDefault()
        event.stopPropagation()
      },
      onMouseMove (event) {
        if (this.mouseState === 1) {
          this.mouseState = 2
        } else if (this.mouseState === 2) {
          let offsetY = 0
          if (this.firstOffsetY) {
            offsetY = event.clientY - this.firstOffsetY
            this.setOffsetY(offsetY)
          } else {
            this.firstOffsetY = event.clientY
          }
        }
        event.preventDefault()
        event.stopPropagation()
      },
      onMouseUp (event) {
        if (this.mouseState === 2) {
          this.setOffsetY(0)
          this.firstOffsetY = null
          this.mouseState = 3
        } else {
          this.mouseState = 4
        }
        const time = event.timeStamp - this.mouseStartTime
        if (time < 200) {
          this.mouseState = 4
        }
        event.preventDefault()
        event.stopPropagation()
      },
      onMaskClick (event) {
        if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
          return
        }
        //  点击区域的判断
        const offsetX = event.offsetX
        const width = window.innerWidth
        if (offsetX > 0 && offsetX < width * 0.3) {
          //  上一页
          this.prevPage()
        } else if (offsetX > 0 && offsetX > width * 0.7) {
          //  下一页
          this.nextPage()
        } else {
          // 显示设置
          this.toggleTitleAndMenu()
        }
      },
      move (event) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = event.changedTouches[0].clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = event.changedTouches[0].clientY
        }
        // 禁止事件继续传播
        event.preventDefault()
        event.stopPropagation()
      },
      moveend (event) {
        this.setOffsetY(0)
        this.firstOffsetY = null
        // event.preventDefault()
        // event.stopPropagation()
      },
      initEpub (url) {
        this.book = new Epub(url)
        this.setCurrentBook(this.book)
        this.initRenditon()
        // this.initGesture()
        this.registerStyle()
        this.parseBook()
        this.parsePages()
      },
      initRenditon () {
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          method: 'default'
          // flow: 'scrolled'
        })
        const location = getLocation(this.fileName)
        // if(location) {
        this.display(location, () => {
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
      },
      initTheme () {
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme)
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style)
        })
        this.rendition.themes.select(defaultTheme)
      },
      initFontSize () {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.currentBook.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
      },
      initFontFamily () {
        let font = getFontFamily(this.fileName)
        if (!font) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.currentBook.rendition.themes.font(font)
          this.setDefaultFontFamily(font)
        }
      },
      // initGesture () {
      //   //  监听触摸事件开始
      //   this.rendition.on('touchstart', event => {
      //     // 触摸起始X坐标
      //     this.touchStartX = event.changedTouches[0].clientX
      //     // 触摸起始时间
      //     this.touchStartTime = event.timeStamp
      //   })
      //   //  监听触摸事件结束
      //   this.rendition.on('touchend', event => {
      //     const offsetX = event.changedTouches[0].clientX - this.touchStartX
      //     const time = event.timeStamp - this.touchStartTime
      //     if (time < 500 && offsetX > 40) {
      //       //  如果时间小于500毫秒，并且距离大于40 就返回上一页
      //       this.prevPage()
      //     } else if (time < 500 && offsetX < -40) {
      //       // 下一页
      //       this.nextPage()
      //     } else {
      //       this.toggleTitleAndMenu()
      //     }
      //     // 禁止事件继续传播
      //     event.preventDefault()
      //     event.stopPropagation()
      //   })
      //   //  监听触摸事件
      //   this.rendition.on('touchmove', event => {
      //     console.log(event)
      //   })
      // },
      prevPage () {
        //  进入上一页
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation()
          })
          this.hideTitleAndMenu()
        }
      },
      nextPage () {
        // 进入下一页
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation()
          })
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
      registerStyle () {
        this.rendition.hooks.content.register(contents => {
          Promise.all([
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}fonts/daysOne.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}fonts/cabin.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}fonts/montserrat.css`),
              contents.addStylesheet(`${process.env.VUE_APP_RES_URL}fonts/tangerine.css`)
            ]
          ).then(() => {
            // console.log('字体加载完毕')
          })
        })
      },
      parseBook () {
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.setCover(url)
          })
        })
        this.book.loaded.metadata.then(metadata => {
          this.setMetadata(metadata)
        })
        this.book.loaded.navigation.then(navigation => {
          const navItem = flatten(navigation.toc)

          function find (item, level = 0) {
            return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
          }

          navItem.forEach(item => {
            item.level = find(item)
          })
          this.setNavigation(navItem)
        })
      },
      parsePages () {
        this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)).then(locations => {
            // console.table(locations)
            // this.navigation.forEach(nav => {
            //   nav.pagelist = []
            // })
            // locations.forEach(item => {
            //   console.log(item)
            //   // const loc = item.match(/\[(.*)\]!/)[1]
            //   // this.navigation.forEach(nav => {
            //   //   if (nav.href) {
            //   //     const href = nav.href.match(/^(.*)\.[a-zA-Z0-9]{1,}$/)[1]
            //   //     if (href === loc) {
            //   //       nav.pagelist.push(item)
            //   //     }
            //   //   }
            //   // })
            // })
            // console.table(this.navigation)
            this.setBookAvailable(true)
            this.refreshLocation()
          })
        })
      }
    },
    mounted () {
      const bookSplit = this.$route.params.fileName.split('|')
      const fileName = bookSplit[1]
      getLocalForage(fileName, (err, blob) => {
        if (!err && blob) {
          this.setFileName(bookSplit.join('/')).then(() => {
            this.initEpub(blob)
          })
        } else {
          if (bookSplit) {
            this.setFileName(bookSplit.join('/')).then(() => {
              const baseUrl = process.env.VUE_APP_EPUB_URL + '/' + this.fileName + '.epub'
              this.initEpub(baseUrl)
            })
          }
        }
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .read {

    }

    .ebook-reader-mask {
      position: absolute;
      top: 0;
      background: transparent;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
    }
  }
</style>
