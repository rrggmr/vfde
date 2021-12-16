<template>
  <div class="grid splash-screen">
      <div class="form_holder">
        <h2>{{$t('Melden Sie sich für den Zugriff an')}}</h2>
        <b-form @submit.prevent="submitForm">
          <b-form-group
              id="email-wrapper"
              :label="$t('Nutzername')"
              label-for="email-field"
          >
            <b-form-input
                id="email-field"
                v-model="form.email"
                type="text"
                required
                class="email_icon"
            ></b-form-input>
            <p class="error" v-if="errors.username">{{errors.username}}</p>
          </b-form-group>
          <b-form-group
              id="password-wrapper"
              :label="$t('Passwort')"
              label-for="password-field"
          >
            <b-form-input
                id="password-field"
                v-model="form.password"
                type="password"
                required
                class="password_icon"
            ></b-form-input>
            <p class="error" v-if="errors.password">{{errors.password}}</p>
          </b-form-group>
          <b-button type="submit" variant="danger">{{ $t('Einloggen') }}</b-button>
        </b-form>
        <LocaleSelect />
<!--        <b-button variant="outline-light" class="additional_buttons">Register</b-button>-->
<!--        <b-button variant="outline-light" class="additional_buttons">Forgotten password?</b-button>-->
      </div>
    <div class="logo"></div>
  </div>
</template>

<script>
import { router } from "@/router/router";
import store from "@/store/store";
import LocaleSelect from "@/components/localisation/LocaleSelect";
export default {
  name: "LoginForm",
  components: {LocaleSelect},
  data() {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: false
      },
      errors: {
        username: null,
        password: null
      }
    }
  },
  methods: {
    submitForm: async function() {
      // Temporary fake login to have a small amount of gating until login api is available
     if (this.form.email === 'demo' && this.form.password === 'gatekeeper' ) {
       store.commit('authenticate');
       await router.push('/'); // TODO: Redirect to where ever they were trying to get to.
     } else {
       this.errors = {
         'username': 'Incorrect username',
         'password': 'Incorrect password'
       }
     }
    }
  }
}
</script>

<style scoped>
  .error {
    font-weight: bold;
  }
</style>