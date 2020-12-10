<template>
  <div>
    <div class="header df-sb p1 bb">
      <h2>Категории</h2>
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
    <div class="table p05 ctg">
      <el-table
      :data="categories.filter(val => !search || val.name.toLowerCase().includes(search.toLowerCase()))"
      :row-class-name="tableRowClassName"
      row-key="id"
      style="width: 100%"
      >

        <el-table-column
        label="Категория"
        class="df"
        >
          <template slot-scope="{row:{photo,name,children}}" class="ml1">
            <div class="img-part df" :class="{'ml1-5':!children}">
              <img :src="photo" width="48" height="35" class="mr05">
              <span>{{name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          fixed="right"
        >
          <template slot-scope="{row:{id}}">
            <div class="red df">
              <nuxt-link :to='`/menu/categories/${id}`' tag="a" class="mr1">Ред</nuxt-link>
              <el-dropdown
              trigger="click"
              @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-open" :command="{id,command:'hide'}">{{hideOrShow(id)}}</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete" :command="{id,command:'delete'}">Удалить</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({store, error}) {
    try {
      const categories = await store.dispatch('category/findAllSortCategories')
      return {categories}
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    hiddenRows: [],
    hideStatus: 'Скрыть',
    search: ''
  }),
  mounted() {
    this.categories.filter(f => {
      if (f.hidden == 1) {
        this.hiddenRows.push(f.id)
      }
    })
  },
  methods:{
    goToForm(){
      this.$router.push(`/menu/categories_form`)
    },
    tableRowClassName({row, rowIndex}) {
      if (this.hiddenRows.includes(row.id)) {
        return 'hidden-row';
      }
      return '';
    },
    async handleCommand({command, id}){
      try {
        if (command == 'hide') {
          if (this.hiddenRows.includes(id)) {
            await this.$store.dispatch('category/hideCategoryById',{hide: false, id})
            this.hiddenRows = this.hiddenRows.filter(f => f != id)
          }
          else{
            await this.$store.dispatch('category/hideCategoryById',{hide: true, id})
            this.hiddenRows.push(id)
          }
        }
        else {
          const text = 'Если удалить категорию, все подкатегории, товары и тех. карты в ней удалятся. Уверены, что хотите удалить эту категорию?'
          this.$confirm(text,'Подтверждение',{
            confirmButtonText: 'Да',
            cancelButtonText: 'Отменить',
            type: 'warning'
          }).then(async () => {
            try {
              await this.$store.dispatch('category/deleteCategoryById', id)
              await this.$store.dispatch('category/findAllCategories')
              this.categories = this.categories.filter(t => t.id != id)
              this.$message.success('Категория удалена')
            } catch (e) {
              console.log(e)
            }
          }).catch(() => {})
        }
      } catch (error) {
        console.log(error);
      }
    },
    hideOrShow(id) {
      if (this.hiddenRows.includes(id)) {
        return 'Показать'
      }
      return 'Скрыть'
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
  .ctg .el-table__row .cell{
    display: flex;
    align-items: center
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
