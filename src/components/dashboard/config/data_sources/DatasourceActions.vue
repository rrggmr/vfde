<template>
  <div>
    <ul :class="`${actionsClass()}actions`">
      <li @click="placeholder" v-if="single">
        <router-link :to="`/config/data-sources/editor/${id}`">
          <img class="icon" :src="getIcon('edit')" :alt="$t('Edit')"/>
        </router-link>
      </li>
      <li  v-if="!single">
        <router-link :to="'/config/data-sources/editor'">
          {{ $t('New datasource') }}
          <img class="icon" :src="getIcon('new')" :alt="$t('New datasource')" />
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
      console.log('Clicked')
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
