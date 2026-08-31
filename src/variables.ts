import type AjaDante12GAM from './main.js'
import type { Dante12GAM } from './device.js'
import type { CompanionVariableDefinition, CompanionVariableDefinitions } from '@companion-module/base'
import type {
	FlatVariables,
	IndexedNestedVariables,
	IndexedVariables,
	OneLevelVariables,
	VariableSchema,
} from './types.js'
import { entriesOf, keysOf } from './util.js'

/** The definitions for a set of variables. Only the names differ per variable, the shape does not. */
type DefinitionsFor<TVariables> = { [K in Extract<keyof TVariables, string>]: CompanionVariableDefinition }

/** Definitions for a flat object, named `prefix_key` */
function flatDefinitions<TPrefix extends string, TShape extends object>(
	prefix: TPrefix,
	shape: TShape,
	label: string,
): DefinitionsFor<FlatVariables<TPrefix, TShape>> {
	const defs: Record<string, CompanionVariableDefinition> = {}
	for (const key of keysOf(shape)) {
		defs[`${prefix}_${key}`] = { name: `${label}: ${key}` }
	}
	return defs as DefinitionsFor<FlatVariables<TPrefix, TShape>>
}

/** Definitions for an object of mixed scalar and object values, flattened one level */
function oneLevelDefinitions<TPrefix extends string, TShape extends object>(
	prefix: TPrefix,
	shape: TShape,
	label: string,
): DefinitionsFor<OneLevelVariables<TPrefix, TShape>> {
	const defs: Record<string, CompanionVariableDefinition> = {}
	for (const [key, value] of entriesOf(shape)) {
		if (typeof value === 'object' && value !== null) {
			for (const key2 of keysOf(value)) {
				defs[`${prefix}_${key}_${key2}`] = { name: `${label}: ${key} - ${key2}` }
			}
		} else {
			defs[`${prefix}_${key}`] = { name: `${label}: ${key}` }
		}
	}
	return defs as DefinitionsFor<OneLevelVariables<TPrefix, TShape>>
}

/** Definitions for one entry of an array of flat objects, named `prefix_index_key` */
function indexedDefinitions<TPrefix extends string, TShape extends object>(
	prefix: TPrefix,
	index: number,
	shape: TShape,
	label: string,
): DefinitionsFor<IndexedVariables<TPrefix, TShape>> {
	const defs: Record<string, CompanionVariableDefinition> = {}
	for (const key of keysOf(shape)) {
		defs[`${prefix}_${index}_${key}`] = { name: `${label}: ${index} - ${key}` }
	}
	return defs as DefinitionsFor<IndexedVariables<TPrefix, TShape>>
}

/** Definitions for one entry of an array of nested objects, named `prefix_index_key_subkey` */
function indexedNestedDefinitions<TPrefix extends string, TShape extends object>(
	prefix: TPrefix,
	index: number,
	shape: TShape,
	label: string,
): DefinitionsFor<IndexedNestedVariables<TPrefix, TShape>> {
	const defs: Record<string, CompanionVariableDefinition> = {}
	for (const [key, value] of entriesOf(shape)) {
		if (typeof value !== 'object' || value === null) continue
		for (const key2 of keysOf(value)) {
			defs[`${prefix}_${index}_${key}_${key2}`] = { name: `${label} [${index}]: ${key} - ${key2}` }
		}
	}
	return defs as DefinitionsFor<IndexedNestedVariables<TPrefix, TShape>>
}

export function UpdateVariableDefinitions(self: AjaDante12GAM, device: Dante12GAM): void {
	// Every statically named variable in the schema must be defined here, or this fails to compile
	const variableDefs: CompanionVariableDefinitions<VariableSchema> = {
		alarms: { name: `Number of Alarms` },
		...flatDefinitions('buildInfo', device.buildInfo, 'Build Info'),
		...flatDefinitions('status', device.status, 'Status'),
		...flatDefinitions('systemStatus', device.systemStatus, 'System Status'),
		...flatDefinitions('systemConfig', device.systemConfig, 'System Config'),
		...flatDefinitions('sdiControl', device.sdiControl, 'SDI Control'),
		...flatDefinitions('sfpControl', device.sfpControl, 'SFP Control'),
		...flatDefinitions('danteStatus', device.danteStatus, 'Dante Status'),
		...flatDefinitions('environmentStatus', device.environmentStatus, 'Environment Status'),
		...oneLevelDefinitions('sdiStatus', device.sdiStatus, 'SDI Status'),
		...oneLevelDefinitions('sfpStatus', device.sfpStatus, 'SFP Status'),
	}

	// These are keyed by array index, so they only exist once the device has reported them
	for (const [index, discover] of device.discovers.entries()) {
		Object.assign(variableDefs, indexedDefinitions('discovers', index, discover, 'Discovers'))
	}
	for (const [index, netDevice] of device.netDevices.entries()) {
		Object.assign(variableDefs, indexedNestedDefinitions('netDevice', index, netDevice, 'Net Device'))
	}

	self.setVariableDefinitions(variableDefs)
}
