<template>
  <component :is="currentRole" @weekChanged="weekChanged($event)" />
</template>
<script>
import StatisticPage from '@/components/StatisticPage'
import SimplePage from '@/components/SimplePage'
export default {
  middleware: ['admin-auth'],
  components: {
    StatisticPage,
    SimplePage
  },
  computed: {
    currentRole() {
      return 'SimplePage'
    }
  },
  methods: {
    async weekChanged(week) {
      try {
        let user = await this.$store.dispatch('statistic/fetchByWeek', week)
        console.log('user', user)
      } catch (e) {
        console.log(e)
      }
    }
  },

}
</script>

