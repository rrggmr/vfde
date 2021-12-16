<template>
  <div id="table-wrapper" >
    <AlertActions
        multiple
        :grouped="grouped"
        @updateGrouped="updateGrouped"
    />
    <table class="table" id="alertsTable" >
      <thead>
        <tr>
          <th class="centered"><b-check /></th>
          <th v-if="grouped">{{$t('Anzahl')}}</th>
          <th>{{$t('Alarmtyp')}}</th>
          <th>{{$t('Alarminformationen')}}</th>
          <th class="actions">{{$t('Aktionen')}}</th>
        </tr>
      </thead>
      <tbody>
        <Alert
            v-for="id in alertIds"
            :key="`alert_${id}`"
            :alert="alerts[id]"
            :grouped="grouped"
            @showSidebar="showSidebar"
        />
      </tbody>
    </table>
  </div>
</template>

<script>
import {fakeData} from "@/config";
import commonMethods from "@/mixins/commonMethods";
import sidebarMethods from "@/mixins/sidebarMethods";
import Alert from "@/components/dashboard/data/alerts/Alert";
import AlertActions from "@/components/dashboard/data/alerts/AlertActions";
export default {
  name: "DataSourceList",
  components: {AlertActions, Alert},
  mixins: [
    commonMethods,
    sidebarMethods
  ],
  data() {
    return {
      alerts: null,
      alertIds: [],
      fields: [],
      abbreviateAfterColumn: 0,
      resizeTimer: null,
      sidebars: [],
      grouped: null
    }
  },
  methods: {
    showSidebar(id, alert, push = true) {
      this.sidebars = []
      const sidebar = {
        id: id,
        content: alert,
        type: 'alertSidebar',
        width: 25
      }
      this.sidebars.push(sidebar)
      this.$emit('passSidebars', this.sidebars)
      let alertGrouped
      if (this.grouped) {
         alertGrouped = 'grouped'
      } else {
         alertGrouped = 'all'
      }
      if (push) {
        this.$router.push(`/data/alerts/${alertGrouped}/view/${id}`)
      }
    },
    checkForEditor() {
      const pathElements = this.$route.path.split('/')
      if(pathElements.includes('view')) {
        let id = this.lastElementOfPath()
        if (id==='view') {
          this.sidebars = []
          const redirect = pathElements.slice(0, pathElements.length-2).join('/') + '/'
          this.$router.replace(redirect)
        } else {
          if (this.sidebars.length === 0) {
            this.showSidebar(id, this.getNthObjectElement(this.alerts, 0), false)
          }
          const data = {
            'type': 'alertSidebar',
            'id': id,
            'width': 25
          }
          this.stopMainScroll()
          this.$emit('showSidebar', data)
        }
      } else {
        this.restoreMainScroll()
      }
    },
    updateGrouped(grouped) {
      const lastElement = this.lastElementOfPath()
      if (['all', 'grouped', 'alerts'].includes(lastElement)) {
        this.grouped = grouped
        if (this.grouped) {
          this.$router.push('/data/alerts/grouped/')
        } else {
          this.$router.push('/data/alerts/all/')
        }
      } else if (this.$route.path.split('/').includes('grouped')) {
        this.grouped = true
      }
    },
    resolveUrl() {
      if (this.lastElementOfPath() === 'alerts') {
        this.$router.push('grouped')
      }
      this.grouped = this.lastElementOfPath() === 'grouped'
    },
    pageSetup() {
      this.resolveUrl()
      const component = this
      let setUpData = new Promise(function(resolve, reject) {
        component.alerts = fakeData.alerts
        component.alertIds = Object.keys(component.alerts)
        component.fields = Object.keys(component.alerts[Object.keys(component.alerts)[0]])
        if (typeof component.alerts === 'object') {
          resolve();
        } else {
          reject(`There was an error in getting the data. alerts was set as ${typeof component.alerts}`);
        }
      })
      setUpData.then(
        function() {
          component.checkForEditor()
        },
        function(error) {
          console.log(error)
        }
      )
    }
  },
  mounted() {
    this.pageSetup()
  },
  watch: {
    $route() {
      this.resolveUrl()
      this.checkForEditor()
    }
  },
}

</script>

<style scoped lang="scss">
#table-wrapper {
  overflow: hidden;
  table {
    text-align: left;
    th {
      text-transform: capitalize;
      white-space: nowrap;
      &.actions {
        text-align: center;
      }
    }
    td {
      white-space: nowrap;
      &.actions {
        text-align: center;
        .expand {
          cursor: pointer;
          color: rgb(108,108,108);
          &:hover {
            color: #000;
          }
        }
      }
    }
    .hidden-column {
      display: none;
    }
  }
}

</style>
