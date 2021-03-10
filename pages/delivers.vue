<template>
  <div>
    <div class="header df p1 bb mb1">
      <h2 class="mr1">Курьеры</h2>
      <el-button type="success" size="small" @click="dialogVisible = true">Добавить</el-button>
    </div>
    <div class="table p05 supplier-table">
      <el-table
        :data="delivers"
        tooltip-effect="light"
        style="width: 100%"
      >
        <el-table-column
          width="350"
          label="Ф.И.О"
          prop="name"
          show-overflow-tooltip
        />
        <el-table-column
          width="250"
          prop="password"
          label="Пароль"
          show-overflow-tooltip
        />
        <el-table-column
          width="200"
          label="Статус"
        >
          <template slot-scope="{ row: { status }}">
            <el-tag :type="status === 'new' ? 'danger' : 'success'" effect="plain">
              {{ deliverStatus[status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          float="right"
        >
          <template slot-scope="{row:{ id }}">
            <div class="red df">
              <el-button type="text"  @click="editDeliver(id)">
                Ред
              </el-button>
              <el-button type="text"  @click="deleteDeliver(id)">
                Удалить
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <delivers-form-dialog 
        :deliver="deliver"
        :type="dialogType"
        :visible="dialogVisible" 
        :loading="loading" 
        @close="closeDialog" 
      />
    </div>
  </div>
</template>

<script>
import DeliversFormDialog from '../components/DeliversFormDialog.vue'
export default {
  components: { DeliversFormDialog },
  middleware: ['admin-auth'],
  async fetch({ store }) {
    try {
      await store.dispatch('delivers/fetchDelivers')
    } catch (e) {
      console.log(e)
    }
  },
  data() {
    return {
      dialogVisible: false,
      deliverStatus: {
        new: 'Не зарегистрирован',
        connected: 'зарегистрированный'
      },
      dialogType: 'create',
      deliver: {}
    }
  },
  validate({store}) {
    const role = store.getters['auth/userRole']
    if (role == 1) {
      return true
    }
    store.dispatch('setAuthError', true)
    return false
  },
  methods:{
    closeDialog() {
      this.dialogVisible = false
      this.dialogType = 'create'
    },
    deleteDeliver( id ){
      const text = 'Уверены, что хотите удалить этого курьера?'
      this.$confirm(text,'Подтверждение',{
        confirmButtonText: 'Да',
        cancelButtonText: 'Отменить',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$store.dispatch('delivers/deleteDeliver', id)
          this.$message.success('Курьер удалена')
        } catch (e) {
          console.log(e)
        }
      }).catch(() => {})
    },
    async editDeliver(id) {
      try {
        const deliver = await this.$store.dispatch('delivers/findDeliverById', id)
        this.deliver = deliver
        this.dialogType = 'edit'
        this.dialogVisible = true
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    delivers() {
      return this.$store.getters['delivers/delivers']
    },
    loading() {
      return this.$store.getters['delivers/loading']
    }
  }
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
    color: #409EFF;;
  }
  .red{
    color: #409EFF;
  }
</style>
