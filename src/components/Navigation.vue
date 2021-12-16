<template>
  <nav>
    <li
        v-for="route in routes"
        :key="route.name"
        @click="navigateTo(route)"
        :class="active(route.path)"
    >
      {{$t(route.name)}}
    </li>
  </nav>
</template>

<script>

import routes from "@/router/routes/dashboard";

export default {
  name: 'Navigation',
  methods: {
    navigateTo(route) {
      // If this area is already active, do nothing (to avoid messing up sub tabs).
      if (this.active(route.path)) {
        return
      }
      // If the route has children, go to the first child instead of the route.
      let path = route.path
      if(typeof route.children !== 'undefined') {
        path += "/" + route.children[0].path
      }
      // Handle wildcards necessary for e.g. AWS file explorer
      const truePath = path.replace(/\*/g, '') + '/'
      // Finally, navigate to the route.
      this.$router.push(truePath)
    },
    active(path) {
      const activePathBase = path.split("/")[1]
      const newPathBase = this.$route.path.split("/")[1]
      if (activePathBase === newPathBase) {
         return 'active'
       }
      return ''
    }
  },
  data() {
    return {
      'routes': routes[0].children
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
}
</script>

