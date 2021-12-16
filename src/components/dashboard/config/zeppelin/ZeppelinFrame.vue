<template>
  <b-tabs>
    <b-tab :title="$t('Reporting')" >
      <b-card>
        <b-embed
            id="zeppelin-iframe"
            type="iframe"
            aspect="16by9"
            src="http://127.0.0.1:8080/#/"
            allowfullscreen
         />
      </b-card>
    </b-tab>
  </b-tabs>
</template>

<script>
export default {
  name: "ZeppelinFrame"
}
</script>

<style scoped>

</style>
