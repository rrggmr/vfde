<template>
  <div>
    <ul :class="`${actionsClass()}actions`">
      <li @click="placeholder" v-if="single">
        <router-link :to="`/config/data-sources/editor/${id}`">
          <font-awesome-icon icon="edit" />
        </router-link>
      </li>
      <li  v-if="!single">
        <router-link :to="'/config/data-sources/editor'">
          {{ $t('New datasource') }}
          <font-awesome-icon icon="file-medical" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>

import CommonMethods from "@/mixins/commonMethods";

export default {
  name: "DashboardActions",
  mixins: [
    CommonMethods
  ],
  methods: {
    placeholder: () => {
      console.log('Placeholder only')
    },
    actionsClass() {
      if (this.single) {
        return ''
      } else {
        return 'bulk '
      }
    }
  },
  props: {
    single: Boolean,
    id: String
  }
}
</script>

<style scoped lang="scss">
  svg {
    font-size: 1.25em;
    margin-left:.25em;
    color: #6c6c6c;
    &:hover {
      color: #000;
    }
  }
  .actions {
    a {
      text-decoration: none;
      color: inherit;
      font-weight: bold;
      &:hover {
        color: inherit;
      }
    }
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
