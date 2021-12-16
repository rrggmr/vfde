<template>
  <div class="playground_holder">
    <h2>Datasource Editor</h2>
    <b-modal
        id="confirmEdit"
        :title="`${$t('Möchten Sie den erweiterten Editor verwenden?')}`"
        v-model="showModal"
        @ok="pythonCodeConfirmEdit(true)"
        @cancel="pythonCodeConfirmEdit(false)"
    >
      <p>{{$t("Möchten Sie den Python-Code direkt bearbeiten? In diesem Fall wird der Basiseditor deaktiviert.")}}</p>
    </b-modal>
    <b-tabs v-model="selectedTab" :key="tabsKey" class="sub-tabs">
      <!-- Basic editor tab -->
      <b-tab :title="$t('Basiseditor')" :active="selectedTab === 0" :disabled="usingAdvancedEditor">
        <b-card class="basic editor">
          <div class="details">
            <div class="datasource-name">
              <div>
                <h3>{{$t('Name der Datenquelle')}}</h3>
                <input @input="uuidGenerate" v-model="datasourceName" type="text" name="datasource-name" />
              </div>
              <div>
                <h3>ID</h3>
                <div class="locked">
                  <input
                      type="text"
                      id="uuid"
                      class="uuid greyed-out"
                      v-model="datasourceUUID"
                      :disabled="uuidDisabled"
                  />
                  <b-button
                      v-if="uuidDisabled"
                      variant="outline-secondary"
                      class="subtle edit-button"
                      @click="uuidAllowFreetext"
                  >
                    ✎
                  </b-button>
                </div>
              </div>
            </div>
            <DatasourceEditorButtons @run="run()" @save="save()" />
          </div>
          <div class="fields">
            <div class="drag-n-drop">
              <h3>{{$t('Felder ziehen und ablegen')}}</h3>
              <span
                  v-for="field in fields" :key="field" :field="field"
                  class="field"
                  @dragstart="fieldsSetFieldType(fieldsNew(field))"
                  draggable="true"
              >
                     {{ field }}
                     </span>
            </div>
            <div class="schema">
              <h3>{{$t('Schema')}}</h3>
              <table id="schema" class="table schema">
                <tr>
                  <th class="hide-on-mobile"></th>
                  <th>{{$t('Feldname')}}</th>
                  <th>{{$t('Feldtyp')}}</th>
                  <th>Nullable</th>
                  <th class="actions ">
                    <b-button @click="fieldsAdd" variant="outline-secondary" class="add">
                      +
                    </b-button>
                  </th>
                </tr>
                <tr
                    v-for="(line, index) in schema"
                    :key="`schema_line_${index}`"
                    draggable="true"
                    @dragstart="fieldsSetFieldType(schema[index], true)"
                    @drop="fieldsDrop"
                    @dragover="fieldsDragOverRow"
                    @dragleave="fieldsLeaveRow"
                >
                  <td class="dragIcon hide-on-mobile">☰</td>
                  <td class="fieldName"><input class="subtle input" v-model="schema[index].name" :placeholder="$t('Feldname')" /></td>
                  <td class="fieldType">
                    <select class="subtle" v-model="schema[index].fieldType">
                      <option v-for="field in fields" :key="`option_${field}`">{{field}}</option>
                    </select>
                  </td>
                  <td>
                    <b-checkbox v-model="schema[index].nullable" switch />
                  </td>
                  <td class="actions">
                    <b-button v-if="index > 0" variant="outline-danger" @click="fieldsDelete(index)" class="subtle delete">x</b-button>
                  </td>
                </tr>
              </table>
            </div>
            <div class="dataTypes">
              <div class="datasourceType">
                <h3>{{$t('Datenquellentyp')}}</h3>
                <select class="subtle" v-model="datasourceType">
                  <option v-for="(format, index) in datasourceTypes" :value="index" :key="`format_${format.name}`">{{format.name}}</option>
                </select>
              </div>
              <div class="streaming">
                <h3>{{$t('Streaming')}}</h3>
                <b-form-checkbox v-model="streaming" switch />
              </div>
            </div>
            <div class="options">
              <h3>{{$t('Optionen')}}</h3>
              <table id="options" class="table options">
                <tr>
                  <th class="option-key">{{$t('Optionsschlüssel')}}</th>
                  <th>{{$t('Optionswert')}}</th>
                  <th class="actions">
                    <b-button @click="optionsAdd" variant="outline-secondary" class="add">
                      +
                    </b-button>
                  </th>
                </tr>
                <tr
                    v-for="(line, index) in options"
                    :key="`option_${index}`"
                >
                  <td class="optionKey">
                    <div class="locked" v-if="!options[index].freeText">
                      <select class="subtle wide" v-model="options[index].key" >
                        <option
                            v-for="(option, index) in datasourceTypes[datasourceType].options"
                            :key="`option_${index}`"
                        >
                          {{ option }}
                        </option>
                      </select>
                      <b-button
                          variant="outline-secondary"
                          class="subtle small-button"
                          @click="optionsMakeKeyFreeText"
                      >
                        ✎
                      </b-button>
                    </div>
                    <input class="subtle wide" v-else v-model="options[index].key" :placeholder="$t('Optionsschlüssel')" />
                  </td>
                  <td class="optionValue">
                    <input class="subtle input" v-model="options[index].value" :placeholder="$t('Optionswert')" />
                  </td>
                  <td class="actions">
                    <b-button v-if="index > 0" variant="outline-danger" @click="optionsDelete(index)" class="subtle delete">x</b-button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </b-card>
      </b-tab>
      <!-- Advanced editor tab -->
      <b-tab :title="$t('fortgeschrittener Editor')" :active="selectedTab === 1" @click="pythonCodeRefresh" >
        <b-card class="advanced editor">
          <div class="advancedName">
            <div>
              <h3>{{$t('Name der Datenquelle')}}</h3>
              <input v-model="datasourceName" type="text" name="datasource-name" />
            </div>
            <DatasourceEditorButtons @run="run()" @save="save()" />
          </div>
          <h3>Python editor</h3>
          <div class="codeEditor">
            <codemirror
                id="pythonEditor"
                @input="pythonCodeCheckEdit"
                @focus="updatingFromBasic = false; pythonCodeCache = pythonCode"
                @blur="updatingFromBasic = true"
                v-model="pythonCode"
                :options="codeMirrorOptionsPythonEditor"
            />
          </div>
        </b-card>
      </b-tab>
    </b-tabs>
    <!-- Results -->
    <b-card class="results table">
      <div class="resultsHeader">
        <h3>{{ $t('Ergebnisse') }}</h3>
        <DatasourceEditorButtons mobile @run="run()" @save="save()" />
      </div>
      <table class="results" v-if="results">
        <tr>
          <th v-for="key in results['keys']" :key="`key_${key}`">{{key}}</th>
        </tr>
        <tr v-for="(row, index) in results['values']" :key="`row_${index}`">
          <td v-for="(value, index) in row" :key="`value_${index}`" >{{value}}</td>
        </tr>
      </table>
      <p v-else>
        {{$t("Eine Vorschau der ersten 15 Ergebniszeilen wird hier angezeigt, wenn Sie Ihren Test erstellen und ausführen.")}}
      </p>
    </b-card>
  </div>
</template>
<script>
import debounce from 'debounce'
import store from "@/store/store";
import conf, {fakeData} from "@/config"
import commonMethods from "@/mixins/commonMethods";
import DatasourceEditorButtons from "@/components/dashboard/config/data_sources/DatasourceEditorButtons";
import axios from "axios";

export default {
  name: "DataSourceEditor",
  components: {DatasourceEditorButtons},
  mixins: [
    commonMethods
  ],
  methods: {

    // Datasource methods
    checkForDatasource() {
      if (this.datasourceId) {
        // Dummy data, needs to be replaced with either an API call or getting the data from memory.
        const datasource = fakeData.dataSources[0]

        if (datasource.editorConfig.advanced) {
          this.selectedTab = 1
          this.tabsKey = Date.now()
          this.pythonCode = datasource.pythonCode
          this.usingAdvancedEditor = true
        }
        this.datasourceUUID = datasource.editorConfig.id.value
        if (datasource.editorConfig.id.freeText) {
          this.uuidAllowFreetext(false)
        }
        this.datasourceName = datasource.name
        this.getDatasourceType(datasource.editorConfig.type)
        this.streaming = datasource.editorConfig.streaming
        this.schema = datasource.editorConfig.fields
        this.options = datasource.editorConfig.options
        this.dateModified = datasource.modified
        this.dateCreated = this.sqlDate(datasource.created)
      } else {
        this.datasourceUUID = this.datasourceUUIDDefault
        this.dateCreated = this.sqlDate()
        this.dateModified = this.sqlDate()
      }
    },
    getDatasourceType(type) {
      for (let i = 0; i < this.datasourceTypes.length; i++) {
        if (this.datasourceTypes[i].name === type) {
          this.datasourceType = i
        }
      }
    },
    async run() {
      this.pythonCodeGenerate();
      // Fake API request to get some dummy data until the backend is ready.
      const url = 'https://mocki.io/v1/de7ddbfc-3683-42d1-b6ca-1d98e95bb6ae'
      const results = await axios.get(url);
      this.results = results.data;
    },
    async save() {
      this.pythonCodeGenerate();
      const datasourceToSave = {
        name: this.datasourceName,
        editorConfig: {
          id: {
            value: this.datasourceUUID,
            freeText: !this.uuidDisabled,
          },
          type: this.datasourceType,
          streaming: this.streaming,
          fields: this.schema,
          options: this.options,
          advanced: this.usingAdvancedEditor
        },
        pythonCode: this.pythonCode,
        created: this.dateCreated,
        modified: this.sqlDate(),
      }
      // Temporarily logging, this will be sent to the API to be saved.
      console.log(datasourceToSave)
    },


    // Fields methods
    fieldsAdd() {
      this.schema.push(this.fieldsNew(this.fields[0]))
    },
    fieldsDelete(index) {
      this.schema.splice(index, 1)
    },
    fieldsNew(fieldType) {
      return {
        name: '',
        fieldType: fieldType,
        nullable: false
      }
    },
    fieldsSetFieldType(field, move = false) {
      this.currentField = field
      if (move) {
        this.originalIndex = event.currentTarget.rowIndex-1
      }
    },
    fieldsDragOverRow(event) {
      event.preventDefault();
      event.currentTarget.classList.add('currentRow');
    },
    fieldsLeaveRow(event) {
      event.currentTarget.classList.remove('currentRow');
    },
    fieldsDrop(event) {
      event.preventDefault();
      // Delete the original row if necessary
      if (this.originalIndex !== null) {
        // Needs to check specifically for null as otherwise row 0 is treated as falsy
        this.schema.splice(this.originalIndex, 1)
      }
      // Add the new or cloned item
      let targetRow = event.currentTarget.rowIndex
      if (this.originalIndex !== null) {
        if (this.originalIndex <= targetRow-1) {
          targetRow --
        }
      }
      this.schema.splice(targetRow, 0, this.currentField)
      event.currentTarget.classList.remove('currentRow');
      this.originalIndex = null
    },

    // Options methods
    optionsAdd() {
      const option = {
        key: 'path',
        value: '',
        freeText: false
      }
      this.options.push(option)
    },
    optionsDelete(index) {
      this.options.splice(index, 1)
    },
    optionsMakeKeyFreeText(event) {
      event.preventDefault()
      const optionIndex = event.currentTarget.parentNode.parentNode.parentNode.rowIndex - 1
      this.options[optionIndex].freeText = true
      const inputs = event.currentTarget.parentNode.parentNode.getElementsByTagName('input')
      // Set very short timeout to give it time to render before focussing.
      setTimeout(function(){ inputs[0].focus() }, 10);

    },

    // Python Code methods
    pythonCodeCheckEdit() {
      if (!this.usingAdvancedEditor && !this.updatingFromBasic) {
        this.showModal = true
      }
    },
    pythonCodeConfirmEdit(confirm) {
      this.showModal = false;
      this.usingAdvancedEditor = confirm;
      if (!confirm) {
        this.pythonCode = this.pythonCodeCache
      }
    },
    pythonCodeGenerate() {
      if (!this.usingAdvancedEditor) {
        // Only automatically generate Python code if the user is using the basic editor.
        this.pythonCode = this.pythonCodeGetSchema() + conf.python.newLine
        this.pythonCode += 'df = spark.read'
        if (this.streaming) {
          this.pythonCode += 'Stream'
        }
        this.pythonCode += conf.python.lineBreak
        this.pythonCode += conf.python.tab + `.format("${this.datasourceTypes[this.datasourceType].name}")` + conf.python.lineBreak
        this.pythonCode += this.pythonCodeGetOptions()
        this.pythonCode += conf.python.tab + `.schema(schema)` + conf.python.lineBreak
        this.pythonCode += conf.python.tab + `.load()` + conf.python.newLine
        this.pythonCode += `df.createOrReplaceTempView("${this.datasourceUUID}")`
      }
    },
    pythonCodeGetSchema() {
      let pythonSchema = '' +
          'schema = StructType([\n'
      this.schema.forEach(
          (field) => {
            pythonSchema += conf.python.tab + `StructField("${field.name}", ${field.fieldType}(), ${field.nullable}),\n`
          }
      );
      pythonSchema += '])'
      return pythonSchema
    },
    pythonCodeGetOptions() {
      let pythonOptions = ''
      this.options.forEach(
          (option) => {
            pythonOptions += conf.python.tab + `.option("${option.key}", "${option.value}")` + conf.python.lineBreak
          }
      )
      return pythonOptions
    },
    pythonCodeRefresh() {
      this.pythonCodeGenerate()
    },

    // UUID methods
    uuidAllowFreetext(focus = true) {
      this.uuidDisabled = false;
      const uuidEditor = document.getElementById("uuid")
      uuidEditor.classList.remove('greyed-out')
      if (focus) {
        // Set very short timeout to give it time to render before focussing.
        setTimeout(function(){ uuidEditor.focus() }, 10);
      }
    },
    uuidGenerate: debounce(function () {
      // Don't generate a new id if freetext mode has been unlocked.
      if (this.uuidDisabled) {
        // Produce a default if the name has been deleted entirely
        if (!this.datasourceName) {
          this.datasourceUUID = this.datasourceUUIDDefault
        }
        else {
          // Lowercase and replace non alpha-numeric characters with dashes,
          // and limit to one dash between each valid character
          this.datasourceUUID = this.datasourceName
              .toLowerCase()
              .trim()
              .replace(/[^(a-z0-9-)]/g, '-')
              .replace(/-+(?=-)/g,'')
          // Trim dashes from beginning and end of the stirng
          if (this.datasourceUUID.startsWith('-')) {
            this.datasourceUUID = this.datasourceUUID.substring(1)
          }
          if (this.datasourceUUID.endsWith('-')) {
            this.datasourceUUID = this.datasourceUUID.slice(0, -1)
          }

          // Check if the uuid already exists, attach time to uuid if so
          let duplicateIndex = store.state.datasourceIds.indexOf(this.datasourceUUID)
          if (duplicateIndex > -1) {
            const currentTime = Date.now().toString()
            this.datasourceUUID += '-' + (currentTime.substr(-5, 5))
          }
        }
      }
    }, conf.debounce.default),

  },
  mounted() {
    this.checkForDatasource()
  },
  props: {
    datasourceId: String
  },
  data() {
    return {
      currentField: '',
      codeMirrorOptionsJSON: conf.cmOptions,
      codeMirrorOptionsPythonEditor: conf.pythonEditorOptions,
      datasourceName: null,
      datasourceUUID: null,
      datasourceUUIDDefault: "datasource-" + Date.now().toString().substr(-5, 5),
      datasourceType: 0,
      datasourceTypes: [...conf.datasourceTypes.sort(),{name: 'other', options: ['path']}],
      dateCreated: null,
      dateModified: null,
      fields: conf.sparkFields.sort(),
      options: [
        {
          key: 'path',
          value: '',
          freeText: false
        }
      ],
      originalIndex: null,
      pythonCode: null,
      pythonCodeCache: null,
      results: null,
      schema: [
        {
          name: '',
          fieldType: 'StringType',
          nullable: false
        }
      ],
      selectedTab: null,
      showModal: false,
      streaming: false,
      tabsKey: Date.now(),
      usingAdvancedEditor: false,
      updatingFromBasic: true,
      uuidDisabled: true
    }
  },
}

</script>
<style lang='scss' scoped>
h2 {
  font-size: 1.25em;
}
.fields {
  display: grid;
  justify-content: left;
  align-items: start;
  grid-gap: 2em;
  grid-template-areas: "drag-n-drop schema"
   "datatypes schema"
   "options schema";
  .drag-n-drop {
    grid-area: drag-n-drop;
  }
  .schema {
    grid-area: schema;
  }
  .options {
    grid-area: options;
  }
  .dataTypes {
    grid-area: datatypes;
  }
}
.disabled {
  color:#999 !important;
}
.vue-codemirror {
  &#pythonEditor {
    .CodeMirror {
      height: auto;
      padding:1em;
      border-radius: .5em;
    }
  }
}
.sub-tabs {
  .nav-tabs {
    border-bottom-width: 2px;
    .nav-item {
      .nav-link {
        background-color: transparent !important;
        padding: 0 1em .6em 1em;
        border: none !important;
        box-shadow: none !important;
        font-weight: normal !important;
        &:hover {
          font-weight: bold !important;
          color: #e60000 !important;
        }
        &.active {
          background-color: transparent;
          font-weight: bold !important;
          cursor: default;
          border-bottom:3px solid #e60000 !important;
          &:hover {
            color: inherit !important;
          }
        }
      }
    }
  }
}
</style>
