<template>
  <div>
    <div class="header df-sb p1 bb">
      <h2>Остатки на складе</h2>
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
      :data="remainders.filter(val => !search || val.product_name.toLowerCase().includes(search.toLowerCase()))"
      tooltip-effect="light"
      :row-class-name="tableRowClassName"
      style="width: 100%"
      >
        <el-table-column
        width="300"
        label="Название"
        prop="product_name"
        show-overflow-tooltip
        />
        <el-table-column
        width="250"
        prop="category_name"
        label="Категория"
        show-overflow-tooltip
        align="center"
        />
        <el-table-column
        label="Остатки"
        width="150"
        align="center"
        >
         <template slot-scope="{row: {residue}}">
           {{residue+" шт."}}
         </template>
        </el-table-column>
        <el-table-column
        width="250px"
        label="Лимит"
        align="center"
        >
          <template slot-scope="{row}">
            <span v-if="!row.edit">{{ row.limit }}</span>
            <template v-else>
              <el-input v-model="row.limit" class="edit-input mr1" size="small"/>
              <el-button
                class="cancel-btn"
                size="small"
                type="warning"
                @click="cancelEdit(row)"
              >
                cancel
              </el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Изменить лимит">
        <template slot-scope="{row}">
          <template
          v-if="row.edit"
          >
            <el-button
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >
              Ok
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit = !row.edit"
            >
              Edit
            </el-button>
          </template>
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
      const {data, size} = await store.dispatch('supply/findAllCalculations',{page: 1, limit: 30})
      return { remainders: data, size }
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    search: '',
    list: null,
    loading: false,
  }),
  mounted(){
    this.getList()
  },
  components: {AppPagination},
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.limit>= row.residue) {
        return 'deleted-row'
      }
      return ''
    },
    async currentChange(val) {
      try {
        this.loading = true
        const response = await this.$store.dispatch('supply/findAllCalculations',{page: val, limit: 30})
        this.remainders = response.data
        this.size = response.size
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    cancelEdit(row) {
      row.limit = row.orginalLimit
      row.edit = false
    },
    async confirmEdit(row) {
      let isNumber = parseInt(row.limit)
      if (!!isNumber) {
        try {
          await this.$store.dispatch('supply/updateLimitById', {limit: row.limit, id: row.id})
          row.edit = false
          this.$message.success("Лимит успешна обнавлена")
        } catch (e) {
          console.log(e)
        }
      }
      else {
        this.$message.warning("введите корректное значение")
      }
    },
    getList() {
      this.list = this.remainders.map(v => {
        this.$set(v, 'edit', false)
        v.orginalLimit = v.limit
        return v
      })
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
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
