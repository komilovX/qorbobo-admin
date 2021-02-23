<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Редактировать категорию</h2>
    </div>
    <div class="form p1">
      <el-form :model="categoryForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <div class="bb mb1">
          <el-form-item label="Название" prop="name" >
            <el-input type="text" v-model="categoryForm.name" class="maxW35"></el-input>
          </el-form-item>
          <el-form-item label="Название RU" prop="name_ru" >
            <el-input type="text" v-model="categoryForm.name_ru" class="maxW35"></el-input>
          </el-form-item>
          <el-form-item label="Категория" prop="category">
            <el-select v-model="categoryForm.category" style="min-width:35vw">
              <el-option label="Главный экран" :value="0"></el-option>
              <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id" :style="{'padding-left':c.padding+'px'}"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Фотография">
            <img v-image="category.photo" class="mb1">
            <el-upload
              ref="uploadCategoryId"
              action="http://localhost:3000"
              :on-change="handleAvatarChange"
              :on-remove="handleRemove"
              :auto-upload="false"
              :limit="1"
              :on-exceed="handleExceed"
            >
              <el-button size="small" type="primary">Загрузить...</el-button>
              <div slot="tip" class="el-upload__tip">файлы с расширением jpg/png</div>
            </el-upload>
          </el-form-item>
        </div>
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
  async asyncData({store, route}) {
    try {
      if (store.getters['category/categories'].length == 0) {
        await store.dispatch('category/findAllCategories')
      }
      const categories = store.getters['category/categories']
      const category = categories.find(f => f.id == route.params.id)
      return {categories, category}
    } catch (e) {
      console.log(e)
    }
  },
  data(){
    return{
      loading: false,
      file: null,
      categoryForm: {
        name: '',
        name_ru: '',
        category: '',
        photo:'ss'
      },
      rules:{
        name_ru: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' }
        ],
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
          { min: 3, message: 'Длина должна быть не менее 3 букв', trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    this.categoryForm.name = this.category.name
    this.categoryForm.name_ru = this.category.name_ru
    this.categoryForm.category = this.category.parent_category
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
        this.$refs.uploadCategoryId.clearFiles()
        this.$message.error('файлы толка с расширением jpg/png ')
        return
      }
      this.file = file
    },
    handleExceed(files, fileList) {
      this.$message.warning('Вы можете загрузить только один файл')
    },
    handleRemove(file, fileList){
      fileList = []
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true

            const formData = {
              id: this.$route.params.id,
              name: this.categoryForm.name,
              name_ru: this.categoryForm.name_ru,
              category: this.categoryForm.category,
            }
            
            if (this.file) {
              formData.image = this.file.raw
            }
            await this.$store.dispatch('category/updateCategoryById', formData)
            this.loading = false
            this.$router.push('/menu/categories')
          } catch (error) {
            this.loading = false
            console.log('error', error);
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
