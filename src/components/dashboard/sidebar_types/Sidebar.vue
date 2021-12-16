<template>
  <div :class="`sidebar`" shadow right no-slide no-header >
    <b-button @click="closeSidebar" class="closeSidebar" />
    <SidebarAlert @expandNestedData="expandNestedData" v-if="sidebarType === 'alert'" :active-sidebar="activeSidebar" :sidebar-content="sidebarContent"/>
  </div>
</template>
<script>

import SidebarAlert from "@/components/dashboard/sidebar_types/SidebarAlert";

export default {
  name: 'Sidebar',
  components: {SidebarAlert},
  computed: {
    disabled() {
      if (this.activeSidebar) {
        return "active"
      }
      return "disabled"
    }
  },
  methods: {
    closeSidebar() {
      this.$emit('closeSidebar', this.sidebarId )
    },
    expandNestedData() {
      this.$emit('expandNestedData', {"hello": "world"} )
    }
  },
  props: {
    sidebarType: String,
    sidebarContent: {},
    activeSidebar: Boolean,
    sidebarId: String
  }
}
</script>
