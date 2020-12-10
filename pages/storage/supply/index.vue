<template>
  <div>
    <div class="header df-sb p1 bb">
      <h2>Поставки</h2>
      <el-button type="success" size="medium" @click="goToForm()">Добавить</el-button>
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
      :data="supplies.filter(val => !search || val.supplier_name.toLowerCase().includes(search.toLowerCase()))"
      tooltip-effect="light"
      :header-row-class-name="rowClassName"
      :row-class-name="tableRowClassName"
      style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="{row}">
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
              width="200"
              show-overflow-tooltip
              />
              <el-table-column
              prop="amount"
              label="Кол-во"
              align="center"
              width="150"
              />
              <el-table-column
              label="Цена за единицу"
              align="center"
              width="200"
              >
                <template slot-scope="{row: {cost}}">
                  {{ formatCurrency(cost) }}
                </template>
              </el-table-column>
              <el-table-column
              label="Цена за продажу"
              align="center"
              width="200"
              >
                <template slot-scope="{row: {price}}">
                  {{ formatCurrency(price) }}
                </template>
              </el-table-column>
              <el-table-column
              label="Общая сумма"
              width="250"
              align="right"
              >
                <template slot-scope="{row: {total}}">
                  {{ formatCurrency(total) }}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
        label="Дата"
        >
          <template slot-scope="{row: {date} }">
            {{ formaterDate(date) }}
          </template>
        </el-table-column>
        <el-table-column
        width="200"
        label="Поставщик"
        prop="supplier_name"
        show-overflow-tooltip
        />
        <el-table-column
        width="120"
        prop="store_name"
        label="Склад"
        show-overflow-tooltip
        />
        <el-table-column
        width="250"
        prop="comment"
        label="Комментарий"
        align="left"
        show-overflow-tooltip
        />
        <el-table-column
        label="Сумма"
        width="200"
        >
          <template slot-scope="{row: {total} }">
            {{ formatCurrency(total) }}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="{row:{id, deleted}}" v-if="deleted != 1">
            <div class="red df">
              <nuxt-link :to='`/storage/supply/${id}`' tag="a" class="mr1">Ред</nuxt-link>
              <el-dropdown
              trigger="click"
              @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-delete" :command="id">Удалить</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
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
  middleware: ['admin-auth'],
  async asyncData({store}) {
    try {
      const {data, size} = await store.dispatch('supply/findAllSupplies',{page: 1, limit: 30})
      return { supplies: data, size }
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
    goToForm(){
      this.$router.push(`/storage/supply_form`)
    },
    tableRowClassName({row, rowIndex}) {
      if (row.deleted == 1) {
        return 'deleted-row'
      }
      return ''
    },
    async currentChange(val) {
      try {
        this.loading = true
        const response = await this.$store.dispatch('supply/findAllSupplies',{page: val, limit: 30})
        this.supplies = response.data
        this.size = response.size
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    handleCommand( id ){
      const text = 'Уверены, что хотите удалить этого поставка?'
      this.$confirm(text,'Подтверждение',{
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('supply/deleteSupplyById', id)
        this.$message.success('Поставка удалена')
      }).catch(() => {})
    },
    formatCurrency(cost) {
      return new Intl.NumberFormat('ru').format(cost)
    },
    rowClassName({row, rowIndex}) {
      return 'table-header'
    },
    formaterDate(date) {
     const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: false
      }

      return new Date(date).toLocaleString('ru-RU', options)
    }
  },
  validate({store}) {
    const role = store.getters['auth/userRole']
    if (role != 3) {
      return true
    }
    store.dispatch('setAuthError', true)
    return false
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
