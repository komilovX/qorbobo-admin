<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="$router.back()"></i>
      <h2>Добавление сообщения</h2>
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
            <el-form-item label="Фотография">
              <el-upload
              ref="upload"
              class="upload-demo"
              drag
              action="http://localhost:3000"
              :on-change="handleAvatarChange"
              :auto-upload="false"
              :on-exceed="handleExceed"
              :on-remove="handleRemove"
              :limit="1"
              >
                <template v-if="!imgUrl">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">Перетащите картинку <em>или нажмите</em></div>
                  <div class="el-upload__tip" slot="tip">файлы с расширением jpg/png</div>
                </template>
                <img :src="imgUrl" alt="">
              </el-upload>
            </el-form-item>
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
  data(){
    return{
      loading: false,
      imgUrl: '',
      title:'',
      file: null,
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
  methods:{
    handleAvatarChange(file, fileList) {
      let type = file.raw.type
      const isJPG = type === 'image/jpeg' || type === 'image/png'
      if (!isJPG) {
        this.imgUrl = ''
        fileList = []
        this.$refs.upload.clearFiles()
        this.$message.error('файлы толка с расширением jpg/png ')
        return
      }
      this.imgUrl = URL.createObjectURL(file.raw);
      this.file = file
    },
    handleExceed(files, fileList) {
      this.$message.warning('Вы можете загрузить только один файл')
    },
    handleRemove(file, fileList){
      this.imgUrl = ''
      fileList = []
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this.file) {
          this.loading = true
          const formData = {
            date: this.sendMessageForm.date,
            title: this.sendMessageForm.title,
            title_ru: this.sendMessageForm.title_ru,
            message: this.sendMessageForm.message,
            message_ru: this.sendMessageForm.message_ru,
            image: this.file.raw
          }
          try {
            await this.$store.dispatch('send_message/createMessage', formData)
            this.loading = false
            this.$message.success('Сообщение успешна добавлена')
            await this.$router.push('/send_message')
          } catch (error) {
            this.loading = false
            console.log(error);
          }
        } else {
          if (!this.file) {
            this.$message.error('фото не выбрано')
          }
          return false;
        }
      });
    },
  },
}
</script>
<style lang="scss" scoped>
  // .form {
  //   text-align: center;
  // }
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
