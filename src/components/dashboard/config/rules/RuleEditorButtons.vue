<template>
  <div :class="`formButtons ${visibilityClass}`">
    <b-button variant="primary" @click="run">{{ $t("Lauftest") }}</b-button>
    <b-button variant="primary" @click="save">{{ $t("speichern") }}</b-button>
  </div>
</template>
<script>


export default {
  name: 'DatasourceEditorButtons',
  props: {
    mobile: Boolean
  },
  computed: {
    visibilityClass() {
      if (this.mobile) {
        return "show-on-mobile"
      }
      return "hide-on-mobile"
    }
  },
  methods: {
    run() {
      this.$emit('run')
    },
    save() {
      this.$emit('save')
    }
  }

}
</script>
