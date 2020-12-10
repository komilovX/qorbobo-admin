export const state = () => ({
  categories: []
});

export const mutations = {
  setCategories(state, categories) {
    state.categories = categories;
  }
};

export const actions = {
  async createCategory({ commit }, formData) {
    try {
      return this.$axios.$post("api/menu/category", formData);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async findAllSortCategories({ commit }) {
    try {
      return this.$axios.$get("api/menu/category/sort");
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async findAllCategories({ commit }) {
    try {
      const categories = await this.$axios.$get("api/menu/category");
      commit("setCategories", categories);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async findCategoryById({ commit }, id) {
    try {
      return this.$axios.$get(`api/menu/category/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async updateCategoryById({ commit }, { id, ...formData }) {
    try {
      return this.$axios.$put(`api/menu/category/${id}`, formData);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async hideCategoryById({ commit }, { hide, id }) {
    try {
      return this.$axios.$put(`api/menu/category/hide/${id}`, { hide });
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async deleteCategoryById({ commit }, id) {
    try {
      return this.$axios.$delete(`api/menu/category/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  }
};

export const getters = {
  categories: state => state.categories
};
