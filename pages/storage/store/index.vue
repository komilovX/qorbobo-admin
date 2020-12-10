<template>
  <div>
    <div class="header df-sb p1 bb">
      <h2>Склады</h2>
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
    <div class="table p05">
      <el-table
      :data="stores.filter(val => !search || val.name.toLowerCase().includes(search.toLowerCase()))"
      :row-class-name="tableRowClassName"
      style="width: 100%">
        <el-table-column
        type="index"
        width="50"/>
        <el-table-column
        width="200"
        label="Название"
        prop="name"
        show-overflow-tooltip
        />
        <el-table-column
        min-width="300"
        prop="address"
        label="Адрес"
        header-align="left"
        align="left"
        show-overflow-tooltip
        />
        <el-table-column
        fixed="right"
        >
          <template slot-scope="{row:{id,deleted}}" v-if="deleted != 1">
            <div class="red df">
              <nuxt-link :to='`/storage/store/${id}`' tag="a" class="mr1">Ред</nuxt-link>
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
    </div>
  </div>
</template>
<style>
  .el-table .deleted-row {
    background: oldlace;
  }
</style>
<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({store}) {
    try {
      const stores = await store.dispatch('store/findAllStores')
      return {stores}
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    search: '',
    hiddenRows: [],
    hideStatus: 'Скрыть',
  }),
  methods:{
    goToForm(){
      this.$router.push(`/storage/store_form`)
    },
    tableRowClassName({row, rowIndex}) {
      if (row.deleted == 1) {
        return 'deleted-row'
      }
      return ''
    },
    handleCommand( id ){
      const text = 'Уверены, что хотите удалить этого склад?'
      this.$confirm(text,'Подтверждение',{
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('store/deleteStoreById', id)
        this.$message.success('Склад удалена')
      }).catch(() => {})
    },
    formatCurrency(cost) {
      return new Intl.NumberFormat('ru').format(cost)
    },
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
