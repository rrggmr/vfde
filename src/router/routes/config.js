import ConfigRouter from "@/components/dashboard/config/ConfigRouter";
import data_sources from "@/router/routes/data_sources";
import audit_log from "@/router/routes/audit_log";
import alert_groups from "@/router/routes/alert_groups";
import rules from "@/router/routes/rules";

export default [{
    path: '/config',
    name: 'Konfiguration',
    component: ConfigRouter,
    children: [
        ...data_sources,
        ...rules,
        ...alert_groups,
        ...audit_log
    ]
}]
