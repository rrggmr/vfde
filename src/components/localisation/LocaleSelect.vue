<template>
  <div class="locale-select">
    <select class="localSelect" v-model="locale" @change="storeLocale(locale)" >
      <option
          v-for="lang in locales"
          :key="lang.locale"
          :value="lang.locale"
      >
        <span class="flag" v-html="lang.flag" />
        {{ lang.language }}
      </option>
    </select>
  </div>
</template>

<script>
import store from "@/store/store";
import i18n from "@/i18n";
export default {
  name: 'LocaleSelect',
  props: {
    initialLocale: String
  },
  data () {
    return {
      locale: store.state.locale,
      locales: [
        { 'locale': 'de',
          'language': 'Deutsche',
          'flag': '&#127465&#127466'
        },
        {
          'locale': 'en-gb',
          'language': 'English',
          'flag': '&#127468&#127463'
        }
      ]
    }
  },
  methods: {
    storeLocale: function(locale) {
      store.commit('changeLocale', locale);
      i18n.locale = store.state.locale;
    }
  }
}
</script>

