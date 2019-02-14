<template>
  <div class="ebook">
    <ebook-title/>
    <ebook-reader/>
    <ebook-menu/>
  </div>
</template>

<script>
  import EbookReader from '../../components/ebook/EbookReader'
  import EbookTitle from '../../components/ebook/EbookTitle'
  import EbookMenu from '../../components/ebook/EbookMenu'
  import { getReadTime, saveReadTime } from '../../utils/localStorage'
  import { ebookMixin } from '../../utils/mixin'

  export default {
    name: 'index',
    mixins: [ebookMixin],
    components: { EbookReader, EbookTitle, EbookMenu },
    methods: {
      startLoopReadTime () {
        let readTime = getReadTime(this.filename)
        if (!readTime) {
          readTime = 0
        }
        this.task = setInterval(() => {
          readTime++
          if (readTime % 30 === 0) {
            saveReadTime(this.filename, readTime)
          }
        }, 1000)
      }
    },
    mounted () {
      this.startLoopReadTime()
      console.log(this.filename)
    },
    beforeDestroy () {
      if (this.task) {
        clearInterval(this.task)
      }
    }

  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
</style>
