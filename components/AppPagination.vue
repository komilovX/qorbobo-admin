<template>
  <div class="p1">
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      @current-change="currentChange"
      :total="size*10/limit">
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    size: Number,
    limit: {
      type: Number,
      default: process.env.limit
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  methods: {
    currentChange( val ) {
      this.$emit('paginationChange', val)
    }
  }
}
</script>
