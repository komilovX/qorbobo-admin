
export const actions = {
  async findAllDetails({commit}) {
    try {
      return this.$axios.$get('api/storage/supply/details')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findAllSupplies({commit}, {page=1, limit=30}) {
    try {
      return this.$axios.$get(`api/storage/supply?page=${page}&limit=${limit}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findSupplyById({commit}, id) {
    try {
      return this.$axios.$get(`api/storage/supply/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async createSupply({commit}, formData) {
    try {
      return this.$axios.$post('api/storage/supply', formData)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async updateSupplyById ({commit}, {id, formData}) {
    try {
      return this.$axios.$put(`api/storage/supply/${id}`, formData)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async deleteSupplyById ({commit}, id ) {
    try {
      return this.$axios.$put(`api/storage/supply/delete/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async updateLimitById ({commit}, {id, limit}) {
    try {
      return this.$axios.$put(`api/storage/supply/limit/${id}`, {limit})
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async changeResidue ({commit}, products) {
    try {
      return this.$axios.$put(`api/storage/supply/calculations`, {products})
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findAllCalculations({commit}, {page = 1, limit = 30}) {
    try {
      return this.$axios.$get(`api/storage/supply/calculations?page=${page}&limit=${limit}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  }
}
