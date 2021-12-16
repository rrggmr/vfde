import AuditLog from "@/components/dashboard/config/audit_log/AuditLog";


export default [
    {
        path: 'audit-log',
        name: 'Audit-Log',
        component: AuditLog,
        props: {
            activeTab: 'audit-log'
        }
    },
]
