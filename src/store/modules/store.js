const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisibile: false
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY (state, offsetY) {
      state.hotSearchOffsetY = offsetY
    },
    SET_FLAP_CARD_VISIBILE (state, flapCardVisibile) {
      state.flapCardVisibile = flapCardVisibile
    }
  }
}
export default store
