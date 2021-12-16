{{/*
Expand the name of the chart.
*/}}
{{- define "vfde-inv-var-ui-demo.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "vfde-inv-var-ui-demo.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "vfde-inv-var-ui-demo.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "vfde-inv-var-ui-demo.labels" -}}
helm.sh/chart: {{ include "vfde-inv-var-ui-demo.chart" . }}
{{ include "vfde-inv-var-ui-demo.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
App labels
*/}}
{{- define "vfde-inv-var-ui-demo.uiLabels" -}}
{{ include "vfde-inv-var-ui-demo.labels" . }}
{{ include "vfde-inv-var-ui-demo.uiSelectorLabels" . }}
{{- end}}

{{/*
Selector labels
*/}}
{{- define "vfde-inv-var-ui-demo.selectorLabels" -}}
app.kubernetes.io/name: {{ include "vfde-inv-var-ui-demo.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "vfde-inv-var-ui-demo.uiSelectorLabels" -}}
app.kubernetes.io/name: ui
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "vfde-inv-var-ui-demo.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "vfde-inv-var-ui-demo.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
