<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        router
      >
      <!-- <el-menu-item v-for="i in item" :key="i.name" :index="i.puth">
        <i :class="i.icon"></i>
        <span slot="title">{{i.name}}</span>
      </el-menu-item> -->
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
// import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { sortlinks } from '@/assets/navlinks'
export default {
  // components: { SidebarItem, Logo },
  data(){
    return {
    }
  },
  components:{SidebarItem},
  computed: {
    routes() {
      let routes = []
      sortlinks.forEach(l => {
        let link = this.$router.options.routes.find(f => f.path == l.path)
        routes.push(link)
      })
      return routes
    },
    // activeMenu() {
    //   const route = this.$route
    //   const { meta, path } = route
    //   // if set path, the sidebar will highlight the path you set
    //   if (meta.activeMenu) {
    //     return meta.activeMenu
    //   }
    //   return path
    // },
    showLogo() {
      return this.$store.getters['settings/sidebarLogo']
    },
    variables() {
      return variables
    },
    isCollapse() {
      const sidebar = this.$store.getters['app/sidebar']
      return !sidebar.opened
    }
  }
}
</script>
