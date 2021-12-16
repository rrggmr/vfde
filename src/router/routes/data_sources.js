import DataSourceEditor from "@/components/dashboard/config/data_sources/DataSourceEditor";
import DataSourceList from "@/components/dashboard/config/data_sources/DataSourceList";
import DataSourceRouter from "@/components/dashboard/config/data_sources/DataSourceRouter";

export default [{
    path: 'data-sources',
    name: 'Datenquellen',
    component: DataSourceRouter,
    children: [
        {
          path: '/',
          name: 'Datenquellen',
          component: DataSourceList
        },
        {
            path: 'editor',
            name: 'Datenquellen-Editor',
            component: DataSourceEditor,
        },
        {
            path: 'editor/:datasourceId',
            name: 'Datenquellen-Editor',
            component: DataSourceEditor,
            props: true
        }
    ]


}]
