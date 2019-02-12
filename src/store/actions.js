const actions = {
  setFileName: ({ commit }, fileName) => {
    return commit('SET_FILENAME', fileName)
  },
  setMeunVisible: ({ commit }, meunVisible) => {
    return commit('SET_MENUVISIBLE', meunVisible)
  }
}
export default actions
