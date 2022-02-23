export const state = () => ({
  orders: [],
  ordersLength: 0
});

export const mutations = {
  setOrder(state, orders) {
    (state.orders = orders), (state.ordersLength = orders.length);
  }
};

export const actions = {
  async getAllOrder({ commit }) {
    try {
      return this.$axios.$get("api/orders");
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async getAllCanceledOrders({ commit }, { page, limit }) {
    try {
      return this.$axios.$get(
        `api/orders/canceled?page=${page}&limit=${limit}`
      );
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async getAllDeliveredOrders({ commit }, { page, limit }) {
    try {
      return this.$axios.$get(
        `api/orders/delivered?page=${page}&limit=${limit}`
      );
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },

  async getOrderReportByProduct({ commit }, { dateFrom, dateTo }) {
    try {
      return this.$axios.$get(
        `api/orders/get-product-report?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },

  async getOrderReportByClient({ commit }, { dateFrom, dateTo }) {
    try {
      return this.$axios.$get(
        `api/orders/get-client-report?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },

  async getOrderReports({ commit }, { dateFrom, dateTo }) {
    try {
      return this.$axios.$get(
        `api/orders/get-order-report?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },

  async changeStatus({ commit }, { id, status }) {
    try {
      return this.$axios.$put(`api/orders/${id}`, { status });
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },

  async changeToDelivered({ commit }, id) {
    try {
      return this.$axios.$put(`api/orders/orderSended/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },

  async acceptOrder({ commit }, { id, ...formData }) {
    try {
      return this.$axios.$put(`api/orders/accept/${id}`, formData);
    } catch (e) {
      commit("setError", e, { root: true });
      throw e;
    }
  },
  async findById({ commit }, id) {
    try {
      return await this.$axios.$get(`api/orders/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async updateDeliveryData({ commit }, formData) {
    try {
      return await this.$axios.$put(`api/delivery`, formData);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async getDeliveryData({ commit }) {
    try {
      return await this.$axios.$get(`api/delivery`);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async getDeliveryTime({ commit }) {
    try {
      return await this.$axios.$get(`api/delivery/time`);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async createDeliveryTime({ commit }, data) {
    try {
      return await this.$axios.$post(`api/delivery/time`, data);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  async deleteDeliveryTime({ commit }, id) {
    try {
      return await this.$axios.$delete(`api/delivery/time/${id}`);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  }
};

export const getters = {
  orders: state => state.orders
};
