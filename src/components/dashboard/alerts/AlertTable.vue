<template>
  <div>
    <Actions multiple />
    <table class="table" >
      <thead>
        <th class="hide-on-mobile"><b-check v-model="selectAll" /></th>
        <th v-for="field in fields" :key="`field_${field.key}`" >{{$t(field.key)}}</th>
        <th><span class="hide-on-mobile">{{$t('Aktionen')}}</span></th>
      </thead>
      <tbody >
      <Alert
          @selectRow="selectRow"
          @unselectRow="unselectRow"
          @showSummary="showSummary"
          v-for="(alert, index) in items"
          :alert="alert"
          :key="`row_${index}`"
          :uuid="alert.uuid"
          :toggled="selectAll"
          :grouped="grouped"
      />
      </tbody>
    </table>
  </div>
</template>

<script>
import Alert from "@/components/dashboard/alerts/Alert";
import Actions from "@/components/dashboard/alerts/AlertActions";

export default {
  name: "AlertTable",
  components: {Actions, Alert},
  data() {
    return {
      selectedRows: [],
      selectAll: false
    }
  },
  methods: {
    selectRow(value) {
      this.selectedRows.push(value);
    },
    unselectRow(value) {
      this.selectedRows = this.selectedRows.filter(e => e !== value);
    },
    showSummary() {
      this.$emit('showSidebar')
    }
  },
  props: {
    'fields': {},
    'items': {},
    'grouped': Boolean
  },

}
</script>

