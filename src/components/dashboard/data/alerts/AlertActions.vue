<template>
  <div>
    <ul :class="`${actionsClass()}actions`">
      <span v-if="multiple" class="actionLabel">Group Alerts: </span>
      <li v-if="multiple" class="actionSwitch" ><b-checkbox switch v-model="groupedSwitch" /></li>
      <li :class="`singleLine${buttons} ${disabled_buttons}`" @click="showSidebar" v-if="!multiple && !buttons">
        <font-awesome-icon v-if="!buttons" class="icon hide-on-mobile" icon="file-alt" :alt="$t('Rechnung')"/>
        <b-button v-else variant="outline-secondary">{{$t('Zusammenfassung')}}</b-button>
      </li>
      <li :class="`singleLine${buttons} ${disabled_buttons}`" @click="placeholder(disabled)" v-if="!multiple && !grouped">
        <font-awesome-icon v-if="!buttons" class="icon hide-on-mobile" icon="euro-sign" :alt="$t('Rechnung')"/>
        <b-button v-else variant="outline-secondary">{{$t('Rechnung')}}</b-button>
      </li>
      <li :class="`singleLine${buttons} ${disabled_buttons}`" @click="placeholder(disabled)">
        <font-awesome-icon v-if="!buttons" class="icon hide-on-mobile" icon="eye-slash" :alt="$t('ignorieren')"/>
        <b-button v-else variant="outline-secondary">{{$t('ignorieren')}}</b-button>
      </li>
      <li :class="`singleLine${buttons} ${disabled_buttons}`" @click="placeholder(disabled)">
        <font-awesome-icon v-if="!buttons" class="icon hide-on-mobile" icon="check" :alt="$t('der Entschluss')"/>
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
  data() {
    return {
      groupedSwitch: false
    }
  },
  methods: {
    placeholder: (disabled) => {
      if (!disabled) {
        console.log('Placeholder only')
      }
    },
    showSidebar() {
      this.$emit('showSidebar')
    },
    actionsClass() {
      if (this.multiple) {
        return 'bulk '
      } else if (this.buttons) {
        return 'buttons '
      }
        else {
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
  },
  watch: {
    grouped() {
      // Make sure the switch is set to the parent grouped
      this.groupedSwitch = this.grouped
    },
    groupedSwitch() {
      // If the switch is changed, change the parent grouped
      this.$emit('updateGrouped', this.groupedSwitch)
    }
  }
}
</script>

<style scoped lang="scss">

  .actions {

    margin:0;
    padding: 0;
    justify-content: center;
    display: grid;
    grid-template-columns: auto;
    grid-auto-flow: column;

    &.bulk {
      position: absolute;
      right:1em;
      margin-top: -3.5em;
      grid-template-columns: auto auto auto auto;
      span {
        font-weight: bold;
        margin-right:1em;
      }
    }

    &.buttons {
      display: block;
    }

    li {
      display: inline-block;
      margin:0 .5em 0 0;
      cursor: pointer;
      color: #6c6c6c;
      &:hover {
        color: #000;
      }
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
