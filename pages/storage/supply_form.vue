<template>
  <div id="scrollinElement">
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Поставка</h2>
    </div>
    <div class="form p1">
      <el-form
        :model="supplyForm"
        status-icon
        :rules="rules"
        ref="supplyForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item label="Дата и время поставки" prop="date">
          <el-date-picker
            v-model="supplyForm.date"
            type="datetime"
            format="dd-MM-yyyy HH:mm"
            placeholder="Select date and time"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Поставщик" prop="supplier">
          <el-select v-model="supplyForm.supplier" style="min-width:35vw">
            <el-option v-for="s in suppliers" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Склад" prop="store">
          <el-select v-model="supplyForm.store" style="min-width:35vw">
            <el-option v-for="s in stores" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="Комментарий" prop="comment" class="mb4">
          <el-input
            class="maxW35"
            type="textarea"
            :rows="2"
            placeholder="Комментарий"
            v-model="supplyForm.comment"
          ></el-input>
        </el-form-item>
        <el-upload
          ref="upload"
          class="upload-demo"
          action="http://localhost:3000"
          :on-change="handleAvatarChange"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :limit="1"
        >
          <el-button size="small" type="primary">
            Файл excel
            <i class="el-icon-upload el-icon-right" />
          </el-button>
        </el-upload>
        <el-form-item label-width="0" prop="items">
          <el-table :data="supplyForm.items">
            <el-table-column label="Наименование" width="300">
              <template slot-scope="{row,$index}">
                <span v-if="row.conflict" class="top-conflict">{{row.conflict}}</span>
                <el-select
                  v-model="supplyForm.items[$index].id"
                  style="width: 100%"
                  :class="{'mb1':!!row.conflict} "
                >
                  <el-option v-for="s in products" :key="s.id" :label="s.name" :value="s.id" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="Количество" width="180">
              <template slot-scope="{$index}">
                <el-input
                  type="text"
                  @input="checkValue($index)"
                  v-model="supplyForm.items[$index].amount"
                  style="width: 160px"
                  class="mr1"
                >
                  <template slot="append">ШТ</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="Цена за единицу" width="180">
              <template slot-scope="{$index}">
                <el-input
                  @input="multiplyValue($index)"
                  type="text"
                  v-model="supplyForm.items[$index].cost"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Цена за продажу" width="180">
              <template slot-scope="{$index}">
                <el-input type="text" v-model="supplyForm.items[$index].price"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="Общая сумма" width="250">
              <template slot-scope="{$index}">
                <el-input
                  type="text"
                  @input="checkTotal($index)"
                  v-model="supplyForm.items[$index].total"
                  style="width: 160px"
                  class="mr1"
                ></el-input>
                <el-button
                  @click="deleteItem($index)"
                  type="warning"
                  style="display: inline"
                  size="small"
                  icon="el-icon-delete"
                  plain
                  circle
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="df addmore" @click="addMore">
            <i class="el-icon-plus"></i>
            <span>Добавить еще</span>
          </div>
        </el-form-item>

        <el-form-item label-width="0" id="submit-button">
          <el-button type="success" @click="submitForm('supplyForm')" :loading="loading">Сохранить</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="Импорт поставки" :visible.sync="dialogVisible" width="70%">
      <strong>Выберите столбцы, содержание которых импортируете:</strong>
      <div class="collumns mt1">
        <div class="collumn" v-for="(v, index) in Object.keys(jsonData)" :key="index">
          <div class="column-header mb1">
            <strong>{{selectOptions[`${index}`]}}</strong>
          </div>
          <el-table :data="jsonData[`${v}`]" size="small">
            <el-table-column :label="v" show-overflow-tooltip>
              <template slot-scope="{row}">{{row}}</template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Отменить</el-button>
        <el-button type="primary" @click="confirmData">Продолжить</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  async asyncData({ store }) {
    try {
      const { suppliers, stores, products } = await store.dispatch(
        "supply/findAllDetails"
      );
      return { suppliers, stores, products };
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    const itemsValidator = (rule, value, callback) => {
      let checkIsEmpty = false;
      let isNumber = true;
      value.forEach(v => {
        delete v.conflict;
        Object.keys(v).forEach((i, index) => {
          if (!v[`${i}`]) {
            checkIsEmpty = true;
            return;
          }
          if (index != 0 && !parseFloat(v[`${i}`])) {
            isNumber = false;
            return;
          }
        });
      });
      if (checkIsEmpty) {
        callback(new Error("пожалуйста, заполните форму правильно"));
      }
      if (!isNumber) {
        callback(new Error("пожалуйста, заполните форму правильно"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      file: null,
      dialogVisible: false,
      jsonData: [],
      select: {},
      selectOptions: {
        0: "Наименование",
        1: "Количество",
        2: "Цена за единицу",
        3: "Цена за продажу"
      },
      supplyForm: {
        date: new Date(),
        supplier: "",
        store: "",
        comment: "",
        items: [{ id: "", amount: "", cost: "", price: "", total: "" }]
      },
      rules: {
        date: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur"
          }
        ],
        supplier: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur"
          }
        ],
        store: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "blur"
          }
        ],
        items: [
          {
            type: "array",
            required: true,
            trigger: "submit",
            validator: itemsValidator
          }
        ]
      }
    };
  },
  methods: {
    goToBack() {
      this.$router.back();
    },
    confirmData() {
      const data = Object.values(this.jsonData).slice(0, 4);
      if (data.length == 4) {
        let minLength = data[0].length;
        data.forEach(f => (f.length < minLength ? (minLength = f.length) : ""));
        this.supplyForm.items = [];
        for (let i = 0; i < minLength; i++) {
          let product = this.products.find(p => p.name == data[0][i]);
          let total = Number(data[1][i] * data[2][i]);
          if (product) {
            if (total) {
              this.supplyForm.items.push({
                id: product.id,
                amount: data[1][i],
                cost: data[2][i],
                price: data[3][i],
                total
              });
            } else {
              this.supplyForm.items.push({
                id: product.id,
                amount: "",
                cost: "",
                price: data[3][i],
                total: ""
              });
            }
          } else {
            this.supplyForm.items.push({
              id: "",
              amount: data[1][i],
              cost: data[2][i],
              price: data[3][i],
              total,
              conflict: data[0][i]
            });
          }
        }
        this.dialogVisible = false;
        this.$refs.upload.clearFiles();
      } else {
        this.$message.error("File invalid!");
      }
    },
    // file upload
    handleAvatarChange(file, fileList) {
      let name = file.raw.name;
      let result = name.substring(name.lastIndexOf(".") + 1, name.length);
      if (result == "xls" || result == "xlsx") {
        let self = this;
        const reader = new FileReader();
        reader.onload = function(event) {
          const data = event.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          workbook.SheetNames.forEach(sheet => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheet]
            );
            if (rowObject) {
              let resultObj = {};
              rowObject.forEach(val => {
                Object.keys(val).forEach(v => {
                  if (resultObj.hasOwnProperty(`${v}`)) {
                    resultObj[`${v}`].push(val[`${v}`]);
                  } else {
                    resultObj[`${v}`] = [val[`${v}`]];
                  }
                });
              });
              self.jsonData = resultObj;
              self.dialogVisible = true;
            }
          });
        };
        reader.readAsBinaryString(file.raw);
      } else {
        fileList = [];
        this.$refs.upload.clearFiles();
        this.$message.error("файлы толка с расширением xls/xlsx ");
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning("Вы можете загрузить только один файл");
    },
    handleRemove(file, fileList) {
      fileList = [];
    },
    addMore() {
      const body = document.getElementsByTagName("body")[0];
      this.supplyForm.items.push({
        id: "",
        amount: "",
        cost: "",
        price: "",
        total: ""
      });
      window.scrollTo(
        0,
        document.querySelector("#scrollinElement").scrollHeight
      );
    },
    deleteItem(index) {
      this.supplyForm.items.splice(index, 1);
    },
    checkValue(index) {
      const { amount, cost, total } = this.supplyForm.items[index];
      const isNumber = parseFloat(amount) && parseFloat(cost);
      if (isNumber) {
        this.supplyForm.items[index].total = Number(+amount * cost).toFixed(2);
      }
    },
    multiplyValue(index) {
      const { amount, cost, total } = this.supplyForm.items[index];
      const isNumber = parseFloat(amount) && parseFloat(cost);
      if (isNumber) {
        this.supplyForm.items[index].total = Number(+amount * cost).toFixed(2);
      }
    },
    checkTotal(index) {
      const { amount, cost, total } = this.supplyForm.items[index];
      const isNumber = parseFloat(amount) && parseFloat(total);
      if (isNumber) {
        this.supplyForm.items[index].cost = Number(+total / amount).toFixed(2);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const total = this.supplyForm.items.reduce(
            (acc, cur) => acc + Number(cur.total),
            0
          );
          let supplier_name = this.suppliers.find(
            f => f.id == +this.supplyForm.supplier
          );
          let store_name = this.stores.find(
            f => f.id == +this.supplyForm.store
          );
          let products = [];
          this.supplyForm.items.forEach(p => {
            let { name } = this.products.find(f => f.id == p.id);
            products.push({ ...p, name });
          });
          const formData = {
            date: this.supplyForm.date,
            supplier_name: supplier_name.name,
            supplier_id: this.supplyForm.supplier,
            store_name: store_name.name,
            store_id: this.supplyForm.store,
            comment: this.supplyForm.comment,
            products: JSON.stringify(products),
            total: parseFloat(total)
          };
          this.loading = true;
          try {
            await this.$store.dispatch("supply/createSupply", formData);
            this.loading = false;
            this.$message.success("поставка успешна добавлена");
            this.$router.push("/storage/supply");
          } catch (e) {
            this.loading = false;
            console.log(e);
          }
        } else {
          return false;
        }
      });
    }
  },
  validate({ store }) {
    const role = store.getters["auth/userRole"];
    if (role != 3) {
      return true;
    }
    store.dispatch("setAuthError", true);
    return false;
  }
};
</script>
<style>
.el-form label {
  text-align: left;
}
</style>
<style lang="scss" scoped>
.header i {
  font-weight: 800;
  font-size: 20px;
  color: #2688cd;
  cursor: pointer;
}
img {
  max-width: 125px;
  max-height: 95px;
}
.el-table i {
  font-size: 20px;
  font-weight: 800;
  line-height: 40px;
  vertical-align: -webkit-baseline-middle;
}
.addmore {
  display: inline;
  cursor: pointer;
  color: #2688cd;
}
#submit-button {
  margin-bottom: 0 !important;
}
.collumns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
}
.collumn {
  padding: 1rem;
  height: 300px;
  min-width: 250px;
  border: 2px dashed #409eff;
  border-radius: 5px;
  margin-right: 1rem;
  overflow-y: auto;
}
.column-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
