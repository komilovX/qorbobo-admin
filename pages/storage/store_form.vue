<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Редактирование склада</h2>
    </div>
    <div class="form p1">
      <el-form :model="storeForm" status-icon :rules="rules" ref="storeForm" label-width="120px" class="demo-ruleForm">
        <div class="bb mb1">
          <el-form-item label="Название" prop="name" >
            <el-input type="text" v-model="storeForm.name" class="maxW35"></el-input>
          </el-form-item>
          <el-form-item label="Адрес" prop="address">
          <el-input
            class="maxW35"
            type="textarea"
            :rows="2"
            placeholder="Адрес"
            v-model="storeForm.address">
          </el-input>
        </el-form-item>
        </div>
        <el-form-item>
          <el-button type="success" @click="submitForm('storeForm')" :loading="loading">Сохранить </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ['admin-auth'],
  data(){
    return{
      loading: false,
      file: null,
      storeForm: {
        name: '',
        address: '',
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
  methods:{
    goToBack() {
      this.$router.back()
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.storeForm.name,
            address: this.storeForm.address,
          }
          this.loading = true
          try {
            await this.$store.dispatch('store/createStore', formData)
            this.loading = false
            this.$message.success('склад успешна добавлена')
            this.$router.push('/storage/store')
          } catch (error) {
            this.loading = false
            console.log(error)
          }

          this.suuplierForm.name = ''
          this.suuplierForm.address = ''

          this.loading = false
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
