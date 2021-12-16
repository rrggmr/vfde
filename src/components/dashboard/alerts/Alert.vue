<template>
  <tr class="alert" :class="selected">
    <td class="hide-on-mobile"><b-check v-model="checked" @change="passCheckUp"  /></td>
    <td v-if="alert.count">{{ localiseNumbers(alert.count) }}</td>
    <td class="left_aligned">{{$t(alert.type)}}</td>
    <td class="information">
      <div class="blob" v-if="alert.date">
        <div class="blob_cell">
          <img class="icon" :src="getIcon('calendar')" />
        </div>
        <div class="blob_cell">
          <span class="date" v-for="date in alert.date" :key="`date_${date}_${Math.random()}`">
            {{localiseDate(date)}}
          </span>
        </div>
      </div>
      <div :class="splitClass()">
        <div v-if="alert.icon" class="blob_cell border_right">
          <img class="icon" :src="getIcon(alert.icon)" />
        </div>
        <div v-if="alert.expected" class="blob_cell alert-success">
          {{ localiseNumbers(alert.expected) }}
        </div>
        <div v-if="alert.actual" class="blob_cell alert-danger">
          {{ localiseNumbers(alert.actual) }}
        </div>
        <div v-if="alert.text" class="blob_cell">
          {{alert.text}}
        </div>
      </div>
    </td>
    <td class="actions"><Actions :grouped="grouped" @showSummary="showSummary" /></td>
  </tr>
</template>

<script>
import Actions from "@/components/dashboard/alerts/AlertActions"
import CommonMethods from "@/mixins/commonMethods"
import store from "@/store/store";

export default {
  name: 'Alert',
  components: {Actions},
  data() {
    return {
      checked: false
    }
  },
  methods: {
    passCheckUp() {
      if (!this.checked) {
        this.$emit('unselectRow', this.uuid)
      } else {
        this.$emit('selectRow', this.uuid)
      }
    },
    showSummary() {
      store.commit('updateSidebarContent', this.alert)
      const newRoute = 'alerts/'+this.alert.uuid
      this.$router.push(newRoute)
      this.$emit("showSummary")
    },
    splitClass() {
      if (this.alert.expected && this.alert.actual) {
        return "split blob"
      }
      return "blob"
    }
  },
  computed: {
    selected() {
      if (!this.checked) {
        return '';
      }
      return 'selected'
    }
  },
  watch: {
    'toggled': function() {
        this.checked = this.toggled;
        this.passCheckUp()
    }
  },
  mixins: [
      CommonMethods
  ],
  props: {
    alert: {},
    uuid: String,
    toggled: Boolean,
    grouped: Boolean
  }
}
</script>

<style scoped lang="scss">
  .selected {
    background-color: rgba(67, 133, 1, .05);
  }
</style>
