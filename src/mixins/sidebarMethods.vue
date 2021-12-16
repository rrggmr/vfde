
<script>
import {fakeData} from "@/config";

export default {
  name: "sidebarMethods",
  methods: {
    getX() {
      const doc = document.documentElement;
      const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      return left
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
      // this.checkForScroll()
      setTimeout(
          function(){
            sidebarContainer.classList.remove('indented')
          }, duration)
      setTimeout(
          function(){
            that.scrollToCurrentSidebar()
          }, duration + 5)
    },
    scrollToCurrentSidebar() {
      const allSidebars = document.getElementsByClassName('sidebar')
      const currentSidebar = allSidebars[allSidebars.length-1]
      if (typeof currentSidebar != "undefined") {
        currentSidebar.scrollIntoView()
      }
    }
  }
}
</script>

