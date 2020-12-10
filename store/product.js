export const actions = {
  async createProduct({ commit }, formData) {
    try {
      return await this.$axios.$post("api/menu/product", formData);
    } catch (error) {
      commit("setError", error, { root: true });
      throw error;
    }
  },

  async findAllProducts({ commit }, { page = 1 }) {
    try {
      return await this.$axios.$get(
        `api/menu/product?page=${page}&limit=${process.env.limit}`
      );
    } catch (error) {
      commit("setError", error, { root: true });
      throw error;
    }
  },

  async searchProducts({ commit }, text) {
    try {
      return await this.$axios.$get(`api/menu/product?search=${text}`, {
        progress: false
      });
    } catch (error) {
      commit("setError", error, { root: true });
      throw error;
    }
  },

  async findAllProductsWithoutPagination({ commit }) {
    try {
      return await this.$axios.$get(`api/menu/product`);
    } catch (error) {
      commit("setError", error, { root: true });
      throw error;
    }
  },

  async findProductById({ commit }, id) {
    try {
      return await this.$axios.$get(`api/menu/product/${id}`);
    } catch (error) {
      commit("setError", error, { root: true });
      throw error;
    }
  },

  async updateProductById({ commit }, { id, ...formData }) {
    try {
      return await this.$axios.$put(`api/menu/product/${id}`, formData);
    } catch (error) {
      commit("setError", error, { root: true });
      throw error;
    }
  },

  async hideProductById({ commit }, { id, hide }) {
    try {
      return await this.$axios.$put(`api/menu/product/hide/${id}`, { hide });
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },

  async delteProductById({ commit }, id) {
    try {
      return await this.$axios.$delete(`api/menu/product/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  }
};
