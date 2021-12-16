import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
    key: 'vfde-inv-var-ui',
    storage: window.localStorage
})

export default new Vuex.Store({
    state: {
        auth: false,
        locale: 'de',
        datasourceIds: [],
        sidebarContent: {}
    },
    plugins: [
        vuexPersist.plugin
    ],
    mutations: {
        authenticate (state) {
            state.auth = true;
        },
        changeLocale (state, locale) {
            state.locale = locale;
        },
        addDatasourceId (state, datasourceId) {
            state.datasourceIds.push(datasourceId);
        },
        updateSidebarContent (state, sidebarContent) {
            state.sidebarContent = sidebarContent;
        },
        resetSidebar (state) {
            state.sidebarContent = {}
        }
    }
})