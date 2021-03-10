<template>
  <div class="container">
    <div class="header df mb1">
      <i class="el-icon-arrow-left mr1" @click="$router.back()"></i>
      <h2>ID # {{$route.params.id}}</h2>
    </div>
    <el-row :gutter="20">
      <el-col :lg="{span: 24}">
        <el-row :gutter="20">
          <el-col :lg="{span: 10}">
            <el-card shadow="never card">
              <div slot="header">
                <span class="card-header">Информация о клиентах</span>
              </div>
              <div class="text item info">
                <div><strong>Время заказа: </strong><span>{{formaterDate(order.date)}}</span></div>
                <div><strong>Имя клиента: </strong>{{order.clientName}}</div>
                <div><strong>Телефон клиента: </strong>{{order.clientPhone}}</div>
                <div><strong>Оплата: </strong>{{order.orderType}}</div>
                <div><strong>Система: </strong>{{order.system}}</div>
                <div><strong>Адрес клиента: </strong>{{order.address}}</div>
              </div>
              <div class="bottom clearfix mb1" style="float: right" v-if="order.status === 'new'">
                <el-tooltip content="Добавить ожидающий" placement="top">
                  <el-button 
                    type="warning" 
                    size="small" 
                    plain 
                    icon="el-icon-question" 
                    @click="addToProcess" 
                    :loading="processLoading"/>
                </el-tooltip>
                <el-tooltip content="отправить sms" placement="top" v-if="order.chat_id">
                  <el-button 
                    size="small" 
                    plain 
                    type="primary" 
                    icon="el-icon-message" 
                    @click="templateVisible = true" />
                </el-tooltip>
              </div>
            </el-card>
          </el-col>
          <el-col :lg="{span: 14}">
            <el-card shadow="never">
              <div slot="header">
                <span class="card-header">Заказанные продукты</span>
              </div>
              <el-table
                :data="ordered_products"
                style="width: 100%"
                size="medium"
                tooltip-effect="light"
                class="orderlist"
              >
                <el-table-column
                  prop="name"
                  label="Товар"
                  width="200"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="amount"
                  label="Кол-во"
                  align="center"
                  width="150"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="Общая сумма"
                  align="center"
                >
                  <template slot-scope="{row: {amount, price}}">
                    {{formatCurrency(amount*price)}}
                  </template>
                </el-table-column>
                <el-table-column
                >
                  <template slot-scope="{row}" class="plus-minus">
                    <i class="el-icon-minus mr05" @click="minusAmount(row)" />
                    <i class="el-icon-plus mr1" @click="plusAmount(row)" />
                    <i class="el-icon-delete-solid" id="delete" @click="deleteItem(row)" v-if="ordered_products.length != 1" />
                  </template>
                </el-table-column>
              </el-table>
              <div class="delivery p1">
                <i class="mr1">Доставка</i>{{formatCurrency(order.delivery)}} sum
              </div>
              <div class="p1 df" style="justify-content: flex-end">
                <b>Итого:</b>&nbsp;
                {{calculateTotal}} sum
              </div>
              <div class="df-sb mt1">
                <el-button type="primary" plain size="small" :loading="loading" @click="addProducts">Добавить товар</el-button>
                <div>
                  <el-button type="danger" size="small" plain @click="cancelOrder">Отменить заказ</el-button>
                  <el-button type="success" size="small" plain @click="acceptOrder">Подтвердить заказ</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog title="Добавить товар" :visible.sync="dialogTableVisible" width="60%">
      <div class="p1 search">
        <el-input
          placeholder="Быстрый поиск"
          prefix-icon="el-icon-search"
          size="medium"
          style="width: 40%"
        />
      </div>
      <el-table
       :data="products"
       v-loading="loading2"
       @selection-change="handleSelectionChange"
       ref="multipleTable"
       >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="Name" width="200" />
        <el-table-column prop="price" label="Цена" width="200" />
        <el-table-column prop="amount" label="Кол-во" width="200" align="center" />
        <el-table-column
          label="Управлять"
          align="center"
        >
          <template slot-scope="{row}">
            <i class="el-icon-minus mr05 control-i" @click="minusAmount(row)" />
            <i class="el-icon-plus mr1 control-i" @click="plusAmount(row)" />
          </template>
        </el-table-column>
      </el-table>
      <app-pagination :size="size" :limit="50" @paginationChange="currentChange($event)" v-if="size > 50" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">Отменить</el-button>
        <el-button type="primary" :disabled="selectedProducts.length == 0" @click="addSelectedProduct">Добавить</el-button>
      </span>
    </el-dialog>
    <!-- Send Messages -->
    <el-dialog
    title="Отправка сообщений"
    :visible.sync="templateVisible"
    width="50%"
    >
      <el-input
      type="textarea"
      :rows="5"
      placeholder="Please input"
      v-model="template"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="templateVisible = false">Отменить</el-button>
        <el-button type="primary" @click="sendMessage" :loading="sendLoading">Отправить</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import AppPagination from '@/components/AppPagination'
export default {
  async asyncData({store, route, error}) {
    try {
      const order = await store.dispatch('order/findById', route.params.id)
      return {order, ordered_products: JSON.parse(order.products)}
    } catch (e) {
      console.log(e)
    }
  },
  data(){
    return{
      loading: false,
      loading2: false,
      size: null,
      processLoading: false,
      sendLoading: false,
      template: '',
      dialogTableVisible: false,
      templateVisible: false,
      total: null,
      products: null,
      selectedProducts: []
    }
  },
  components: {AppPagination},
  methods:{
    formaterDate(date) {
      const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: false
      }

      return new Date(date).toLocaleString('ru-RU', options)
    },
    minusAmount(row) {
      if (row.amount > 1) {
        row.amount -= 1
      }
      else{
        this.$message.warning("это минимальная количество")
      }
    },
    plusAmount(row) {
      row.amount +=1
    },
    deleteItem(row) {
      this.$confirm('Вы действительно хотите удалить этот продукт', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(() => {
        this.ordered_products = this.ordered_products.filter(f => f.id != row.id)
      })
    },
    async addProducts() {
      if (!this.products) {
        try {
          this.loading = true
          const {data, size} = await this.$store.dispatch('product/findAllProducts',{page: 1, limit: 50})
          this.products = data.map(p => {
            return {id: p.id, name: p.name, amount: 1, price: p.price}
          })
          this.size = size
          this.loading = false
          this.dialogTableVisible = true
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      }
      else {
        this.products = this.products.map(p => {
          p.amount = 1;
          return p
        })
        this.dialogTableVisible = true
      }
    },
    handleSelectionChange (val) {
      this.selectedProducts = val
    },
    addSelectedProduct() {
      this.selectedProducts.forEach(v => {
        const index = this.ordered_products.findIndex(p => p.id == v.id)
        index != -1 ? this.ordered_products[index].amount += v.amount : this.ordered_products.push(v)
      })
      this.$refs.multipleTable.clearSelection();
      this.dialogTableVisible = false
    },
    formatCurrency(cost) {
      return new Intl.NumberFormat('ru').format(cost)
    },
    async sendMessage() {
      try {
        if (this.template) {
          this.sendLoading = true
          await this.$store.dispatch('send_message/sendNow',{chat_id: this.order.chat_id, message: this.template})
          this.sendLoading = false
          this.template = ''
          this.$message.success("сообщения отправлена")
        }
        else {
          this.$message.error("напишите что нибудь")
        }
      } catch (e) {
        this.sendLoading = false
        console.log(e)
      }
    },
    async acceptOrder(){
      this.$confirm('Вы действительно уверенно подтвердить этот заказ?', 'Info', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'primary'
      })
      .then(async () => {
        try {
          this.processLoading = true
          const formData = {
            id: this.$route.params.id, 
            status: 'active', 
            total: this.total, 
            products: JSON.stringify(this.ordered_products),
            chat_id: this.order.chat_id
          }
          await this.$store.dispatch('order/acceptOrder', formData)
          await this.$store.dispatch('supply/changeResidue', JSON.stringify(this.ordered_products))
          this.$message.success("заказ подтвержден")
          this.$router.push('/orders/online')
        } catch (e) {
          this.processLoading = false
          console.log(e)
        }
      })
    },
    async addToProcess() {
      this.$confirm('Вы действительно хотите добавить этот Заказ в ожидающий?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(async () => {
        try {
          this.processLoading = true
          await this.$store.dispatch('order/changeStatus',{id: this.$route.params.id, status: 'process'})
          this.$message.success("добавлена в ожидающий")
          this.$router.push('/orders/online')
        } catch (e) {
          this.processLoading = false
          console.log(e)
        }
      })
    },
    async cancelOrder(){
      this.$confirm('Вы действительно уверенно отменить этот заказ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(async () => {
        try {
          this.processLoading = true
          await this.$store.dispatch('order/changeStatus',{id: this.$route.params.id, status: 'cancelled'})
          this.$message.success("заказ отменён")
          this.$router.push('/orders/online')
        } catch (e) {
          this.processLoading = false
          console.log(e)
        }
      })
    },
    async currentChange(val) {
      try {
        this.loading2 = true
        const {data, size} = await this.$store.dispatch('product/findAllProducts',{page: 1, limit: 50})
        this.products = data.map(p => {
            return {id: p.id, name: p.name, amount: 1, price: p.price}
          })
        this.size = size
        this.loading2 = false
      } catch (e) {
        this.loading2 = false
        console.log(e)
      }
    },
  },
  validate({store}) {
    const role = store.getters['auth/userRole']
    if (role != 4) {
      return true
    }
    store.dispatch('setAuthError', true)
    return false
  },
  computed: {
    calculateTotal() {
      const total = this.ordered_products.reduce((acc, val) => acc+(Number(val.amount*val.price)),0) + this.order.delivery
      this.total = total
      return new Intl.NumberFormat('ru').format(total)
    },
  }
}
</script>
<style>
  .orderlist i {
    font-size: 18px;
    cursor: pointer;
  }
  .orderlist #delete {
    color: #F56C6C
  }
  .control-i{
    color: #2688cd;
    cursor: pointer;
  }
</style>
<style lang="scss" scoped>
  .header i{
    font-weight: 800;
    font-size: 20px;
    color:#2688cd;
    cursor: pointer;
  }
  .container {
    padding: 1rem;
  }
  .container .card-header {
    font-weight: 600;
    color: #409eff
  }
  .info div{
    margin-bottom: 8px;
  }
  .info strong{
    font-weight: 600;
    letter-spacing: .8px;
    color: #304156;
  }
  .info span{
    text-align: center
  }
  .bottom i{
    font-size: 22px;
  }
  .delivery {
    font-size: 16px
  }
</style>
