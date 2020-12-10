export const actions = {
  async getAllMessages({commit}) {
    try {
      return await this.$axios.$get('api/send_message')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async createMessage({commit}, form) {
    try {
      const fd = new FormData()
      fd.append('date', form.date)
      fd.append('title', form.title)
      fd.append('title_ru', form.title_ru)
      fd.append('message', form.message)
      fd.append('message_ru', form.message_ru)
      fd.append('image', form.image, form.image.name)
      return await this.$axios.$post('api/send_message', fd)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findById({commit}, id) {
    try {
      return await this.$axios.$get(`api/send_message/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async deleteById({commit}, id) {
    try {
      return await this.$axios.$delete(`api/send_message/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async updateById({commit}, {id, formData}) {
    try {
      return await this.$axios.$put(`api/send_message/${id}`, formData)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async sendNow({commit}, form) {
    try {
      return await this.$axios.$post('api/send_message/send', form)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
}
