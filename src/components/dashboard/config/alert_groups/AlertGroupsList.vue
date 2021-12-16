<template>
  <div>
    <DashboardActions />
    <table class="table" >
      <thead>
        <th>{{ $t("Name") }}</th>
        <th >Type</th>
        <th class="hide-on-mobile">Streaming</th>
        <th class="hide-on-mobile">{{ $t("erstellt") }}</th>
        <th class="hide-on-mobile">{{ $t("geändert") }}</th>
        <th>{{ $t("Aktionen") }}</th>
      </thead>
      <tbody>
        <tr v-for="datasource in datasources" :key="datasource.id">
          <td>{{datasource.name}}</td>
          <td>{{$t(datasource.editorConfig.type)}}</td>
          <td class="hide-on-mobile">{{$t(datasource.editorConfig.streaming)}}</td>
          <td class="hide-on-mobile">{{localiseDate(datasource.created)}}</td>
          <td class="hide-on-mobile">{{localiseDate(datasource.modified)}}</td>
          <td class="actions"><DashboardActions single :id="datasource.editorConfig.id.value" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {fakeData} from "@/config";
import DashboardActions from "@/components/dashboard/config/data_sources/DatasourceActions";
import commonMethods from "@/mixins/commonMethods";
import sidebarMethods from "@/mixins/sidebarMethods";
export default {
  name: "DataSourceList",
  components: {DashboardActions},
  mixins: [
    commonMethods,
    sidebarMethods
  ],
  data() {
    return {
      datasources: null
    }
  },
  methods: {
    checkForEditor() {
      const pathElements = this.$route.path.split('/')
      if(pathElements.includes('editor')) {
        let id = pathElements[pathElements.length-1]
        if (id === 'editor') {id = null}
        const data = {
          'type': 'datasourceEditor',
          'id': id,
          'width': 50
        }
        this.sidebars = [data]
        this.stopMainScroll()
        this.$emit('passSidebars', this.sidebars)
        this.$emit('showSidebar', data)
      } else {
        this.restoreMainScroll()
      }
    }
  },
  mounted() {
    this.datasources = fakeData.dataSources
    this.checkForEditor()
  },
  watch: {
    $route() {
      this.checkForEditor()
    }
  }
}
</script>

<style scoped>
table {
  text-align: left;
}
</style>
