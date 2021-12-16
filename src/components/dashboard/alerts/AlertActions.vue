<template>
  <div>
    <ul :class="`${actionsClass()}actions`">
      <span v-if="multiple" :class="`hide-on-mobile ${disabled_buttons}`" >{{$t("Massenaktionen")}}</span>
      <li :class="`singleLine${buttons} ${disabled_buttons}`" @click="showSummary" v-if="!multiple && !buttons">
        <img v-if="!buttons" class="icon" :src="getIcon('summary')" :alt="$t('Zusammenfassung')"/>
        <b-button v-else variant="outline-secondary">{{$t('Zusammenfassung')}}</b-button>
      </li>
      <li :class="`singleLine${buttons} ${disabled_buttons}`" @click="placeholder(disabled)" v-if="!multiple && !grouped">
        <img v-if="!buttons" class="icon hide-on-mobile" :src="getIcon('invoice')" :alt="$t('Rechnung')" />
        <b-button v-else variant="outline-secondary">{{$t('Rechnung')}}</b-button>
      </li>
      <li :class="`singleLine${buttons} ${disabled_buttons}`" @click="placeholder(disabled)">
        <img v-if="!buttons" class="icon hide-on-mobile" :src="getIcon('ignore')" :alt="$t('ignorieren')" />
        <b-button v-else variant="outline-secondary">{{$t('ignorieren')}}</b-button>
      </li>
      <li :class="`singleLine${buttons} ${disabled_buttons}`" @click="placeholder(disabled)">
        <img v-if="!buttons" class="icon hide-on-mobile" :src="getIcon('resolve')" :alt="$t('der Entschluss')" />
        <b-button v-else variant="outline-danger">{{$t('der Entschluss')}}</b-button>
      </li>
    </ul>
  </div>
</template>

<script>
import CommonMethods from "@/mixins/commonMethods";

export default {
  name: "AlertActions",
  mixins: [
    CommonMethods
  ],
  methods: {
    placeholder: (disabled) => {
      if (!disabled) {
        console.log('Clicked')
      }
    },
    showSummary() {
      this.$emit('showSummary')
    },
    actionsClass() {
      if (this.multiple) {
        return 'bulk '
      } else {
        return ''
      }
    }
  },
  computed: {
    disabled_buttons() {
      if (this.disabled) {
        return "disabled"
      }
      return "active"
    }
  },
  props: {
    multiple: Boolean,
    grouped: Boolean,
    buttons: Boolean,
    disabled: Boolean
  }
}
</script>

<style scoped lang="scss">
  .actions {
    &.bulk {
      position: absolute;
      right:1em;
      margin-top: -3.5em;
      span {
        font-weight: bold;
        margin-right:1em;
      }
    }
    margin:0;
    padding: 0;
    text-align: center;
    li {
      display: inline-block;
      margin:0 .5em 0 0;
      cursor: pointer;
      &.disabled {
        cursor: default;
      }
      &.singleLinetrue {
        display: block;
        margin: 1em 0;
        button {
          width: 100%;
        }
      }
    }
    button {
      border-radius: 0;
    }
  }
</style>
