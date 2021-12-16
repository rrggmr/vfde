import ConfigRouter from "@/components/dashboard/config/ConfigRouter";
import data_sources from "@/router/routes/data_sources";
import audit_log from "@/router/routes/audit_log";
export default [{
    path: '/config',
    name: 'Konfiguration',
    component: ConfigRouter,
    children: [
        ...data_sources,
        ...audit_log
    ]
}]
