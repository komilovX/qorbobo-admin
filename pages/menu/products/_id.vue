<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Редактирование товара</h2>
    </div>
    <div class="form p1">
      <el-form :model="productForm" status-icon :rules="rules" ref="editProductForm" label-width="120px" class="demo-ruleForm">
        <div class="bb mb1">
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
            <img v-image="product.photo" class="mb1">
            <el-upload
            ref="uploadCategoryId"
            action="https://jsonplaceholder.typicode.com/posts/"
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
          <el-button type="success" @click="submitForm('editProductForm')" :loading="loading">Сохранить </el-button>
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
      await store.dispatch('category/findAllCategories')
      const product = await store.dispatch('product/findProductById', route.params.id)
      return { product }
    } catch (error) {
      console.log(e)
    }
  },
  data(){
    return{
      loading: false,
      file: null,
      productForm: {
        name: '',
        name_ru: '',
        category: null,
        comment: '',
        comment_ru: '',
      },
      rules:{
        name_ru: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        comment: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' }
        ],
        comment_ru: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' }
        ]
      }
    }
  },
  mixins: [categoryList],
  mounted() {
    this.productForm.name = this.product.name
    this.productForm.name_ru = this.product.name_ru
    this.productForm.category = this.product.category_id
    this.productForm.comment = this.product.comment
    this.productForm.comment_ru = this.product.comment_ru
  },
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
      this.$refs[formName].validate( async (valid) => {
        if (valid) {
          try {
            this.loading = true
            let { name } = this.$store.getters['category/categories'].find(f => f.id == this.productForm.category)
            const formData = {
              id: this.$route.params.id,
              name: this.productForm.name,
              name_ru: this.productForm.name_ru,
              category_id: this.productForm.category,
              category_name: name,
              comment: this.productForm.comment,
              comment_ru: this.productForm.comment_ru
            }
            if (this.file) {
              formData.image = this.file.raw
            }
          
            await this.$store.dispatch('product/updateProductById', formData)
            this.loading = false
            this.$message.success('продукт успешно обновлен')
            this.$router.push('/menu/products')
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
  label span{
    color: #888;
    font-size: .9em
  }
</style>
