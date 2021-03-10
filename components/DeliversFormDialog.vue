<template>
  <el-dialog
    :title="type == 'create' ? 'Добавление курьера' : 'Редактировать курьер'"
    :visible.sync="visible"
    :before-close="() => $emit('close')"
    width="600px"
  >
    <div class="form p1">
      <el-form :model="deliversForm" status-icon :rules="rules" ref="deliversForm" label-width="120px" class="demo-ruleForm">

        <el-form-item label="Ф.И.О" prop="name" >
          <el-input type="text" v-model="deliversForm.name" class="maxW35" />
        </el-form-item>
        <el-form-item label="Пароль" prop="password" >
          <el-input type="text" v-model="deliversForm.password" class="maxW35" />
        </el-form-item>

        <el-form-item id="submit-button">
          <el-button 
            type="success" 
            size="small"
            @click="submitForm('deliversForm')" 
            :loading="loading"
          >
            Сохранить
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'create'
    },
    deliver: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      deliversForm: {
        name: '',
        password: '',
      },
      rules:{
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        password : [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
      }
    }
  },
  watch: {
    type(value) {
      if (value == 'edit') {
        this.deliversForm.name = this.deliver.name
        this.deliversForm.password = this.deliver.password
      } else {
        this.$refs.deliversForm.resetFields()
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            name: this.deliversForm.name,
            password: this.deliversForm.password,
          }
          try {
            if (this.type == 'create') {
              await this.$store.dispatch('delivers/createDeliver', formData)
              this.$message.success('Курьеры успешна добавлена')
            } else {
              formData.id = this.deliver.id
              await this.$store.dispatch('delivers/updateDeliver', formData)
            }
            this.$emit('close')
          } catch (e) {
            console.log(e)
          }
        } else {
          return false;
        }
      });
    }
  }
}
</script>