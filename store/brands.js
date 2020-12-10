
export const actions = {
  async findAllBrands({commit}, {page = 1, limit = 30}) {
    try {
      return await this.$axios.$get(`api/menu/brands?page=${page}&limit=${process.env.limit}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async searchBrands({commit}, text) {
    try {
      return await this.$axios.$get(`api/menu/brands?search=${text}`, {progress: false})
    } catch (error) {
      commit('setError',error, { root: true })
      throw error
    }
  },
  async createBrand({commit}, {name, photo}) {
    try {
      const fd = new FormData()
      fd.append('name', name)
      fd.append('image',photo, photo.name)

      return await this.$axios.$post('api/menu/brands', fd)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findById({commit}, id) {
    try {
      return await this.$axios.$get(`api/menu/brands/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async updateById({commit}, {id, name, image}) {
    try {
      if (!image) {
        return await this.$axios.$put(`api/menu/brands/${id}`,{name})
      }
      else {
        const fd = new FormData()
        fd.append('name', name)
        fd.append('image', image, image.name)
        return await this.$axios.$put(`api/menu/brands/${id}`, fd)
      }
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async deleteById({commit}, id) {
    try {
      return await this.$axios.$delete(`api/menu/brands/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  }
}
