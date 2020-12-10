<template>
  <div>
    <div class="header df-sb p1 bb mb1">
      <h2>Сотрудники</h2>
      <el-button type="success" size="medium" @click="goToForm()">Добавить</el-button>
    </div>
    <div class="table p05 supplier-table">
      <el-table
      :data="adminList"
      tooltip-effect="light"
      style="width: 100%"
      >
        <el-table-column
        label="Имя"
        prop="name"
        show-overflow-tooltip
        />
        <el-table-column
        width="250"
        prop="login"
        label="Логин"
        show-overflow-tooltip
        />
        <el-table-column
        width="200"
        label="Должность"
        >
          <template slot-scope="{row: {label, type}}">
            <el-tag :key="label" :type="type" effect="plain">
              {{label}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
        float="right"
        width="200"
        >
          <template slot-scope="{row:{id, role}}">
            <div class="red df">
              <nuxt-link :to='`/access/${id}`' tag="a" class="mr1">Ред</nuxt-link>
              <el-dropdown
              v-if="role != 1"
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

<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({store, error}) {
    try {
      const admins = await store.dispatch('auth/findAll')
      return {admins}
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    adminList: null
  }),
  validate({store}) {
    const role = store.getters['auth/userRole']
    if (role == 1) {
      return true
    }
    store.dispatch('setAuthError', true)
    return false
  },
  mounted() {
    this.getAdminList()
  },
  methods:{
    goToForm(){
      this.$router.push(`/access_form`)
    },
    handleCommand( id ){
      const text = 'Уверены, что хотите удалить этого cотрудника?'
      this.$confirm(text,'Подтверждение',{
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$store.dispatch('auth/deleteById', id)
          this.adminList = this.adminList.filter(t => t.id != id)
          this.$message.success('Поставщик удалена')
        } catch (e) {
          console.log(e)
        }
      }).catch(() => {})
    },
    getAdminList() {
      const roles = [
        {role: 1, label: 'владелец', type: 'danger'},
        {role: 2, label: 'управляющий', type: 'success'},
        {role: 3, label: 'продавец', type: 'primary'},
        {role: 4, label: 'кладовщик', type: 'info'},
      ]
      this.adminList = this.admins.map(v => {
        const {label, type} = roles.find(f => f.role == v.role)
        v.label = label
        v.type = type
        return v
      })
    }
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
