export default {
  computed: {
    categoryList() {
      const categories = this.$store.getters['category/categories']
      let parents = categories.filter(c => c.parent_category == 0)
      const children = categories.filter(c => c.parent_category !== 0)
      children.forEach(e => {
        let index = parents.findIndex(f => f.id == e.parent_category)
        let child = e
        child.padding = parents[index].padding ? parents[index].padding + 10 : 30
        parents.splice(index+1, 0, child)
      });
      return parents
    }
  }
}
