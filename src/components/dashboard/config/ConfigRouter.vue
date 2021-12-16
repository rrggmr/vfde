<template>
  <div>
    <b-tabs v-model="tab">
      <b-tab
          v-for="route in routes"
          :key="route.name"
          :title="$t(route.name)"
          :active="activeTab === route.path"
      >
      </b-tab>
      <b-card>
        <router-view  @setTab="setTab" />
      </b-card>
    </b-tabs>
  </div>
</template>

<script>
import routes from "@/router/routes/config";

export default {
  name: "ConfigRouter",
  data() {
    return {
      'activeTab': "not set",
      'routes': routes[0].children,
      'tab':0
    }

  },
  mounted() {
    this.setInitialConfigTab()
  },
  methods: {
    setInitialConfigTab() {
      console.log('Config Router Mounted or Reset')
      if (this.$router.currentRoute.path === "/config") {
        this.updatePageUrl()
      }
    },
    setTab(value) {
      console.log('Trying to set tab to ' + value)
      this.activeTab = value
    },
    updatePageUrl() {
      console.log('Changing routes')
      const newPath = "/config/" + this.routes[this.tab].path
      this.$router.push(newPath)
    }
  },
  watch: {
    'tab': function() {
      this.updatePageUrl()
    },
    '$route.path': function() {
      this.setInitialConfigTab()
    }
  }
}
</script>

<style scoped>

</style>
