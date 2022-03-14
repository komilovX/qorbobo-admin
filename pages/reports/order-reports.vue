<template>
  <div>
    <div class="header p1 df-sb bb">
        <h2>Отчет по заказам</h2>
        <div class="df">
          <el-date-picker
            v-model="dateRanges"
            type="daterange"
            range-separator="-"
            start-placeholder="Дата начала"
            end-placeholder="Дата окончания"
            :clearable="false"
            size="small"
            class="mr1"
          >
          </el-date-picker>
          <el-button 
            type="success" 
            size="small" 
            @click="searchitems()"
          >
            Поиск
          </el-button>
        </div>
    </div>
    <div class="df p05" style="justify-content: flex-end">
      <el-button 
        type="primary" 
        size="small" 
        @click="exportToXExcel()"
      >
        Экспорт в Excel
      </el-button>
    </div>
    <el-table
      :data="data"
      tooltip-effect="light"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-table
            :data="JSON.parse(row.products)"
            tooltip-effect="light"
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              size="small"
              label="Товар"
              min-width="250"
              show-overflow-tooltip
            />
            <el-table-column
              prop="amount"
              label="Кол-во"
              align="center"
            />
            <el-table-column
              label="Цена за единицу"
              align="center"
            >
              <template slot-scope="{row: {price}}">
                {{ formatCurrency(price) }}
              </template>
            </el-table-column>
            <el-table-column
              label="Общая сумма"
              align="right"
            >
              <template slot-scope="{row: {price, amount}}">
                {{ formatCurrency(price*amount) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        width="200"
        label="Дата"
        align="center"
        prop="createdAt"
      />
      <el-table-column
        prop="id"
        label="№ заказа"
        align="center"
        min-width="180"
      />
      <el-table-column
        prop="total"
        label="Количество"
        align="center"
        min-width="120"
      />
      <el-table-column
        label="Общая сумма"
        align="center"
        min-width="180"
        prop="amount"
      />
      <el-table-column
        width="220"
        prop="orderType"
        align="center"
        label="Форма оплата"
      />
    </el-table>
  </div>
</template>
<script>
import moment from "moment";
export default {
  middleware: ['admin-auth'],
  async asyncData({store}) {
    try {
      const { content, dateFrom, dateTo } = await store.dispatch(
        'order/getOrderReports',
        {}
      )
      return {
        content,
        dateFrom,
        dateTo
      }
    } catch (e) {
      console.log(e)
    }
  },
  data() {
    return {
      data: [],
      products: {},
      dateRanges: []
    }
  },
  mounted() {
    this.dateRanges = [
      moment(this.dateFrom),
      moment(this.dateTo)
    ]
    if (this.content) {
      this.fillProducts()
    }
  },
  methods: {
    formatCurrency(cost) {
      return new Intl.NumberFormat("ru").format(cost);
    },
    formaterDate(date) {
      return moment(date)
        .add(5, "hours")
        .format("DD.MM.YYYY HH:mm");
    },
    fillProducts() {
      this.data = this.content.map(item => {
        let total = 0
        let amount = 0
        if (item.products) {
          JSON.parse(item.products).forEach(product => {
            if (product.id) {
              total += product.amount
              amount += +product.price * product.amount 
            }
          })
        }
        item.amount = this.formatCurrency(amount)
        item.orderType = item.orderType === 'payme' ? 'Payme' : 'Наличные'
        item.createdAt = this.formaterDate(item.createdAt)
        return {...item, total}
      })
    },
    exportToXExcel() {
      const data = []
      let mergedColumns = []
      let lastIndex = 0
      this.content.forEach((item, ind) => {
        if (item.products) {
          const products = JSON.parse(item.products)
          products.forEach(product => {
            data.push({
              'Дата': item.createdAt,
              '№ заказа': item.id,
              'Форма оплата': item.orderType,
              'Наименования товар': product.name,
              'Цена за единицу': product.price,
              'Количество': product.amount,
              'Общая сумма': product.price * product.amount,
            })
          })
          
          const cols = this.getMergedColumnsWithProductsLength(lastIndex, products.length )
          lastIndex += products.length 
          mergedColumns =  mergedColumns.concat(cols)
          
        }
      })
      const filename = `Отчет по клиентам - ${moment(new Date()).format('DD.MM.YYYY')}.xlsx`;
      var ws = XLSX.utils.json_to_sheet(data);
      var wb = XLSX.utils.book_new();
      ws["!merges"] = mergedColumns;
      XLSX.utils.book_append_sheet(wb, ws, "People");
      XLSX.writeFile(wb,filename);
    },
    getMergedColumnsWithProductsLength(lastIndex, length) {
      return [
        { s: { r: lastIndex + 1, c: 0 }, e: { r: lastIndex + length, c: 0 } },
        { s: { r: lastIndex +1, c: 1 }, e: { r: lastIndex + length, c: 1 } },
        { s: { r: lastIndex +1, c: 2 }, e: { r: lastIndex + length, c: 2 } }
      ]
    },
    async searchitems() {
      if (!this.dateRanges || !this.dateRanges.length) {
        this.$message.error('Выберите дату')
        return
      }
      const firstDate = moment(this.dateRanges[0]).format("YYYY-MM-DD");
      const lastDate = moment(this.dateRanges[1]).format("YYYY-MM-DD");
      const { content, dateFrom, dateTo } = await this.$store.dispatch(
        'order/getOrderReports',
        {
          dateFrom: firstDate, 
          dateTo: lastDate
        }
      )
      this.content = content
      this.dateRanges = [
        moment(dateFrom),
        moment(dateTo)
      ]
      this.fillProducts()
    }
  }
}
</script>
