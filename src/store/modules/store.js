const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisibile: false,
    isEditMode: false, // 是否进入编辑模式
    shelfList: [], // 书架图书列表
    shelfSelected: [], // 书架图书选中的列表
    shelfTitleVisible: true // 书架标题的显示状态
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY (state, offsetY) {
      state.hotSearchOffsetY = offsetY
    },
    SET_FLAP_CARD_VISIBILE (state, flapCardVisibile) {
      state.flapCardVisibile = flapCardVisibile
    },
    SET_IS_EDIT_MODE (state, isEditMode) {
      state.isEditMode = isEditMode
    },
    SET_SHELF_LIST (state, list) {
      state.shelfList = list
    },
    SET_SHELF_SELECTED (state, selected) {
      state.selected = selected
    },
    SET_SHELF_TITLE_VISIBLE (state, visible) {
      state.shelfTitleVisible = visible
    }
  }
}
export default store
