<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Новая категория</h2>
    </div>
    <div class="form p1">
      <el-form :model="categoryForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="Название" prop="name" >
          <el-input type="text" v-model="categoryForm.name" class="maxW35"></el-input>
        </el-form-item>
        <el-form-item label="Название RU" prop="name_ru" >
          <el-input type="text" v-model="categoryForm.name_ru" class="maxW35"></el-input>
        </el-form-item>
        <el-form-item label="Категория" prop="category">
          <el-select v-model="categoryForm.parent_category" style="min-width:35vw">
            <el-option label="Главный экран" :value="0"></el-option>
            <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id" :style="{'padding-left':c.padding+'px'}"/>
          </el-select>
        </el-form-item>
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
        <el-form-item>
          <el-button type="success" @click="submitForm('ruleForm')" :loading="loading">Сохранить </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import categoryList from '@/mixins/categoryList';
export default {
  middleware: ['admin-auth'],
  async fetch({store}) {
    try {
      if (store.getters['category/categories'].length == 0) {
        await store.dispatch('category/findAllCategories')
      }
    } catch (e) {
      console.log(e)
    }
  },
  data(){
    return{
      loading: false,
      imgUrl: '',
      file: null,
      categoryForm: {
        name_ru: '',
        name: '',
        parent_category: 0,
      },
      rules:{
        name_ru: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' }
        ],
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' },
          { min: 3, message: 'Длина должна быть не менее 3 букв', trigger: 'change' }
        ],
      }
    }
  },
  mixins: [categoryList],
  methods:{
    goToBack() {
      this.$router.back()
    },
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
    readData(f) {
      return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(f);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this.file) {
          this.loading = true
          const data = await this.readData(this.file.raw);

          const instance = await this.$cloudinary.upload(data, {
            folder: 'upload',
            uploadPreset: 'mbcobawt',
          })

          const formData = {
            name: this.categoryForm.name,
            name_ru: this.categoryForm.name_ru,
            parent_category: this.categoryForm.parent_category,
            photo: instance.secure_url
          }
          try {
            await this.$store.dispatch('category/createCategory', formData)
            await this.$store.dispatch('category/findAllCategories')
            this.$message.success('категория успешна добавлена')
            this.$router.push('/menu/categories')
          } catch (error) {
            this.loading = false
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
    max-width: 368px;
    max-height: 180px;
  }
</style>
