<template>
  <div id="scrollinElement">
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="$router.back()"></i>
      <h2>Добавление карточки сотрудника</h2>
    </div>
    <div class="form p1">
      <el-form :model="adminForm" status-icon :rules="rules" ref="adminForm" label-width="200px" class="demo-ruleForm">

        <el-form-item label="Имя" prop="name" >
          <el-input type="text" v-model="adminForm.name" class="maxW35" />
        </el-form-item>
        <el-form-item label="Логин" prop="login" >
          <el-input type="text" v-model="adminForm.login" class="maxW35" />
        </el-form-item>
        <el-form-item label="Пароль" prop="password">
          <el-button type="text" v-if="!changePassword" @click="needPassword()">
            Сменить пароль
          </el-button>
          <el-input v-else type="password" v-model="adminForm.password" class="maxW35" />
        </el-form-item>
        <el-form-item label="Должность" prop="role">
          <el-select v-model="adminForm.role" :disabled="adminForm.role == 'creator'" style="min-width:35vw">
            <el-option :label="selectLabel" :value="admin.role" />
          </el-select>
        </el-form-item>

        <el-form-item id="submit-button">
          <el-button type="success" @click="submitForm('adminForm')" :loading="loading">Сохранить</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({store, route, error}) {
    try {
      const admin = await store.dispatch('auth/findById', route.params.id)
      return {admin}
    } catch (e) {
      console.log(e)
    }
  },
  data(){
    return{
      loading: false,
      changePassword: false,
      adminForm: {
        name: '',
        login: '',
        password: '',
        comment: '',
        role: ''
      },
      rules:{
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        login: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        password : [
          { required: false, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        role: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' }
        ]
      }
    }
  },
  validate({store}) {
  const role = store.getters['auth/userRole']
    if (role == 1) {
      return true
    }
    store.dispatch('setAuthError', true)
    return false
  },
  mounted() {
    this.adminForm.name = this.admin.name
    this.adminForm.login = this.admin.login
    this.adminForm.role = this.admin.role
  },
  methods:{
    needPassword() {
      this.changePassword = true
      this.rules.password[0].required = true
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.adminForm.name,
            login: this.adminForm.login,
            password: this.adminForm.password,
            role: this.adminForm.role
          }
          this.loading = true
          try {
            await this.$store.dispatch('auth/updateById', {id: this.$route.params.id, formData})
            this.loading = false
            this.$message.success('Сотрудник успешна обнавлена')
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
  computed: {
    selectLabel() {
      const roles = [
        {role: 1, label: 'владелец'},
        {role: 2, label: 'управляющий'},
        {role: 3, label: 'продавец'},
        {role: 4, label: 'кладовщик'},
      ]
      return roles.find(f => f.role == this.admin.role).label
    }
  }
}
</script>
<style>
  .el-form label {
    text-align: left;
  }
</style>
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
  #submit-button{
    margin-top: 2rem
  }
</style>
