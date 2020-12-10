<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in getBreadcrumb" :key="item.path">
        <span v-if="index==getBreadcrumb.length-1" class="no-redirect">{{ item.name }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.name }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { routes } from '@/assets/navlinks'
export default {
  data() {
    return {
      levelList: null
    }
  },
  methods: {
    handleLink(item) {
      this.$router.push(item.origin)
    }
  },
  computed: {
    getBreadcrumb() {
      let path = this.$route.path.split('/')
      path.shift()
      let levelList = path.map((item, index) => {
        const p = routes.find(n => n.path == `/${item}`)
        if (p) {
          return p
        }
        else {
          return {path: item, name: item}
        }
      })
      levelList = levelList.filter(l => !l.hidden)
      if (levelList.length == 1 && levelList[0].path == '/') {
        return levelList
      }
      else {
        levelList.unshift({path: '/', name:'Главная', origin: '/'})
        return levelList
      }
      return
    },
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
