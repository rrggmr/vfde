import DataRouter from "@/components/dashboard/data/DataRouter";
import products from "@/router/routes/products";
import contracts from "@/router/routes/contracts";
import prices from "@/router/routes/prices";
import alerts from "@/router/routes/alerts"

export default [{
    path: '/data',
    name: 'Daten',
    component: DataRouter,
    children: [
        ...alerts,
        ...products,
        ...contracts,
        ...prices,
    ]
}]
