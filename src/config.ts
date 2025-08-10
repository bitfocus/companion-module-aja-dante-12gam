import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	bonjourHost?: string
	host: string
	port: number
	pollInterval: number
	verbose: boolean
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'bonjour-device',
			id: 'bonjourHost',
			label: 'Device',
			width: 6,
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Host',
			width: 8,
			regex: Regex.HOSTNAME,
			isVisibleExpression: `!$(options:bonjourHost)`,
		},
		{
			type: 'static-text',
			id: 'host_filler',
			label: '',
			value: '',
			width: 8,
			isVisibleExpression: `$(options:bonjourHost)`,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port',
			width: 4,
			min: 1,
			max: 65535,
			default: 80,
			isVisibleExpression: `!$(options:bonjourHost)`,
		},
		{
			type: 'static-text',
			id: 'port_filler',
			label: '',
			value: '',
			width: 4,
			isVisibleExpression: `$(options:bonjourHost)`,
		},
		{
			type: 'number',
			id: 'pollInterval',
			label: 'Poll Interval (ms)',
			width: 4,
			min: 200,
			max: 60000,
			default: 1000,
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Verbose Logs',
			width: 4,
			default: false,
		},
	]
}
