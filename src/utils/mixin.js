import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { getBookmark, saveLocation, getBookShelf, saveBookShelf } from './localStorage'
import { gotoBookDetail, appendAddToShelf, removeAddFromShelf, computeId } from './store'
import { shelf } from '../api/store'

export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    showBookDetail (book) {
      gotoBookDetail(this, book)
    },
    getShelfList () {
      let shelfList = getBookShelf()
      if (!shelfList) {
        shelf().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            shelfList = appendAddToShelf(response.data.bookList)
            saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        })
      } else {
        return this.setShelfList(shelfList)
      }
    },
    getCategoryList (title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },
    moveOutOfGroup (complete) {
      this.setShelfList(this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) {
          book.itemList = book.itemList.filter(subBook => !subBook.selected)
        }
        return book
      })).then(() => {
        let list = removeAddFromShelf(this.shelfList)
        list = [].concat(list, ...this.shelfSelected)
        list = appendAddToShelf(list)
        list = computeId(list)
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (complete) complete()
        })
      })
    }
  }
}

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisibile'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisibile'
    ]),
    showBookDetail (book) {
      gotoBookDetail(this, book)
    }
  }
}

export const ebookMixin = {
  computed: {
    ...mapGetters(
      [
        'fileName',
        'menuVisible',
        'settingVisible',
        'defaultFontSize',
        'defaultFontFamily',
        'fontFamilyVisible',
        'defaultTheme',
        'bookAvailable',
        'progress',
        'section',
        'isPaginating',
        'currentBook',
        'navigation',
        'cover',
        'metadata',
        'paginate',
        'pagelist',
        'offsetY',
        'isBookmark',
        'bookHref'
      ]),
    themeList () {
      return themeList(this)
    },
    getSelectionName () {
      // if (this.section) {
      //   const sectionInfo = this.currentBook.section(this.section)
      //   console.log(this.bookHref)
      //   if (sectionInfo && sectionInfo.href) {
      if (this.bookHref && this.currentBook.navigation) {
        const navigationInfo = this.currentBook.navigation.get(this.bookHref)
        if (navigationInfo && navigationInfo.label) {
          return navigationInfo.label
        }
      }
      //   }
      // }
      return ''
    }
  },
  methods: {
    ...mapActions(
      [
        'setFileName',
        'setSettingVisible',
        'setDefaultFontSize',
        'setCurrentBook',
        'setFontFamilyVisible',
        'setDefaultFontFamily',
        'setMenuVisible',
        'setDefaultTheme',
        'setBookAvailable',
        'setProgress',
        'setSection',
        'setIsPaginating',
        'setNavigation',
        'setCover',
        'setMetadata',
        'setPaginate',
        'setPagelist',
        'setOffsetY',
        'setIsBookmark',
        'setBookHref'
      ]
    ),
    initGlobalStyle () {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(process.env.VUE_APP_RES_URL + 'theme/theme_default.css')
          break
        case 'Gold':
          addCss(process.env.VUE_APP_RES_URL + 'theme/theme_gold.css')
          break
        case 'Eye':
          addCss(process.env.VUE_APP_RES_URL + 'theme/theme_eye.css')
          break
        case 'Night':
          addCss(process.env.VUE_APP_RES_URL + 'theme/theme_night.css')
          break
        default:
          addCss(process.env.VUE_APP_RES_URL + 'theme/theme_default.css')
          break
      }
    },
    refreshLocation () {
      const location = this.currentBook.rendition.currentLocation()
      if (!location || !location.start) {
        return
      }
      this.setBookHref(location.start.href)
      // 滑动进度保持章节随之改变
      this.setSection(location.start.index)
      //  切换章节时进度条随之改变
      const progress = this.currentBook.locations.percentageFromCfi(location.start.cfi)
      this.setProgress(Math.floor(progress * 100))
      saveLocation(this.fileName, location.start.cfi)
      const bookmark = getBookmark(this.fileName)
      // console.table(bookmark)
      if (bookmark) {
        if (bookmark.some(item => item.cfi === location.start.cfi)) {
          this.setIsBookmark(true)
        } else {
          this.setIsBookmark(false)
        }
      } else {
        this.setIsBookmark(false)
      }
    },
    display (target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    hideTitleAndMenu () {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    getReadTimeText () {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}
