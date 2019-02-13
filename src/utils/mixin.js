import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss } from './book'

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
    }
  }
}
