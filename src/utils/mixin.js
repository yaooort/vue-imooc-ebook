import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { saveLocation } from './localStorage'

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
        'isBookmark'
      ]
    ),
    themeList () {
      return themeList(this)
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
        'setIsBookmark'
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
      // 滑动进度保持章节随之改变
      if (location.start.index) {
        this.setSection(location.start.index)
      }
      //  切换章节时进度条随之改变
      const progress = this.currentBook.locations.percentageFromCfi(location.start.cfi)
      this.setProgress(Math.floor(progress * 100))
      saveLocation(this.filename, location.start.cfi)
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
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.filename))
    }
  }
}
