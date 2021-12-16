<template>
  <div :style="`width:${sidebarWidth}%`" class="sidebar" shadow right no-slide no-header >
    <b-button @click="closeSidebar" class="closeSidebar" />
    <AlertSidebar @expandNestedData="expandNestedData" v-if="sidebarType === 'alertSidebar'" :active-sidebar="activeSidebar" :sidebar-content="sidebarContent"/>
    <ProductEditor @expandNestedData="expandNestedData" v-if="sidebarType === 'productEditor'" :active-sidebar="activeSidebar" :sidebar-content="sidebarContent"/>
    <DataSourceEditor v-if="sidebarType === 'datasourceEditor'" />
  </div>
</template>
<script>

import AlertSidebar from "@/components/dashboard/data/alerts/AlertSidebar";
import DataSourceEditor from "@/components/dashboard/config/data_sources/DataSourceEditor";
import ProductEditor from "@/components/dashboard/data/products/ProductEditor";
import {fakeAlert} from "@/config";

export default {
  name: 'Sidebar',
  components: {
    DataSourceEditor,
    AlertSidebar,
    ProductEditor
  },
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
      this.$emit('closeSidebar', this.$props )
    },
    expandNestedData() {
      // Currently just duplicating the existing data for demonstration purposes.
      const alert = fakeAlert()
      const newSidebar = {
        content: alert,
        id: alert.uuid,
        type: this.sidebarType,
        width: this.sidebarWidth
      }

      this.$emit('expandNestedData', newSidebar )
    }
  },
  props: {
    sidebarType: String,
    sidebarContent: {},
    activeSidebar: Boolean,
    sidebarId: String,
    sidebarWidth: Number
  }
}
</script>
