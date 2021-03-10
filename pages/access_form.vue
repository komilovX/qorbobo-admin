<template>
  <div id="scrollinElement">
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="$router.back()"></i>
      <h2>Добавление карточки сотрудника</h2>
    </div>
    <div class="form p1">
      <el-form :model="employerForm" status-icon :rules="rules" ref="employerForm" label-width="120px" class="demo-ruleForm">

        <el-form-item label="Имя" prop="name" >
          <el-input type="text" v-model="employerForm.name" class="maxW35" />
        </el-form-item>
        <el-form-item label="Логин" prop="login" >
          <el-input type="text" v-model="employerForm.login" class="maxW35" />
        </el-form-item>
        <el-form-item label="Пароль" prop="password" >
          <el-input type="password" v-model="employerForm.password" class="maxW35" />
        </el-form-item>
        <el-form-item label="Должность" prop="role" class="mb2">
          <el-select v-model="employerForm.role" style="min-width:35vw">
            <el-option v-for="s in roles" :key="s.role" :label="s.label" :value="s.role" />
          </el-select>
        </el-form-item>

        <el-form-item id="submit-button">
          <el-button type="success" @click="submitForm('employerForm')" :loading="loading">Сохранить</el-button>
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
      roles: [
        {role: 2, label: 'управляющий'},
        {role: 3, label: 'продавец'},
        {role: 4, label: 'кладовщик'},
      ],
      employerForm: {
        name: '',
        login: '',
        password: '',
        comment: '',
        role: 'admin'
      },
      rules:{
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        login: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        password : [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        role: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' }
        ]
      }
    }
  },
  validate({store, error}) {
    const role = store.getters['auth/userRole']
    if (role == 1) {
      return true
    }
    store.commit('setAuthError', true)
    return false
  },
  methods:{
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.employerForm.name,
            login: this.employerForm.login,
            password: this.employerForm.password,
            role: this.employerForm.role
          }
          this.loading = true
          try {
            await this.$store.dispatch('auth/create', formData)
            this.loading = false
            this.$message.success('сотрудник успешна добавлена')
            this.$router.push('/access')
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
  .el-table i {
    font-size: 20px;
    font-weight: 800;
    line-height: 40px;
    vertical-align: -webkit-baseline-middle;
  }
  .addmore{
    display: inline;
    cursor: pointer;
    color: #2688cd;
  }
</style>
