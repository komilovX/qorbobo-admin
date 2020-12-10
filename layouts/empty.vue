<template>
    <div class="empty-layout">
        <nuxt />
    </div>
</template>
<script>
export default {
  mounted(){
    const {message} =this.$route.query
    switch (message) {
      case 'login':
        this.$message.info('Вход только после авторизации')
        break;
      case 'session':
        this.$message.info('Ваша сессия истекла. Пожалуйста, авторизуйтесь снова, чтобы продолжить работу.')
        break;
      case 'logout':
        this.$message.success('Вы успешно выйти из систему.')
        break;
      default:
        break;
    }
  },
  computed:{
    error(){
      return this.$store.getters.error
    }
  },
  watch:{
    error(value){
      this.$message.error(value.response.data.message)
    }
  }
}
</script>

<style lang="scss" scoped>
  .empty-layout{
    width: 100%;
    height: 100vh;
  }
</style>
