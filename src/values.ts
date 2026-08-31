import type AjaDante12GAM from './main.js'
import type { Dante12GAM } from './device.js'
import type { DanteStatus } from './schemas.js'
import type {
	DanteStatusVariables,
	FlatVariables,
	IndexedNestedVariables,
	IndexedVariables,
	OneLevelVariables,
	VariableSchema,
} from './types.js'
import { entriesOf } from './util.js'

/** Values for a flat object, named `prefix_key` */
function flatValues<TPrefix extends string, TShape extends object>(
	prefix: TPrefix,
	shape: TShape,
): FlatVariables<TPrefix, TShape> {
	const values: Record<string, unknown> = {}
	for (const [key, value] of entriesOf(shape)) {
		values[`${prefix}_${key}`] = value
	}
	return values as FlatVariables<TPrefix, TShape>
}

/** Values for an object of mixed scalar and object values, flattened one level */
function oneLevelValues<TPrefix extends string, TShape extends object>(
	prefix: TPrefix,
	shape: TShape,
): OneLevelVariables<TPrefix, TShape> {
	const values: Record<string, unknown> = {}
	for (const [key, value] of entriesOf(shape)) {
		if (typeof value === 'object' && value !== null) {
			for (const [key2, value2] of entriesOf(value)) {
				values[`${prefix}_${key}_${key2}`] = value2
			}
		} else {
			values[`${prefix}_${key}`] = value
		}
	}
	return values as OneLevelVariables<TPrefix, TShape>
}

/** Values for one entry of an array of flat objects, named `prefix_index_key` */
function indexedValues<TPrefix extends string, TShape extends object>(
	prefix: TPrefix,
	index: number,
	shape: TShape,
): IndexedVariables<TPrefix, TShape> {
	const values: Record<string, unknown> = {}
	for (const [key, value] of entriesOf(shape)) {
		values[`${prefix}_${index}_${key}`] = value
	}
	return values as IndexedVariables<TPrefix, TShape>
}

/** Values for one entry of an array of nested objects, named `prefix_index_key_subkey` */
function indexedNestedValues<TPrefix extends string, TShape extends object>(
	prefix: TPrefix,
	index: number,
	shape: TShape,
): IndexedNestedVariables<TPrefix, TShape> {
	const values: Record<string, unknown> = {}
	for (const [key, value] of entriesOf(shape)) {
		if (typeof value !== 'object' || value === null) continue
		for (const [key2, value2] of entriesOf(value)) {
			values[`${prefix}_${index}_${key}_${key2}`] = value2
		}
	}
	return values as IndexedNestedVariables<TPrefix, TShape>
}

/** The Dante channel sets are exposed as comma separated lists */
function danteStatusValues(status: DanteStatus): DanteStatusVariables {
	const values: Record<string, string> = {}
	for (const [key, channels] of entriesOf(status)) {
		values[`danteStatus_${key}`] = [...channels].join()
	}
	return values as DanteStatusVariables
}

export function UpdateVariableValues(self: AjaDante12GAM, device: Dante12GAM): void {
	const variableValues: Partial<VariableSchema> = {
		alarms: device.alarms.length,
		...flatValues('buildInfo', device.buildInfo),
		...flatValues('status', device.status),
		...flatValues('systemStatus', device.systemStatus),
		...flatValues('systemConfig', device.systemConfig),
		...flatValues('sdiControl', device.sdiControl),
		...flatValues('sfpControl', device.sfpControl),
		...danteStatusValues(device.danteStatus),
		...flatValues('environmentStatus', device.environmentStatus),
		...oneLevelValues('sdiStatus', device.sdiStatus),
		...oneLevelValues('sfpStatus', device.sfpStatus),
	}

	for (const [index, discover] of device.discovers.entries()) {
		Object.assign(variableValues, indexedValues('discovers', index, discover))
	}
	for (const [index, netDevice] of device.netDevices.entries()) {
		Object.assign(variableValues, indexedNestedValues('netDevice', index, netDevice))
	}

	self.setVariableValues(variableValues)
}
