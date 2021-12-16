import DashboardRouter from "@/components/dashboard/DashboardRouter";
import alerts from "@/router/routes/alerts";
import zeppelin from "@/router/routes/zeppelin";
import aws from "@/router/routes/aws";
import config from "@/router/routes/config";
export default [{
    path: '/',
    name: 'Zuhause',
    component: DashboardRouter,
    children: [
        ...alerts,
        ...config,
        ...zeppelin,
        ...aws,
    ]
}]
