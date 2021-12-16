<template>
  <div class="productSidebar">
    <h3>Product details</h3>
    <b-form id="productForm" class="details">

      <div class="formRow" v-for="(value, key) in sidebarContent" :key="key">
        <h4>{{key}}</h4>
        <b-form-input :name="key" :value="value" :placeholder="key" />
      </div>
      <b-button class="save" type="submit" variant="primary">Save</b-button>
    </b-form>
  </div>
</template>

<script>
import commonMethods from "@/mixins/commonMethods";

export default {
  name: 'SidebarAlert',
  mixins: [
      commonMethods
  ],
  data() {
    return {

    }
  },
  methods: {
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
  },
  mounted() {
    const formRows = document.getElementsByClassName('formRow')
    for (let i=0; i<formRows.length; i++) {
      const currentRow = formRows[i]
      const input = currentRow.getElementsByTagName('input')[0]
      const inputWidth = input.offsetWidth
      const textWidth = input.value.length * (8)
      if (textWidth > inputWidth) {
        const textBox = document.createElement('textarea')
        for (const attr of input.attributes) {
          textBox.setAttribute(attr.name, attr.value)
        }
        textBox.innerHTML = input.value
        input.replaceWith(textBox)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .productSidebar {
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
  .details {
    margin-bottom: 2em;
    div {
      text-align: left;
      display: grid;
      grid-gap: 1em;
      grid-template-columns: auto 1fr;
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
    text-transform: capitalize;
  }
  input[type="text"] {
    border:1px solid #ccc;
    padding: .125em .5em;
    border-radius: .25em;
    //border-color: transparent;
    font-size: .9em;
  }

  textarea {
    //border: transparent;
  }

  .save {
    margin-top:2em;
  }



</style>
