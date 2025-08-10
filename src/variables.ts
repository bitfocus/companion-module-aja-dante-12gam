import type { AjaDante12GAM } from './main.js'
import type { Dante12GAM } from './device.js'
import { CompanionVariableDefinition } from '@companion-module/base'

export function UpdateVariableDefinitions(self: AjaDante12GAM, device: Dante12GAM): void {
	const variableDefs: CompanionVariableDefinition[] = []
	variableDefs.push({ variableId: `alarms`, name: `Number of Alarms` })
	for (const [key, _value] of Object.entries(device.buildInfo)) {
		variableDefs.push({ variableId: `buildInfo_${key}`, name: `Build Info: ${key}` })
	}
	for (const [key, _value] of Object.entries(device.status)) {
		variableDefs.push({ variableId: `status_${key}`, name: `Status: ${key}` })
	}
	for (const [key, _value] of Object.entries(device.systemStatus)) {
		variableDefs.push({ variableId: `systemStatus_${key}`, name: `System Status: ${key}` })
	}
	for (const [key, _value] of Object.entries(device.systemConfig)) {
		variableDefs.push({ variableId: `systemConfig_${key}`, name: `System Config: ${key}` })
	}
	for (const [key, _value] of Object.entries(device.sdiControl)) {
		variableDefs.push({ variableId: `sdiControl_${key}`, name: `SDI Control: ${key}` })
	}
	for (const [key, _value] of Object.entries(device.sfpControl)) {
		variableDefs.push({ variableId: `sfpControl_${key}`, name: `SFP Control: ${key}` })
	}
	for (const [key, _value] of Object.entries(device.danteStatus)) {
		variableDefs.push({ variableId: `danteStatus_${key}`, name: `Dante Status: ${key}` })
	}
	for (const [key, _value] of Object.entries(device.environmentStatus)) {
		variableDefs.push({ variableId: `environmentStatus_${key}`, name: `Environment Status: ${key}` })
	}
	for (const [i, value] of device.discovers.entries()) {
		if (typeof value == 'object' && value !== null) {
			for (const [key2, _value2] of Object.entries(value)) {
				variableDefs.push({ variableId: `discovers_${i}_${key2}`, name: `Disocvers: ${i} - ${key2}` })
			}
		}
	}
	for (const [key, value] of Object.entries(device.sdiStatus)) {
		if (typeof value == 'object' && value !== null) {
			for (const [key2, _value2] of Object.entries(value)) {
				variableDefs.push({ variableId: `sdiStatus_${key}_${key2}`, name: `SDI Status: ${key} - ${key2}` })
			}
		} else {
			variableDefs.push({ variableId: `sdiStatus_${key}`, name: `SDI Status: ${key}` })
		}
	}
	for (const [key, value] of Object.entries(device.sfpStatus)) {
		if (typeof value == 'object' && value !== null) {
			for (const [key2, _value2] of Object.entries(value)) {
				variableDefs.push({ variableId: `sfpStatus${key}_${key2}`, name: `SFP Status: ${key} - ${key2}` })
			}
		} else {
			variableDefs.push({ variableId: `sfpStatus_${key}`, name: `SFP Status: ${key}` })
		}
	}
	for (const [i, netDevice] of device.netDevices.entries()) {
		for (const [key, value] of Object.entries(netDevice)) {
			if (typeof value == 'object' && value !== null) {
				for (const [key2, _value2] of Object.entries(value)) {
					variableDefs.push({
						variableId: `netDevice_${i}_${key}_${key2}`,
						name: `Net Device [${i}]: ${key} - ${key2}`,
					})
				}
			}
		}
	}
	self.setVariableDefinitions(variableDefs)
}
