<template>
  <div id="table-wrapper">
    <table class="table" id="productsTable" >
      <thead>
        <th :key="`field_${index}`" v-for="(field, index) in fields">{{ $t(field) }}</th>
        <th class="actions">&hellip;</th>
      </thead>
      <tbody>
        <tr v-for="id in productIds" :key="`product_${id}`">
          <td :key="`value_${subIndex}`" v-for="(value, subIndex) in products[id]" >
            {{products[id][subIndex]}}
          </td>
          <td class="actions">
            <font-awesome-icon
                class="icon expand"
                icon="edit"
                :alt="$t('Details erweitern')"
                @click="showSidebar(id, products[id])"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {fakeData} from "@/config";
import commonMethods from "@/mixins/commonMethods";
import sidebarMethods from "@/mixins/sidebarMethods";
export default {
  name: "DataSourceList",
  mixins: [
    commonMethods,
    sidebarMethods
  ],
  data() {
    return {
      products: null,
      productIds: [],
      fields: [],
      abbreviateAfterColumn: 0,
      resizeTimer: null,
      sidebars: []
    }
  },
  created() {
    window.addEventListener("resize", this.resizeEvent);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeEvent);
  },
  methods: {
    resizeEvent() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(this.refreshTable, 100);
    },
    showHidden(elements) {
      for (let i=0; i<elements.length; i++) {
        elements[i].classList.remove('hidden-column')
      }
    },
    showSidebar(id, product, push = true) {
      this.sidebars = []
      const sidebar = {
        id: id,
        content: product,
        type: 'productEditor',
        width: 25
      }
      this.sidebars.push(sidebar)
      this.$emit('passSidebars', this.sidebars)
      if (push) {
        this.$router.push(`editor/${id}`)
      }
    },
    refreshTable() {
      const component = this
      let showAllHiddenCells = new Promise(function(resolve, reject) {
        component.showHidden(document.getElementsByTagName('th'))
        component.showHidden(document.getElementsByTagName('td'))
        const amountLeft = document.getElementsByClassName('hidden-column').length
        if (amountLeft === 0) {
          resolve();
        } else {
          reject("There was an error on resizing the table.");
        }
      });
      showAllHiddenCells.then(
          function() {
            component.checkForTableClipping()
          },
          function(error) {
            console.log(error);
          }
      );
    },
    checkForTableClipping() {
      // Reset the column to allow for resizing.
      this.abbreviateAfterColumn = 0
      const tableWrapper = document.getElementById("table-wrapper")
      const wrapperWidth = tableWrapper.offsetWidth
      const table = document.getElementById("productsTable")
      const tableHeaders = table.getElementsByTagName("th")
      const tableRows = table.getElementsByTagName("tr")
      let totalWidth = 0
      for (let i=0; (this.abbreviateAfterColumn === 0 && i<tableHeaders.length); i++) {
        const columnHeader = tableHeaders[i]
        const columnWidth = columnHeader.offsetWidth
        totalWidth = totalWidth + columnWidth
        const outOfBounds = totalWidth >= wrapperWidth
        if (outOfBounds) {
          this.abbreviateAfterColumn = i-1
        }
      }
      if(this.abbreviateAfterColumn < tableHeaders.length-1) {
        this.abbreviateTable(tableHeaders,tableRows)
      }
    },
    abbreviateTable(headers, rows) {
      const numberOfColumns = headers.length - 1
      const numberOfRows = rows.length
      for (let i=this.abbreviateAfterColumn; i<numberOfColumns; i++) {
        const header = headers[i]
        header.classList.add('hidden-column')
      }
      for (let i=0; i<numberOfRows; i++) {
        const columns = rows[i].getElementsByTagName("td")
        for (let n = this.abbreviateAfterColumn; n<numberOfColumns; n++) {
          const column = columns[n]
          column.classList.add('hidden-column')
        }
      }
    },
    checkForEditor() {
      const pathElements = this.$route.path.split('/')
      if(pathElements.includes('editor')) {
        let id = pathElements[pathElements.length-1]
        if (id === 'editor') {
          id = null
        } else if (this.sidebars.length === 0) {
          this.showSidebar(id, this.getNthObjectElement(this.products, 0), false)
        }
        const data = {
          'type': 'productEditor',
          'id': id,
          'width': 25
        }
        this.stopMainScroll()
        this.$emit('showSidebar', data)
      } else {
        this.restoreMainScroll()
      }
    },
    pageSetup() {
      const component = this
      let setUpData = new Promise(function(resolve, reject) {
        component.products = fakeData.products
        component.productIds = Object.keys(component.products)
        component.fields = Object.keys(component.products[Object.keys(component.products)[0]])
        if (typeof component.products === 'object') {
          resolve();
        } else {
          reject(`There was an error in getting the data. Products was set as ${typeof component.products}`);
        }
      })
      setUpData.then(
        function() {
          // Both of these need the data to be present to work, so they're wrapped in a promise.
          component.checkForTableClipping()
          component.checkForEditor()
        },
        function(error) {
          console.log(error)
        }
      )
    }
  },
  mounted() {
    this.pageSetup()
  },
  watch: {
    $route() {
      this.checkForEditor()
    }
  }
}

</script>

<style scoped lang="scss">
#table-wrapper {
  overflow: hidden;
  table {
    text-align: left;
    th {
      text-transform: capitalize;
      white-space: nowrap;
      &.actions {
        text-align: center;
      }
    }
    td {
      white-space: nowrap;
      &.actions {
        text-align: center;
        .expand {
          cursor: pointer;
          color: rgb(108,108,108);
          &:hover {
            color: #000;
          }
        }
      }
    }
    .hidden-column {
      display: none;
    }
  }
}

</style>
