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
  async changeStatus({ commit }, { id, status }) {
    try {
      return this.$axios.$put(`api/orders/${id}`, { status });
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
  async getDeliveryData() {
    try {
      return await this.$axios.$get(`api/delivery`);
    } catch (e) {
      commit("setError", e, { root: true });
    }
  },
  SOCKET_newOrder({ commit }) {
    console.log("New order client");
    // commit('setOrder', orders)
  }
};

export const getters = {
  orders: state => state.orders
};
