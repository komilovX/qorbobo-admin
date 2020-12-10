<template>
  <div>
    <template v-if="!hasOneShowingChild(item)">
      <el-menu-item :index="item.path" :class="{'submenu-title-noDropdown':true}">
          <i :class="getInfo(item).icon"></i>
          <span slot="title">{{getInfo(item).name}}</span>
      </el-menu-item>
    </template>

    <el-submenu v-else :index="item.path" popper-append-to-body>
      <template slot="title">
        <i :class="getInfo(item).icon"></i>
        <span slot="title">{{getInfo(item).name}}</span>
      </template>
      <el-menu-item v-for="i in childrens(item.children)" :key="i.name" :index="`${item.path}/${i.path}`">{{getSubInfo(i).name}}</el-menu-item>
    </el-submenu>
  </div>
</template>

<script>
import {navlinks, hiddenChildren} from '@/assets/navlinks'

export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {}
  },
  methods: {
    hasOneShowingChild(item) {
      return item.children ? true : false
    },
    getInfo(item){
      const info = navlinks.find(f => f.path == item.path)
      return info
    },
    getSubInfo(item){
      const info = navlinks.find(f => f.path == `/${item.path}`)
      return info
    },
    childrens(items){
      return items.filter(i => !hiddenChildren.includes(i.path) && i.path.indexOf('/') == -1)
    }
  }
}
</script>
