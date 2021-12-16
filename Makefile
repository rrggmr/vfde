install:
	helm install --set namespace=vfde-inv-var-dev --set vfde-inv-var-api.namespace=vfde-inv-var-dev --set vfde-inv-var-api.createNamespace=true vfde charts/vfde-inv-var-ui --dependency-update

uninstall:
	helm uninstall vfde

delete-namespace: uninstall
	kubectl delete ns vfde-inv-var-dev
