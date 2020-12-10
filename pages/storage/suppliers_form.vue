<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Добавление карточки поставщика</h2>
    </div>
    <div class="form p1">
      <el-form :model="suuplierForm" status-icon :rules="rules" ref="suppliersForm" label-width="120px" class="demo-ruleForm">
        <div class="bb mb1">
          <el-form-item label="Название" prop="name" >
            <el-input type="text" v-model="suuplierForm.name" class="maxW35"></el-input>
          </el-form-item>
          <el-form-item label="Телефон" prop="phone" >
            <el-input type="text" v-model="suuplierForm.phone" class="maxW35"></el-input>
          </el-form-item>
          <el-form-item label="Адрес" prop="comment">
          <el-input
            class="maxW35"
            type="textarea"
            :rows="2"
            placeholder="Адрес"
            v-model="suuplierForm.address">
          </el-input>
        </el-form-item>
        <el-form-item label="Комментарий" prop="comment">
          <el-input
            class="maxW35"
            type="textarea"
            :rows="2"
            placeholder="Комментарий"
            v-model="suuplierForm.comment">
          </el-input>
        </el-form-item>
        </div>
        <el-form-item>
          <el-button type="success" @click="submitForm('suppliersForm')" :loading="loading">Сохранить </el-button>
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
      suuplierForm: {
        name: '',
        phone: '',
        address: '',
        comment: ''
      },
      rules:{
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
          { min:7 , message: 'Минимальная длина должна быть 7 букв', trigger: 'blur'}
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
            name: this.suuplierForm.name,
            phone: this.suuplierForm.phone,
            address: this.suuplierForm.address,
            comment: this.suuplierForm.comment
          }
          this.loading = true

          try {
            await this.$store.dispatch('supplier/createSupplier', formData)
            this.loading = false
            this.$message.success('поставщик успешна добавлена')
            this.$router.push('/storage/suppliers')
          } catch (e) {
            this.loading = false
            console.log(e)
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
