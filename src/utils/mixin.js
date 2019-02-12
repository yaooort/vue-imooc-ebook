import { mapGetters, mapActions } from 'vuex'

export const ebookMixin = {
  computed: {
    ...mapGetters(['fileName', 'meunVisible'])
  },
  methods: {
    ...mapActions(['setFileName', 'setMeunVisible'])
  }
}
