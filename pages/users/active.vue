<template>
  <div>
    <div class="header df-sb p1 bb">
      <h2>Активные Клиенты</h2>
    </div>
    <div class="p1 search">
      <el-input
        v-model="search"
        placeholder="Быстрый поиск"
        prefix-icon="el-icon-search"
        size="medium"
      >
      </el-input>
    </div>
    <div class="table p05 supplier-table">
      <el-table
      v-loading="loading"
      :data="users.filter(val => !search || val.first_name.toLowerCase().includes(search.toLowerCase()))"
      tooltip-effect="light"
      :header-row-class-name="rowClassName"
      :row-class-name="tableRowClassName"
      style="width: 100%"
      >
        <el-table-column
        width="200"
        label="Имя"
        prop="first_name"
        show-overflow-tooltip
        />
       <el-table-column
        width="200"
        label="Фамилия"
        prop="last_name"
        show-overflow-tooltip
        />
        <el-table-column
        width="200"
        label="Телефон"
        prop="phone"
        show-overflow-tooltip
        />
        <el-table-column
        width="200"
        label="Cистема"
        prop="system"
        show-overflow-tooltip
        />
        <el-table-column
        label="Кол-заказы"
        prop="orders"
        align="center"
        show-overflow-tooltip
        />
      </el-table>
      <app-pagination :size="size" @paginationChange="currentChange($event)" v-if="size > 30" />
    </div>
  </div>
</template>
<style>
  .el-table .deleted-row {
    background: oldlace;
  }
</style>

<script>
import AppPagination from '@/components/AppPagination'
export default {
  async asyncData({store}) {
    try {
      const {data, size} = await store.dispatch('users/findAllActiveUsers',{page: 1, limit: 30})
      return { users: data, size }
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    search: '',
    loading: false
  }),
  components: {AppPagination},
  methods:{
    tableRowClassName({row, rowIndex}) {
      if (row.deleted == 1) {
        return 'deleted-row'
      }
      return ''
    },
    async currentChange(val) {
      try {
        this.loading = true
        const response = await this.$store.dispatch('users/findAllActiveUsers',{page: val, limit: 30})
        this.users = response.data
        this.size = response.size
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    rowClassName({row, rowIndex}) {
      return 'table-header'
    },
  },
}
</script>
<style>
  .el-table .hidden-row{
    opacity: 0.5;
  }
  .el-table .table-header {
    color:#999999;
    font-size: 12px;
  }
</style>
<style lang="scss" scoped>
  .search{
    max-width: 300px;
  }
  .df{
    display: flex;
    align-items: center
  }
  .img-part span{
    margin-left: .5rem;
  }
  .table i {
    font-size: 18px;
    cursor: pointer;
    color: #2688cd;
  }
  .red{
    color: #2688cd;
  }
</style>
