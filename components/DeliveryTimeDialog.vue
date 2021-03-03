<template>
  <el-dialog
      title="Время доставки"
      :visible.sync="visible"
      :before-close="() => $emit('close')"
      width="600px"
    >
      <div style="margin-bottom: 2rem">
        <h4>Русский</h4>
        <el-divider />
        <el-tag
          :key="tag.id"
          v-for="tag in times"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{ tag.time }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-model="inputValue"
          ref="saveTagInput"
          size="mini"
        />
      </div>
      <div>
        <h4>Uzbek</h4>
        <el-divider />
        <el-tag
          :key="tag.id"
          v-for="tag in times"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{ tag.time_uz }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-model="inputValueUz"
          ref="saveTagInput"
          size="mini"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleInputConfirm">
          Сохранить
        </el-button>
      </span>
    </el-dialog>
</template>
<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

<script>
  export default {
    data() {
      return {
        inputVisible: false,
        inputValue: '',
        inputValueUz: ''
      };
    },
    props: {
      times: {
        type: Array,
        required: true
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      async handleClose(tag) {
        try {
          await this.$store.dispatch('order/deleteDeliveryTime', tag.id)
          this.$emit('deleted', tag.id)
        } catch (error) {
          console.log(error)
        }
      },
      async handleInputConfirm() {
        try {
          if (this.inputValue && this.inputValueUz) {
            const data = {
              time: this.inputValue,
              time_uz: this.inputValueUz
            }
            const time = await this.$store.dispatch('order/createDeliveryTime', data)
            this.$emit('created', time)
            this.inputValue = '';
            this.inputValueUz = '';
          } else {
            this.$message.error('заполнить поля')
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>