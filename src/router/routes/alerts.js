import AlertsRouter from "@/components/dashboard/alerts/AlertsRouter";
import Alerts from "@/components/dashboard/alerts/Alerts";

export default [
  {
    path: '/alerts',
    name: 'Warnungen',
    component: AlertsRouter,
    children: [
      {
        component: Alerts,
        path: 'grouped',
        name: 'Warnungen',
        props: {
          startingTab: 'grouped'
        }
      },
      {
        component: Alerts,
        path: 'all',
        name: 'Alle Warnungen',
        props: {
          startingTab: 'all'
        }
      },
      {
        component: Alerts,
        path: 'alerts/:alertId',
        name: 'Zusammenfassung',
        props: true
      },
    ]
  },
]


