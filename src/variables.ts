import type { AjaDante12GAM } from './main.js'
import type { Dante12GAM } from './device.js'
import { CompanionVariableDefinition } from '@companion-module/base'

export function UpdateVariableDefinitions(self: AjaDante12GAM, _device: Dante12GAM): void {
	const variableDefs: CompanionVariableDefinition[] = []

	self.setVariableDefinitions(variableDefs)
}
