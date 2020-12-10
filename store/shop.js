export const actions = {
  async findAllCarousels({ commit }) {
    try {
      return await this.$axios.$get("api/shop/carusel");
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async createCarousel({ commit }, form) {
    const fd = new FormData();
    fd.append("product_id", form.product_id);
    fd.append("product_name", form.product_name);
    fd.append("image_small", form.image_small, form.image_small.name);
    fd.append("image_large", form.image_large, form.image_large.name);
    try {
      return await this.$axios.$post("api/shop/carusel", fd);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async findCarouselById({ commit }, id) {
    try {
      return await this.$axios.$get(`api/shop/carusel/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async updateCarouselById({ commit }, form) {
    const fd = new FormData();
    fd.append("product_id", form.product_id);
    fd.append("product_name", form.product_name);
    if (form.image) {
      fd.append("image", form.image, form.image.name);
    }
    try {
      return await this.$axios.$put(`api/shop/carusel/${form.id}`, fd);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async deleteCarouselById({ commit }, id) {
    try {
      return await this.$axios.$delete(`api/shop/carusel/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },

  // shop/Categories
  async findAllCategories({ commit }) {
    try {
      return await this.$axios.$get("api/shop/category");
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async createCategory({ commit }, formData) {
    try {
      return await this.$axios.$post("api/shop/category", formData);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async findCategoryById({ commit }, id) {
    try {
      return await this.$axios.$get(`api/shop/category/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async updateCategoryById({ commit }, { id, ...form }) {
    try {
      return await this.$axios.$put(`api/shop/category/${id}`, form);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async deleteCategoryById({ commit }, id) {
    try {
      return await this.$axios.$delete(`api/shop/category/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  }
};
