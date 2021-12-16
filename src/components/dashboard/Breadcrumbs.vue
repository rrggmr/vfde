<template>
  <ol class="breadcrumb">
    <li
        :key="`breadcrumb_${breadcrumb.text}`"
        v-for="breadcrumb in breadcrumbs"
    >
      <router-link v-if="!breadcrumb.active" :to="breadcrumb.to">
        {{$t(breadcrumb.text)}}
      </router-link>
      <span v-else>
        {{$t(breadcrumb.text)}}
      </span>
    </li>
  </ol>
</template>

<script>

// Can't use standard breadcrumb item because of translation

export default {
  name: 'Breadcrumbs',
  methods: {

  },
  mounted() {

    const matched = this.$router.currentRoute.matched
    const matchedSlice = matched.slice(1, matched.length)
    let currentRoutes = []

    for (let i = 0; i < matchedSlice.length; i++) {
      if (!currentRoutes.includes(matchedSlice[i].name)) {
        currentRoutes.push(matchedSlice[i].name)
        this.breadcrumbs.push(
            {
              text: matchedSlice[i].name,
              to: { name: matchedSlice[i].name }
            }
        )
      }
    }
    this.breadcrumbs[this.breadcrumbs.length-1]['active'] = true

  },
  data() {
    return {
      breadcrumbs: []
    }
  }
}
</script>

<style lang="scss">
.breadcrumb {
  padding: .75em 2em;
  li {
    &:last-of-type {
      &:after {
        content: ''
      }
    }
    &:after {
      content: " / ";
      margin: 0 .5em;

    }
  }
}
</style>
