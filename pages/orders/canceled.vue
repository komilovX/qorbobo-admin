<template>
  <div>
    <div class="header p1 bb">
      <h2>Отмененные заказы</h2>
    </div>
    <el-table
      v-loading="loading"
      :data="orders"
      tooltip-effect="light"
      style="width: 100%"
      size="medium"
    >
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-table
            :data="JSON.parse(row.products)"
            tooltip-effect="light"
            :header-row-class-name="rowClassName"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              size="small"
              label="Товар"
              width="300"
              show-overflow-tooltip
            />
            <el-table-column
              prop="amount"
              label="Кол-во"
              align="center"
              width="250"
            />
            <el-table-column label="Цена за единицу" align="center" width="250">
              <template slot-scope="{ row: { price } }">
                {{ formatCurrency(price) }}
              </template>
            </el-table-column>
            <el-table-column label="Общая сумма" align="right">
              <template slot-scope="{ row: { price, amount } }">
                {{ formatCurrency(price * amount) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="id" label="ID" />
      <el-table-column sortable width="200" label="Дата" align="center">
        <template slot-scope="{ row: { date } }">
          <i class="el-icon-time"></i>
          {{ formaterDate(date) }}
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        label="Имя"
        prop="clientName"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        width="200"
        prop="orderType"
        align="center"
        label="Тип платежа"
      >
        <template slot-scope="{ row: { orderType } }">
          <span v-if="orderType === 'payme'">💳 Payme</span>
          <span v-else>💵 Наличные</span>
        </template>
      </el-table-column>
      <el-table-column label="Управлять" align="center">
        <template slot-scope="{ row: { id } }">
          <el-button
            type="primary"
            size="small"
            @click="openDialog(id)"
            class="mr1"
          >
            инфо
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <app-pagination
      :size="size"
      @paginationChange="currentChange($event)"
      v-if="size > 50"
    />
    <el-dialog title="Инфо" :visible.sync="dialogVisible" width="50%">
      <div class="text item info">
        <div><strong>Имя клиента: </strong>{{ currentOrder.clientName }}</div>
        <div>
          <strong>Телефон клиента: </strong>{{ currentOrder.clientPhone }}
        </div>
        <div><strong>Оплата: </strong>{{ currentOrder.orderType }}</div>
        <div><strong>Система: </strong>{{ currentOrder.system }}</div>
        <div><strong>Адрес клиента: </strong>{{ currentOrder.address }}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">закрыть</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import AppPagination from "@/components/AppPagination";
export default {
  middleware: ["admin-auth"],
  async asyncData({ store, error }) {
    try {
      const { data, size } = await store.dispatch(
        "order/getAllCanceledOrders",
        { page: 1, limit: 50 }
      );
      return { orders: data, size };
    } catch (e) {
      console.log(e);
    }
  },
  data: () => ({
    loading: false,
    loading2: false,
    dialogVisible: false,
    currentOrder: {}
  }),
  components: { AppPagination },
  methods: {
    async currentChange(val) {
      try {
        this.loading = true;
        const {
          data,
          size
        } = await this.$store.dispatch("order/getAllCanceledOrders", {
          page: val,
          limit: 30
        });
        this.orders = data;
        this.size = size;
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.log(e);
      }
    },
    formatCurrency(cost) {
      return new Intl.NumberFormat("ru").format(cost);
    },
    formaterDate(date) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric"
      };

      return new Date(date).toLocaleString("ru-RU", options);
    },
    openDialog(id) {
      const order = this.orders.find(f => f.id == id);
      this.currentOrder = order;
      this.dialogVisible = true;
    },
    rowClassName({ row, rowIndex }) {
      return "table-header";
    }
  },
  validate({ store }) {
    const role = store.getters["auth/userRole"];
    if (role != 4) {
      return true;
    }
    store.dispatch("setAuthError", true);
    return false;
  }
};
</script>
<style scoped lang="scss">
.info div {
  margin-bottom: 8px;
}
.info strong {
  font-weight: 600;
  letter-spacing: 0.8px;
  color: #304156;
}
.info span {
  text-align: center;
}
</style>
