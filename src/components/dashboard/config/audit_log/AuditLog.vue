<template>
  <div id="audit-log">
      <ul class="logs">
        <li :key="`log_${log.id}}`" v-for="log in logs" :class="$t(log.action)">
          <h3>{{localiseDate(log.dateTime, true)}} - {{$t(log.action)}}</h3>
          <p class="text">{{$t(log.text)}}</p>
        </li>
      </ul>
      <div id="loading" class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>

import {fakeLogs} from "@/config";
import CommonMethods from "@/mixins/commonMethods"

export default {
  name: "AuditLog",
  data() {
    return {
      logs: []
    }
  },
  mixins: [
    CommonMethods
  ],
  mounted() {
    this.$emit('setTab', this.activeTab);
    // Need to wait a milisecond before cheking positioning, otherwise it returns 0.
    const checkForLogs = this.checkForLogs
    setTimeout(function(){
      checkForLogs()
      window.addEventListener('scroll', () => {
        checkForLogs()
      })
    }, 1);

  },
  props: {
    activeTab: String,
  },
  methods: {
    getLogs() {
      //  Replace this with an API call when available. Fake data for now.
      this.logs.push(...fakeLogs(30))
    },
    loadingTextVisible() {
      const viewportHeight = window.innerHeight
      const loadingText = document.getElementById('loading')
      const offset = loadingText.getBoundingClientRect().top
      const inView = offset < viewportHeight;
      return inView
    },
    checkForLogs() {
      if (this.loadingTextVisible()) {
        this.getLogs()
      }
    }
  },
  watch: {

  }
}



</script>

<style lang="scss" scoped >
    .lds-ellipsis {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }
    .lds-ellipsis div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #e60000;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .lds-ellipsis div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    .lds-ellipsis div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }

  .logs {
    border-left:2px solid;
    margin:1em 1.5em;
    padding-left:2em;
    text-align: left;
    li {
      list-style: none;
      display: block;
      margin-bottom: 1em;
      &.comment {
        p {
          padding:.75em 1em;
          border: 1px solid;
          border-radius: .25em;
          margin-top:.5em;
        }

      }
      p {
        margin: 0; padding: 0;
      }
      h3 {
        font-size: 1em;
        display: inline-block;
        margin:0;
        padding: 0;
        font-weight: bold;
        text-transform: capitalize;
        &:before {
          content:"";
          display: inline-block;
          height: 1em;
          width: 1em;
          background-color: #fff;
          border:2px solid;
          border-radius: 2em;
          position: absolute;
          margin-left: -2.6em;
          margin-top: 0.1em;
        }
      }
    }
  }
</style>

