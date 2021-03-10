export const state = () => ({
  delivers: [],
  loading: false
});

export const mutations = {
  setLoading(state, loading) {
    state.loading = loading;
  },

  setDelivers(state, delivers) {
    state.delivers = delivers;
  },

  setDeliver(state, deliver) {
    state.delivers = state.delivers.concat([deliver]);
  },

  updateDeliver(state, deliver) {
    const index = state.delivers.findIndex(dlvr => dlvr.id == deliver.id);
    if (index != -1) {
      state.delivers = [
        ...state.delivers.slice(0, index),
        deliver,
        ...state.delivers.slice(index + 1)
      ];
    }
  },

  deleteDeliver(state, id) {
    state.delivers = state.delivers.filter(deliver => deliver.id != id);
  }
};

export const actions = {
  async fetchDelivers({ commit }) {
    try {
      commit("setLoading", true);
      const delivers = await this.$axios.$get("api/delivers");
      commit("setDelivers", delivers);
      commit("setLoading", false);
    } catch (error) {
      commit("setLoading", false);
      commit("setError", true, { root: true });
      throw error;
    }
  },
  async createDeliver({ commit }, formData) {
    try {
      commit("setLoading", true);
      const deliver = await this.$axios.$post("api/delivers", formData);
      commit("setDeliver", deliver);
      commit("setLoading", false);
    } catch (error) {
      commit("setLoading", false);
      commit("setError", true, { root: true });
      throw error;
    }
  },
  async updateDeliver({ commit }, { id, ...formData }) {
    try {
      commit("setLoading", true);
      const deliver = await this.$axios.$put(`api/delivers/${id}`, formData);
      commit("updateDeliver", deliver);
      commit("setLoading", false);
    } catch (error) {
      commit("setLoading", false);
      commit("setError", true, { root: true });
      throw error;
    }
  },
  async deleteDeliver({ commit }, id) {
    try {
      commit("setLoading", true);
      await this.$axios.$delete(`api/delivers/${id}`);
      commit("deleteDeliver", id);
      commit("setLoading", false);
    } catch (error) {
      commit("setLoading", false);
      commit("setError", true, { root: true });
      throw error;
    }
  },
  async findDeliverById({ commit }, id) {
    try {
      return await this.$axios.$get(`api/delivers/${id}`);
    } catch (error) {
      commit("setError", true, { root: true });
      throw error;
    }
  },
  async sendToDeliver({ commit }, formData) {
    try {
      return await this.$axios.$post(`api/delivers/sendMessage`, formData);
    } catch (error) {
      commit("setError", true, { root: true });
      throw error;
    }
  }
};

export const getters = {
  delivers: state => state.delivers,
  loading: state => state.loading
};
