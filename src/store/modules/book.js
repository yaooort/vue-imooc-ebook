const book = {
  state: {
    fileName: '',
    meunVisible: false
  },
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENUVISIBLE': (state, meunVisible) => {
      state.meunVisible = meunVisible
    }
  }
}

export default book
