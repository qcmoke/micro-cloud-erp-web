<template>
  <!--
    使用后端生成的路由表渲染左侧菜单(不包含静态路由表)
 -->
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="true"
        mode="vertical"
      >
        <!-- 遍历路由加入到菜单列表中 -->
        <sidebar-item v-for="route in userRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.setting.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.$store.state.setting.sidebar.opened
    },
    userRoutes() {
      return this.$store.state.account.routes
    }
  }
}
</script>
