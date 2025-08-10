import type { AjaDante12GAM } from './main.js'
import type { Dante12GAM } from './device.js'
import { CompanionVariableValues } from '@companion-module/base'

export function UpdateVariableValues(self: AjaDante12GAM, device: Dante12GAM): void {
	const variableValues: CompanionVariableValues = {}
	variableValues['alarms'] = device.alarms.length
	for (const [key, value] of Object.entries(device.buildInfo)) {
		variableValues[`buildInfo_${key}`] = value ?? undefined
	}
	for (const [key, value] of Object.entries(device.status)) {
		variableValues[`status_${key}`] = value ?? undefined
	}
	for (const [key, value] of Object.entries(device.systemStatus)) {
		variableValues[`systemStatus_${key}`] = value ?? undefined
	}
	for (const [key, value] of Object.entries(device.systemConfig)) {
		variableValues[`systemConfig_${key}`] = value ?? undefined
	}
	for (const [key, value] of Object.entries(device.sdiControl)) {
		variableValues[`sdiControl_${key}`] = value ?? undefined
	}
	for (const [key, value] of Object.entries(device.sfpControl)) {
		variableValues[`sfpControl_${key}`] = value ?? undefined
	}
	for (const [key, value] of Object.entries(device.danteStatus)) {
		variableValues[`danteStatus_${key}`] = Array.from(value).join() ?? undefined
	}
	for (const [key, value] of Object.entries(device.environmentStatus)) {
		variableValues[`environmentStatus_${key}`] = value ?? undefined
	}
	for (const [i, value] of device.discovers.entries()) {
		if (typeof value == 'object' && value !== null) {
			for (const [key2, value2] of Object.entries(value)) {
				variableValues[`discovers_${i}_${key2}`] = value2
			}
		}
	}
	for (const [key, value] of Object.entries(device.sdiStatus)) {
		if (typeof value == 'object' && value !== null) {
			for (const [key2, value2] of Object.entries(value)) {
				variableValues[`sdiStatus_${key}_${key2}`] = value2
			}
		} else if (typeof value !== 'object') {
			variableValues[`sdiStatus_${key}`] = value
		}
	}
	for (const [key, value] of Object.entries(device.sfpStatus)) {
		if (typeof value == 'object' && value !== null) {
			for (const [key2, value2] of Object.entries(value)) {
				variableValues[`sfpStatus_${key}_${key2}`] = value2
			}
		} else if (typeof value !== 'object') {
			variableValues[`sfpStatus_${key}`] = value
		}
	}
	for (const [i, netDevice] of device.netDevices.entries()) {
		for (const [key, value] of Object.entries(netDevice)) {
			if (typeof value == 'object' && value !== null) {
				for (const [key2, value2] of Object.entries(value)) {
					variableValues[`netDevice_${i}_${key}_${key2}`] = value2
				}
			}
		}
	}
	self.setVariableValues(variableValues)
}
