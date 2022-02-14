const path = require("path");
const fs = require("fs");

const Category = require("../models/category.model");
const Product = require("../models/product.model");

// ============== Category =========================

module.exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      name_ru: req.body.name_ru,
      photo: req.file.filename,
      parent_category: req.body.parent_category
    });
    res.json(category);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.findAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ raw: true });
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports.findAllSortedCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ raw: true });
    let parents = categories.filter(c => c.parent_category == 0);
    let childs = categories.filter(c => c.parent_category !== 0);
    childs.sort((a, b) => b.id - a.id);
    childs.forEach(e => {
      let index = childs.findIndex(f => f.id == e.parent_category);
      if (index !== -1) {
        if (childs[index].children) {
          childs[index].children.push(e);
        } else {
          childs[index].children = [e];
        }
      }
    });
    childs.forEach(e => {
      let index = parents.findIndex(f => f.id == e.parent_category);
      if (index !== -1) {
        if (parents[index].children) {
          parents[index].children.push(e);
        } else {
          parents[index].children = [e];
        }
      }
    });
    res.json(parents);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports.findCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(+req.params.id);
    res.json(category);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.updateCategoryById = async (req, res) => {
  try {
    if (!req.file) {
      await Category.update(
        {
          name: req.body.name,
          name_ru: req.body.name_ru,
          parent_category: req.body.parent_category
        },
        { where: { id: req.params.id } }
      );
    } else {
      const category = await Category.findByPk(+req.params.id);
      let photo = category.photo.replace("/", "");
      let way = path.resolve(__dirname, `../../static/uploads/${photo}`);

      fs.unlinkSync(way);
      await Category.update(
        {
          name: req.body.name,
          name_ru: req.body.name_ru,
          photo: req.file.filename,
          parent_category: req.body.parent_category
        },
        { where: { id: +req.params.id } }
      );
    }
    res.json({ message: "updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.deleteCategoryById = async (req, res) => {
  try {
    await Category.destroy({ where: { id: req.params.id } });
    await Product.destroy({ where: { category_id: req.params.id } });
    res.json({ message: "deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.hideCategoryById = async (req, res) => {
  try {
    await Category.update(
      { hidden: req.body.hide },
      { where: { id: +req.params.id } }
    );
    res.json({ message: "updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};
// ================   END   ==================

// ================ Product ==================

module.exports.createProduct = async (req, res) => {
  try {
    await Product.create({
      name: req.body.name,
      name_ru: req.body.name_ru,
      category_name: req.body.category_name,
      category_id: req.body.category_id,
      comment: req.body.comment,
      comment_ru: req.body.comment_ru,
      photo: req.file.filename
    });
    res.json({ message: "created" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.findProductById = async (req, res) => {
  try {
    const category = await Product.findByPk(+req.params.id);
    res.json(category);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.findAllProducts = async (req, res) => {
  try {
    res.json(res.result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json(error);
  }
};

module.exports.updateProductById = async (req, res) => {
  try {
    if (req.file) {
      const product = await Product.findByPk(+req.params.id);
      let photo = product.photo.replace("/", "");
      let way = path.resolve(__dirname, `../../static/uploads/${photo}`);
      await Product.update(
        {
          name: req.body.name,
          name_ru: req.body.name_ru,
          category_name: req.body.category_name,
          category_id: req.body.category_id,
          brand: req.body.brand,
          brand_id: req.body.brand_id,
          barcode: req.body.barcode,
          comment: req.body.comment,
          comment_ru: req.body.comment_ru,
          photo: req.file.filename
        },
        { where: { id: req.params.id } }
      );
      fs.unlinkSync(way);
    } else {
      await Product.update(
        {
          name: req.body.name,
          name_ru: req.body.name_ru,
          category_name: req.body.category_name,
          category_id: req.body.category_id,
          brand: req.body.brand,
          brand_id: req.body.brand_id,
          barcode: req.body.barcode,
          comment: req.body.comment,
          comment_ru: req.body.comment_ru
        },
        { where: { id: req.params.id } }
      );
    }
    res.json({ message: "updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports.hideProductById = async (req, res) => {
  try {
    await Product.update(
      { hidden: req.body.hide },
      { where: { id: +req.params.id } }
    );
    res.json({ message: "updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.deleteProductById = async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: "deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};
