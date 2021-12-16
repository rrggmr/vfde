<template>
  <b-tabs>
    <b-tab :title="$t('Reporting')" >
      <b-card>
        <b-embed
            id="zeppelin-iframe"
            type="iframe"
            aspect="16by9"
            :src="zeppelinURL"
            allowfullscreen
         />
      </b-card>
    </b-tab>
  </b-tabs>
</template>

<script>
import {getEnv} from "@/config";

export default {
  name: "ZeppelinFrame",
  data() {
    return {
      zeppelinURL: getEnv("VUE_APP_ZEPPELIN_URL")
    }
  }
}
</script>

<style scoped>

</style>
