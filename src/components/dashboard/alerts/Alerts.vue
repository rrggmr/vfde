<template>
  <div>
    <b-tabs v-model="tab">
      <b-tab :title="$t('Gruppierte Warnungen')" :active="currentTab === 'grouped'" >
        <b-card>
          <AlertTable grouped :fields="alertData.groupedFields" :items="alertData.groupedItems"  @showSidebar="showSidebar" />
        </b-card>
      </b-tab>
      <b-tab :title="$t('Alle Warnungen')"  :active="currentTab === 'all'" >
        <b-card>
          <AlertTable :fields="alertData.fields" :items="alertData.items" @showSidebar="showSidebar" />
        </b-card>
      </b-tab>
    </b-tabs>
    <div id="sidebarContainer" v-if="sidebars.length > 0" :key="`sidebarContainer${sidebars.length > 0}`">
      <sidebar
          v-for="(sidebar, index) in sidebars"
          :key="`sidebar_${index}`"
          :sidebar-content="sidebar.content"
          :sidebar-type="sidebar.type"
          :sidebar-id = "sidebar.id"
          :active-sidebar="index == sidebars.length - 1"
          @closeSidebar="closeSidebar"
          @expandNestedData="expandNestedData"
      />
    </div>
  </div>
</template>

<script>
import AlertTable from "@/components/dashboard/alerts/AlertTable";
import Sidebar from "@/components/dashboard/sidebar_types/Sidebar";
import {fakeData} from "@/config";

export default {
  name: "Alerts",
  components: {Sidebar, AlertTable},
  data() {
    return {
      tab: 0,
      alertData: fakeData,
      currentTab: this.startingTab,
      columnWidth: 25,
      sidebars:[],
      newLoad: true
    }
  },
  mounted() {
    this.checkForScroll()
  },
  props: {
    startingTab: String,
    alertId: String
  },
  methods: {
    getX() {
      const doc = document.documentElement;
      const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      return left
    },
    checkForScroll() {
      this.updatePageUrl()
      window.scrollTo(this.getX(),0)
      if (this.sidebars.length) {
        this.stopMainScroll()
      } else {
        this.restoreMainScroll()
      }
    },
    updatePageUrl() {
      const currentRoute = this.$router.currentRoute;
      const alertId = currentRoute.params.alertId
      let newRoute
      if (!alertId || (!this.newLoad && !this.sidebars.length)) {
        if (this.tab === 0) {
          newRoute = '/alerts/grouped'
        } else if (this.tab === 1) {
          newRoute = '/alerts/all'
        }
      }
      else {
        if (!this.sidebars.length) {
          const sidebar = {
            content: this.$store.state.sidebarContent,
            type: "alert",
            id: this.$store.state.sidebarContent.uuid
          }
          this.sidebars.push(sidebar)
        }
        if (this.sidebars[this.sidebars.length-1].count > 0) {
          this.currentTab = 'grouped'
        } else {
          this.currentTab = 'all'
        }
      }
      if (currentRoute.path !== newRoute) {
        this.$router.push(newRoute)
      }
    },
    fakeSidebarContent(column) {
      return fakeData.items[column]
    },
    stopMainScroll() {
      const body = document.getElementsByTagName('body')[0]
      body.classList.add('noScroll');
    },
    restoreMainScroll() {
      const body = document.getElementsByTagName('body')[0]
      body.classList.remove('noScroll');
    },
    showSidebar() {
      const currentRoute = this.$router.currentRoute.path
      const newRoute = '/alerts/' + this.$store.state.sidebarContent.uuid
      if (currentRoute !== newRoute) {
        this.$router.push( newRoute )
      }
      const sidebar = {
        content: this.$store.state.sidebarContent,
        type: "alert",
        id: this.$store.state.sidebarContent.uuid
      }
      this.sidebars.push(sidebar)
      this.checkForScroll()
    },
    closeSidebar(sidebarId) {
      this.newLoad = false;
      for (const index in this.sidebars) {
        if (this.sidebars[index].id === sidebarId) {
          // Remove the closed sidebar and any after it from the array.
          const sidebarContainer = document.getElementById("sidebarContainer")
          this.animateSidebars(sidebarContainer, true)
          this.sidebars.splice(index)
        }
      }
      this.checkForScroll()
    },
    animateSidebars(sidebarContainer, close = false, duration=150) {
      const that = this
      let keyFrames = ['translateX(+25%)', 'translateX(0)']
      if (close) {
        keyFrames = keyFrames.reverse()
      }
      sidebarContainer.animate([
        // keyframes
        { transform: keyFrames[0] },
        { transform: keyFrames[1] }
      ], {
        // timing options
        duration: duration,
        iterations: 1
      })
      this.checkForScroll()
      setTimeout(
          function(){
            sidebarContainer.classList.remove('indented')
          }, duration)
      setTimeout(
          function(){
            that.scrollToCurrentSidebar()
          }, duration + 5)
    },
    expandNestedData() {
      // This is expanding random data atm

      const faker = require('faker')
      faker.locale = "de";
      const rndInt = Math.floor(Math.random() * 15) + 1
      const randomId = faker.datatype.uuid()
      const newSidebarContent =  {
        content: this.fakeSidebarContent(rndInt),
        type: "alert",
        id: randomId
      }
      // Wait for the new sidebar to added to the sidebar collection.
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
    scrollToCurrentSidebar() {
      const allSidebars = document.getElementsByClassName('sidebar')
      const currentSidebar = allSidebars[allSidebars.length-1]
      if (typeof currentSidebar != "undefined") {
        currentSidebar.scrollIntoView()
      }
    }
  },
  watch: {
    'tab': function() {
      this.updatePageUrl()
    }
  }
}


</script>



