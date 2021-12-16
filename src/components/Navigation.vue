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
      console.log(route)
      this.$router.push({name: route.name})
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

