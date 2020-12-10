export const state = () => ({
  showSettings: false,
  fixedHeader: false,
  sidebarLogo: false
})

export const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

export const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export const getters = {
  showSettings: state => state.showSettings,
  fixedHeader: state => state.fixedHeader,
  sidebarLogo: state => state.sidebarLogo
}
