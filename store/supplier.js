export const actions = {
  async createSupplier({commit}, formData) {
    try {
      return await this.$axios.$post('api/storage/supplier', formData)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findAllSuplliers({commit}) {
    try {
      return await this.$axios.$get('api/storage/supplier')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findSupplierById({commit}, id) {
    try {
      return await this.$axios.$get(`api/storage/supplier/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async updateSupplierById({commit}, form) {
    try {
      return await this.$axios.$put(`api/storage/supplier/${form.id}`, form)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async deleteSupplierById({commit}, id) {
    try {
      return await this.$axios.$put(`api/storage/supplier/delete/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  }
}
