<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Редактирование склада</h2>
    </div>
    <div class="form p1">
      <el-form :model="suuplierForm" status-icon :rules="rules" ref="editSuppliersForm" label-width="120px" class="demo-ruleForm">
        <div class="bb mb1">
          <el-form-item label="Название" prop="name" >
            <el-input type="text" v-model="suuplierForm.name" class="maxW35"></el-input>
          </el-form-item>
          <el-form-item label="Адрес" prop="address">
          <el-input
            class="maxW35"
            type="textarea"
            :rows="2"
            placeholder="Адрес"
            v-model="suuplierForm.address">
          </el-input>
        </el-form-item>
        </div>
        <el-form-item>
          <el-button type="success" @click="submitForm('editSuppliersForm')" :loading="loading">Сохранить </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({store, route}) {
    try {
      const storage = await store.dispatch('store/findStoreById', route.params.id)
      return {storage}
    } catch (e) {
      console.log(e)
    }
  },
  data(){
    return{
      loading: false,
      file: null,
      suuplierForm: {
        name: 'office',
        address: 'Amir temur ko\'chasi',
      },
      rules:{
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        address : [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ]
      }
    }
  },
  mounted() {
    this.suuplierForm.name = this.storage.name
    this.suuplierForm.address = this.storage.address
  },
  methods:{
    goToBack() {
      this.$router.back()
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            id: this.$route.params.id,
            name: this.suuplierForm.name,
            address: this.suuplierForm.address,
          }
          this.loading = true

          try {
            await this.$store.dispatch('store/updateStoreById', formData)
            this.loading = false
            this.$router.push('/storage/store')
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        } else {
          return false;
        }
      });
    },
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
<style lang="scss" scoped>
  .header i{
    font-weight: 800;
    font-size: 20px;
    color:#2688cd;
    cursor: pointer;
  }
  img{
    max-width: 125px;
    max-height: 95px;
  }
</style>
