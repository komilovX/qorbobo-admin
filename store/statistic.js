export const actions = {
  async fetchByWeek({commit}, week) {
    try {
      let date = new Date(week).toDateString()
      return await this.$axios.$get(`api/statistics?date=${encodeURI(date)}`)
    } catch (e) {
      commit('setError', e, {root: true})
    }
  }
}
