export const state = () => ({
  error: null,
  authError: null
})

export const mutations = {
  setError(state, error) {
    state.error = error
  },
  setAuthError(state, error) {
    state.authError = error
  },
  clearError(state) {
    state.error = null
  },
}
export const actions = {
  nuxtClientInit({dispatch}){
    dispatch('auth/autoLogin')
  },
  setAuthError({commit}, data) {
    commit('setAuthError', data)
  }
}

export const getters = {
  error: state => state.error,
  authError: state => state.authError
}
