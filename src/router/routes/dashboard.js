import DashboardRouter from "@/components/dashboard/DashboardRouter";
import zeppelin from "@/router/routes/zeppelin";
import aws from "@/router/routes/aws";
import config from "@/router/routes/config";
import data from "@/router/routes/data"
export default [{
    path: '/',
    name: 'Hauptseite',
    component: DashboardRouter,
    children: [
        ...data,
        ...config,
        ...zeppelin,
        ...aws
    ]
}]
