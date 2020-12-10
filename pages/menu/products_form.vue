<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Новый товар</h2>
    </div>
    <div class="form p1">
      <el-form :model="productForm" status-icon :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="Название" prop="name" >
          <el-input type="text" v-model="productForm.name" class="maxW35"></el-input>
        </el-form-item>
        <el-form-item label="Название RU" prop="name_ru" >
          <el-input type="text" v-model="productForm.name_ru" class="maxW35"></el-input>
        </el-form-item>
        <el-form-item label="Категория" prop="category">
          <el-select v-model="productForm.category" style="min-width:35vw">
            <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id" :style="{'padding-left':c.padding+'px'}"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Комментарий" prop="comment">
          <el-input
            class="maxW35"
            type="textarea"
            :rows="3"
            placeholder="Please input"
            v-model="productForm.comment">
          </el-input>
        </el-form-item>
        <el-form-item label="Комментарий RU" prop="comment_ru">
          <el-input
            class="maxW35"
            type="textarea"
            :rows="3"
            placeholder="Please input"
            v-model="productForm.comment_ru">
          </el-input>
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
      if (store.getters['category/categories'].length === 0) {
        await store.dispatch('category/findAllCategories')
      }
    } catch (error) {
      console.log(error)
    }
  },
  data(){
    return{
      loading: false,
      imgUrl: '',
      file: null,
      productForm: {
        name: '',
        name_ru: '',
        category: null,
        comment: '',
        comment_ru: '',
      },
      rules:{
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' },
          { min: 3, message: 'Длина должна быть не менее 3 букв', trigger: 'change' }
        ],
        name_ru: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' },
        ],
        category: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' }
        ],
        comment: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' }
        ],
        comment_ru: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' }
        ]
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
          try {
            this.loading = true
            const data = await this.readData(this.file.raw);

            const instance = await this.$cloudinary.upload(data, {
              folder: 'upload',
              uploadPreset: 'mbcobawt',
            })

            let { name } = this.$store.getters['category/categories'].find(f => f.id === this.productForm.category)
            const formData = {
              name: this.productForm.name,
              name_ru: this.productForm.name_ru,
              category_id: this.productForm.category,
              category_name: name,
              comment: this.productForm.comment,
              comment_ru: this.productForm.comment_ru,
              photo: instance.secure_url
            }
          
            await this.$store.dispatch('product/createProduct', formData)
            this.loading = false
            this.$message.success('товар успешна добавлена')
            await this.$router.push('/menu/products')
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
  label span{
    color: #888;
    font-size: .9em
  }
</style>
