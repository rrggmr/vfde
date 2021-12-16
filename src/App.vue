<template>
  <div id="app">
    <header>
      <img class="logo" src="./assets/speechmark-icon.svg"  alt="Vodafone Logo"/>
      <h1>{{ $t('Tool zur Beilegung von Abrechnungsstreitigkeiten') }}</h1>
      <Navigation v-if="$store.state.auth === true"/>
      <LocaleSelect v-if="$store.state.auth === true" />
    </header>
    <div class="content">
      <router-view />
    </div>
    <footer><p>&copy; {{ new Date().getFullYear() }} Telecom Group PLC</p> </footer>
  </div>
</template>

<script>

import LocaleSelect from "@/components/localisation/LocaleSelect";
import store from "@/store/store";
import i18n from "@/i18n";
import Navigation from "@/components/Navigation";

export default {
  name: 'App',
  components: {
    Navigation,
    LocaleSelect
  },
  mounted() {
    i18n.locale = store.state.locale;
  },
  data() {
    return {
      breadcrumbKey: Date.now()
    }
  },
  watch: {
    '$route' () {
      this.breadcrumbKey = Date.now()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
