<template>
  <div>
    <div class="header p1 df-sb bb">
        <h2>Отчет по клиентам</h2>
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
        width="250"
      />
      <el-table-column
        label="ФИО"
        align="left"
        min-width="250"
        max-width="400"
        prop="clientName"
      />
      <el-table-column
        prop="clientPhone"
        align="left"
        label="Контакт"
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
        'order/getOrderReportByClient',
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
        item.createdAt = this.formaterDate(item.createdAt)
        item.clientPhone = '+' + item.clientPhone
        return item
      })
    },
    exportToXExcel() {
        const filename = `Отчет по клиентам - ${moment(new Date()).format('DD.MM.YYYY')}.xlsx`;
        const data = this.data.map(item => {
          return {
            'Дата': item.createdAt,
            '№ заказа': item.id,
            'ФИО': item.clientName,
            'Контакт': item.clientPhone
          }
        });
        var ws = XLSX.utils.json_to_sheet(Object.values(data));
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "People");
        XLSX.writeFile(wb,filename);
    },
    async searchitems() {
      if (!this.dateRanges || !this.dateRanges.length) {
        this.$message.error('Выберите дату')
        return
      }
      const firstDate = moment(this.dateRanges[0]).format("YYYY-MM-DD");
      const lastDate = moment(this.dateRanges[1]).format("YYYY-MM-DD");
      const { content, dateFrom, dateTo } = await this.$store.dispatch(
        'order/getOrderReportByClient',
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
