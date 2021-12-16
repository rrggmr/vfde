<template>
  <div>
    <b-tabs v-model="tab" v-if="tabSet">
      <b-tab
          v-for="(route) in routes"
          :key="route.name"
          :title="$t(route.name)"
      >
      </b-tab>
      <b-card>
        <router-view @showSidebar="toggleSidebar" @passSidebars="getSidebars" />
      </b-card>
    </b-tabs>
    <div id="sidebarContainer" v-if="sidebarContainerVisible" >
      <Sidebar
          v-for="sidebar in sidebars"
          :key="`sidebar_${sidebar.id}`"
          :sidebar-type="sidebar.type"
          :sidebar-width="sidebar.width"
          :sidebar-content="sidebar.content"
          @closeSidebar="toggleSidebar"
      />
    </div>
  </div>
</template>

<script>
import routes from "@/router/routes/config";
import Sidebar from "@/components/dashboard/Sidebar";

export default {
  name: "ConfigRouter",
  components: {Sidebar},
  data() {
    return {
      routes: routes[0].children,
      tab: 1,
      sidebarContainerVisible: false,
      sidebars: [],
      tabSet: false
    }
  },
  mounted() {
    this.setInitialTab()
  },
  methods: {
    getSidebars(sidebars) {
      this.sidebars = sidebars
    },
    setInitialTab() {
      // Needs a blank timeout or it glitches back to the initial value of 0.
      // TODO: Might be able to replace this with a promise?
      const component = this
      setTimeout(function(){
        component.tab=component.getActiveTab()
        component.tabSet = true
      }, 0);
    },
    getActiveTab() {
      const activeTabName = this.$route.path.split('/')[2]
      for (let i=0; i<this.routes.length; i++) {
        const routePath = this.routes[i].path.replace('/','').replace(/\*/g, '')
        const match = activeTabName === routePath
        if(match) {
          return i
        }
      }
      return 0
    },
    toggleSidebar(data) {
      this.sidebarType = data.type
      this.sidebarWidth = data.width
      this.sidebarContainerVisible = !this.sidebarContainerVisible
      if (!this.sidebarContainerVisible) {
        this.backToBaseUrl()
      }
    },
    backToBaseUrl() {
      const currentPath = this.$route.path
      const pathElements = currentPath.split('/')
      const editorPosition = pathElements.indexOf('editor')
      const slice = pathElements.slice(0, editorPosition)
      const newPath = slice.join('/') + '/'
      this.$router.push(newPath)
    },
  },
  watch: {
    tab() {
      const oldPath = this.$route.path
      let newPath = '/config/' + this.routes[this.tab].path.replace(/\*/g, '') + '/'
      newPath = newPath.replace('//', '/')
      const children = oldPath.replace(newPath, '')
      if (newPath !== oldPath && newPath + children !== oldPath) {
         this.$router.push(newPath)
      }
    },
    $route() {
      this.tab = this.getActiveTab()
    }
  }
}
</script>

<style scoped>

</style>
