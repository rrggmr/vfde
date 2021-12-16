<template>
  <div class="sidebarAlert">
    <div class="details">
      <h3>{{$t("Einzelheiten")}}</h3>
      <div v-if="sidebarContent.date">
        <h4>{{ $t("Datum") }}</h4>
        <span class="date" v-for="date in sidebarContent.date" :key="`date_${date}_${Math.random()}`">
            {{localiseDate(date)}}
          </span>
      </div>
      <div>
        <h4>{{ $t("Alarmtyp") }}</h4>
        <p>{{ $t(sidebarContent.type) }}</p>
      </div>
      <div v-if="sidebarContent.count">
        <h4>{{$t("Anzahl identischer Warnungen")}}</h4>
        <p>{{ localiseNumbers(sidebarContent.count) }}</p>
      </div>
      <div v-if="sidebarContent.expected">
        <h4>{{$t("Erwartet")}}</h4>
        <p :class="`correct`">{{ localiseNumbers(sidebarContent.expected) }}</p>
      </div>
      <div v-if="sidebarContent.actual">
        <h4>{{$t("Tatsächlich")}}</h4>
        <p :class="`error`">{{ localiseNumbers(sidebarContent.actual) }}</p>
      </div>
      <div>
        <h4>User</h4>
        <p :class="`expandable`" @click="expandNestedData">{ name: Oli Jeffery, age: 41, job: developer }</p>
      </div>
      <div v-if="sidebarContent.text">
        <h4>{{$t("Andere Details")}}</h4>
        <p>{{ $t(sidebarContent.text) }}</p>
      </div>
    </div>
    <div class="buttonActions">
      <h3>{{$t("Aktionen")}}</h3>
      <AlertActions :disabled="!activeSidebar" grouped buttons/>
    </div>
    <div>
      <h3>{{$t("Aktionsprotokoll")}}</h3>
      <ul class="logs">
        <li :key="`log_${log.id}}`" v-for="log in logs">
          <span class="logAction"><span class="actionType">{{$t(log.action)}}:</span> {{$t(log.text)}}</span>
          <span class="date">{{localiseDate(log.dateTime)}}</span>
        </li>
      </ul>
      <b-form class="comments" @submit.prevent="newComment">
        <b-input v-model="form.comment" type="text" name="comment"
                 placeholder="Add a new comment to this alert."/>
      </b-form>
    </div>
  </div>
</template>
<script>
import commonMethods from "@/mixins/commonMethods";
import {fakeData} from "@/config";
import AlertActions from "@/components/dashboard/data/alerts/AlertActions"

export default {
  name: 'SidebarAlert',
  components: {AlertActions},
  mixins: [
      commonMethods
  ],
  data() {
    return {
      logs: fakeData.logs,
      form: {
        comment: ""
      }
    }
  },
  methods: {
    newComment() {
      // Once API is available, generate ID and save.
      const commentDate = new Date
      const dateString = commentDate.toDateString()
      const newLog = {
        id: Math.floor(Math.random()*1000000000000000).toString(),
        action: 'Comment',
        text: this.form.comment,
        dateTime: dateString
      }
      this.logs.unshift(newLog)
      this.form.comment = ""
    },
    expandNestedData() {
      this.$emit('expandNestedData' )
    }
  },
  props: {
    activeSidebar: {},
    sidebarContent: {},

  },
  computed: {
    inactive() {
      if (this.activeSidebar) {
        return ""
      }
      return "disabled"
    }
  }
}
</script>
<style lang="scss" scoped>




  .sidebarAlert {
    padding: 2em;
  }
  header {
    text-align: left;
    padding: 2em 0;
    h2 {
      font-size: 1.25em;
      font-weight: normal;

    }
  }
  .logs {
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: left;

    li {
      margin-top: 1em;
      border: 1px solid rgba(200, 200, 200);
      padding: .5em .75em;
      border-radius: .35em;

      span {
        &.actionType {
          text-transform: capitalize;
          font-weight: bold;
        }
        &.date {
          display: block;
          font-weight: bold;
        }
      }
    }
  }

  .date {
    &:after {
      content: "-";
      display: inline-block;
      margin: 0 0 0 1em;
    }

    &:last-of-type {
      &:after {
        content: none;
      }
    }
  }

  .comments {
    margin-top: 1em;
    height: 5em;
  }
  .details {
    margin-bottom: 2em;
    div {
      text-align: left;
      display: grid;
      grid-gap: 1em;
      grid-template-columns: auto auto 1fr;
      border-bottom: 2px solid rgba(235, 235, 235, 1);
      padding: .5em 0;
      p {
        margin:0;
      }
    }
  }
  h3, .h3 {
    font-size: 1.15em !important;
    font-weight: bold;
    text-align: left;
    border-bottom: 2px solid rgba(235, 235, 235, 1);
    padding-bottom: .5em;
  }
  h4 {
    font-size: 1em;
    font-weight: bold;
    line-height: 1.5;
    margin: 0;
  }




</style>
