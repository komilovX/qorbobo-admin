<template>
  <div>
    <div class="header p1 df-sb bb">
        <h2>Отчет по продуктам</h2>
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
            @click="searchProducts()"
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
      :data="Object.values(products)"
      tooltip-effect="light"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        size="small"
        label="Товар"
        min-width="400"
        max-width="500"
        show-overflow-tooltip
      />
      <el-table-column
        prop="amount"
        label="Кол-во"
        align="center"
        min-width="180"
      />
      <el-table-column
        label="Цена за единицу"
        align="center"
        min-width="180"
      >
        <template slot-scope="{row: {price}}">
          {{ formatCurrency(price) }}
        </template>
      </el-table-column>
      <el-table-column
        label="Общая сумма"
        align="center"
        min-width="220"
      >
        <template slot-scope="{row: {price, amount}}">
          {{ formatCurrency(price*amount) }}
        </template>
      </el-table-column>
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
        'order/getOrderReportByProduct',
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
      this.products = {}
      this.content.forEach(item => {
        if (item.products) {
          JSON.parse(item.products).forEach(product => {
            if (product.id) {
              if (!this.products[product.id]) {
                this.products[product.id] = {
                  id: product.id,
                  name: product.name,
                  amount: 0,
                  price: +product.price
                }
              }
              this.products[product.id].amount += product.amount
            }
          })
        }
      })
    },
    exportToXExcel() {
        const filename = `Отчет по продуктам - ${moment(new Date()).format('DD.MM.YYYY')}.xlsx`;
        const data = Object.values(this.products).map(item => {
          return {
            'Наименования товар': item.name,
            'Количество': item.amount,
            'Итог': item.amount * item.price
          }
        });
        var ws = XLSX.utils.json_to_sheet(Object.values(data));
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "People");
        XLSX.writeFile(wb,filename);
    },
    async searchProducts() {
      if (!this.dateRanges || !this.dateRanges.length) {
        this.$message.error('Выберите дату')
        return
      }
      const firstDate = moment(this.dateRanges[0]).format("YYYY-MM-DD");
      const lastDate = moment(this.dateRanges[1]).format("YYYY-MM-DD");
      const { content, dateFrom, dateTo } = await this.$store.dispatch(
        'order/getOrderReportByProduct',
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
