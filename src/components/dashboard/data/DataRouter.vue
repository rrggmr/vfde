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
        <router-view @showSidebar="showSidebar" @passSidebars="getSidebars" />
      </b-card>
    </b-tabs>
    <div id="sidebarContainer" v-if="sidebarContainerVisible" >
      <Sidebar
          v-for="(sidebar, index) in sidebars"
          :key="`sidebar_${sidebar.id}`"
          :sidebar-type="sidebar.type"
          :sidebar-width="sidebar.width"
          :sidebar-content="sidebar.content"
          @closeSidebar="collapseSidebar(index)"
          @expandNestedData="expandNestedData"
      />
    </div>
  </div>
</template>

<script>
import routes from "@/router/routes/data";
import Sidebar from "@/components/dashboard/Sidebar";
import sidebarMethods from "@/mixins/sidebarMethods";

export default {
  name: "DataRouter",
  components: {Sidebar},
  mixins: [
    sidebarMethods
  ],
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
    expandNestedData(newSidebarContent) {
      // this.sidebars.push(newSidebar)
      const sidebarContainer = document.getElementById("sidebarContainer")
      sidebarContainer.classList.add('indented')
      let updateSidebars = new Promise((resolve, reject) => {
        if (this.sidebars.push(newSidebarContent)) {
          resolve("Success")
        } else {
          reject("Failed")
        }
      })
      // Once it's been added, scroll into view so we always see the most recent sidebar.
      updateSidebars.then(()=> {
        this.scrollToCurrentSidebar()
      }).then(()=> {this.animateSidebars(sidebarContainer)})
    },
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
    showSidebar(data) {
      this.sidebarType = data.type
      this.sidebarWidth = data.width
      this.sidebarContainerVisible = this.sidebars.length>0
    },
    collapseSidebar(index) {
      console.log('Closing sidebar', index)
      console.log(this.sidebars)
      this.sidebars = this.sidebars.slice(0, index)
      this.sidebarContainerVisible = this.sidebars.length>0
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
      let newPath = '/data/' + this.routes[this.tab].path.replace(/\*/g, '') + '/'
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
