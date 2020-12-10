<template>
  <div>
    <div class="header p1 df-sb bb">
      <h2>Отправка сообщение</h2>
      <el-button type="success" size="medium" @click="$router.push('/message_form')">Добавить</el-button>
    </div>
    <div class="p1">
      <el-table
      :data="messages"
      :header-row-class-name="rowClassName"
      tooltip-effect="light"
      style="width: 100%"
      class="table"
      >
        <el-table-column
          width="200"
          label="Дата"
          >
          <template slot-scope="{row: {date} }">
            <i class="el-icon-time"></i>
            {{ formaterDate(date) }}
          </template>
        </el-table-column>
        <el-table-column
        min-width="200"
        prop="title"
        label="Титул на узб"
        align="left"
        show-overflow-tooltip
        />
        <el-table-column
        min-width="200"
        prop="title_ru"
        label="Титул на рус"
        align="left"
        show-overflow-tooltip
        />
        <el-table-column
        width="200"
        label="Статус"
        >
          <template slot-scope="{row: {status}}">
            <template v-if="status == 1">
              <el-tag :key="status" type="success" effect="plain">
                отправлен
              </el-tag>
            </template>
            <template v-else>
              <el-tag :key="status" type="primary" effect="plain">
                ожидающий
              </el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="{row:{id}}">
            <div class="red df">
              <nuxt-link :to='`/send_message/${id}`' tag="a" class="mr1">Ред</nuxt-link>
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
<script>

export default {
  middleware: ['admin-auth'],
  async asyncData({store, error}) {
    try {
      const messages = await store.dispatch('send_message/getAllMessages')
      return {messages}
    } catch (e) {
      console.log(e)
    }
  },
  data(){
    return{
    }
  },
  methods:{
    async handleCommand(id){
      try {
        const text = 'Уверены, что хотите удалить эту сообщение?'
        this.$confirm(text,'Подтверждение',{
          confirmButtonText: 'Да',
          cancelButtonText: 'Отменить',
          type: 'warning'
        }).then(async () => {
          try {
            await this.$store.dispatch('send_message/deleteById', id)
            this.messages = this.messages.filter(t => t.id != id)
            this.$message.success('Cообщение удалена')
          } catch (e) {
            console.log(e)
          }
        }).catch(() => {})
      } catch (error) {
        console.log(error)
      }
    },
    formaterDate(date) {
     const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: false
      }

      return new Date(date).toLocaleString('ru-RU', options)
    },
    rowClassName({row, rowIndex}) {
      return 'table-header'
    },
  },
  validate({store}) {
    const role = store.getters['auth/userRole']
      if (role == 1 || role == 2) {
        return true
      }
      store.dispatch('setAuthError', true)
      return false
    },
}
</script>
<style lang="scss" scoped>
  .table i {
    font-size: 18px;
    cursor: pointer;
    color: #2688cd;
  }
  .red{
    color: #2688cd;
  }
</style>
