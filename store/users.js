export const actions = {
  async findAllUsers({commit},{page = 1, limit = 30}) {
    try {
      return await this.$axios.$get(`api/users?page=${page}&limit=${limit}`)
    } catch (e) {
      commit('setError', e, {root: true})
    }
  },
  async findAllActiveUsers({commit},{page = 1, limit = 30}) {
    try {
      return await this.$axios.$get(`api/users/active?page=${page}&limit=${limit}`)
    } catch (e) {
      commit('setError', e, {root: true})
    }
  }
}
