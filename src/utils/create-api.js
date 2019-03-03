import CreateApi from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/common/Toast'
import Popup from '../components/common/Popup'

Vue.use(CreateApi)
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.mixin({
  methods: {
    toast (settings) {
      return this.$createToast({
        $props: settings
      })
    },
    popup (settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    simpleToast (text) {
      const toast = this.toast({ text: text })
      toast.show()
      toast.updateText(text)
    }
  }
})
