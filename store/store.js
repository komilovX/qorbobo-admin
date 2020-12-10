export const actions = {
  async createStore({commit}, formData) {
    try {
      return await this.$axios.$post('api/storage/store', formData)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findAllStores({commit}) {
    try {
      return await this.$axios.$get('api/storage/store')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findStoreById({commit}, id) {
    try {
      return await this.$axios.$get(`api/storage/store/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async updateStoreById({commit}, {id, name, address}) {
    try {
      return await this.$axios.$put(`api/storage/store/${id}`, {name, address})
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async deleteStoreById({commit}, id) {
    try {
      return await this.$axios.$put(`api/storage/store/delete/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  }
}
