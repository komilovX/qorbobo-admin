<template>
  <div>
    <div class="header p1 df bb">
      <h2>Отправка сообщение</h2>
    </div>
    <div class="form p1">
      <el-form :model="sendMessageForm" status-icon :rules="rules" ref="sendMessage" label-width="200px" label-position="top">
        <el-row :gutter="20">
          <el-col :lg="12">
            <el-form-item label="Титул на узбекском" prop="title" >
              <el-input type="text" v-model="sendMessageForm.title" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="Титул на русском" prop="title_ru" >
              <el-input type="text" v-model="sendMessageForm.title_ru" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="Сообщение на узбекском" prop="message">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="Please input"
                v-model="sendMessageForm.message">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="Сообщение на русском" prop="message_ru">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="Please input"
                v-model="sendMessageForm.message_ru">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="Время отп-сооб" prop="date" >
              <el-date-picker
                v-model="sendMessageForm.date"
                type="datetime"
                format= "dd-MM-yyyy HH:mm"
                placeholder="Select date and time">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <img v-image="message.photo">
          </el-col>
          <el-col>
            <el-form-item>
              <el-button type="success" @click="submitForm('sendMessage')" :loading="loading" class="ml1">
                Сохранить
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({store, error, route}) {
    try {
      const message = await store.dispatch('send_message/findById', route.params.id)
      return {message}
    } catch (e) {
      console.log(e)
    }
  },
  data(){
    return{
      loading: false,
      title:'',
      sendMessageForm: {
        date : null,
        title: '',
        title_ru: '',
        message: '',
        message_ru: '',
      },
      rules:{
        date: [
          { required: true, message: 'Пожалуйста, заполните эту форму', trigger: 'blur' },
        ],
        title: [
          { required: true, message: 'Пожалуйста, заполните эту форму', trigger: 'blur' },
        ],
        title_ru: [
          {  required: true, message: 'Пожалуйста, заполните эту форму', trigger: 'blur'},
        ],
        message: [
          { required: true, message: 'Пожалуйста, заполните эту форму', trigger: 'blur' }
        ],
        message_ru: [
          { required: true, message: 'Пожалуйста, заполните эту форму', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.sendMessageForm.date = this.message.date
    this.sendMessageForm.title = this.message.title
    this.sendMessageForm.title_ru = this.message.title_ru
    this.sendMessageForm.message = this.message.message
    this.sendMessageForm.message_ru = this.message.message_ru
  },
  methods:{
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          const formData = {
            date: this.sendMessageForm.date,
            title: this.sendMessageForm.title,
            title_ru: this.sendMessageForm.title_ru,
            message: this.sendMessageForm.message,
            message_ru: this.sendMessageForm.message_ru
          }
          try {
            await this.$store.dispatch('send_message/updateById', {id: this.$route.params.id, formData})
            this.loading = false
            this.$message.success('Сообщение успешна обнавлена')
            await this.$router.push('/send_message')
          } catch (error) {
            this.loading = false
            console.log(error);
          }
        } else {
          return false;
        }
      });
    },
  },
  validate({store}) {
    const role = store.getters['auth/userRole']
    if (role == 1 || role == 2) {
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
    max-width: 368px;
    max-height: 180px;
  }
  label span{
    color: #888;
    font-size: .9em
  }
</style>
