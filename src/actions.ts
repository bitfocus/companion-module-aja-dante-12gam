import { API_CALLS } from './enums.js'
import type { AjaDante12GAM } from './main.js'
import { SdiControl, SfpControl } from './schemas.js'
import { Dante12GAM } from './device.js'
import { AxiosResponse } from 'axios'
import {
	CompanionActionContext,
	CompanionActionDefinition,
	CompanionActionEvent,
	InstanceStatus,
} from '@companion-module/base'

export enum ActionId {
	ControlPort = 'control_port',
}

export function UpdateActions(self: AjaDante12GAM, device: Dante12GAM): void {
	const actions: { [id in ActionId]: CompanionActionDefinition | undefined } = {
		[ActionId.ControlPort]: {
			name: 'Control Port',
			options: [
				{
					id: 'type',
					type: 'dropdown',
					label: 'Port',
					default: 'sdi',
					choices: [
						{ id: 'sdi', label: 'SDI' },
						{ id: 'sfp', label: 'SFP' },
					],
				},
				{
					id: 'params',
					type: 'multidropdown',
					label: 'Parameters',
					default: ['channels_1_2'],
					choices: [
						{ id: 'hancData', label: 'HANC Data' },
						{ id: 'levelB', label: 'Level B' },
						{ id: 'channels_1_2', label: 'Ch 1/2' },
						{ id: 'channels_3_4', label: 'Ch 3/4' },
						{ id: 'channels_5_6', label: 'Ch 5/6' },
						{ id: 'channels_7_8', label: 'Ch 7/8' },
						{ id: 'channels_9_10', label: 'Ch 9/10' },
						{ id: 'channels_11_12', label: 'Ch 11/12' },
						{ id: 'channels_13_14', label: 'Ch 13/14' },
						{ id: 'channels_15_16', label: 'Ch 15/16' },
						{ id: 'enableInternalSignalGenerator', label: 'Signal Generator' },
						{ id: 'testPattern', label: 'Test Pattern' },
						{ id: 'videoFormat', label: 'Video Format' },
						//{ id: 'testTone', label: 'Test Tone' },
					],
					minSelection: 1,
					tooltip: 'Select Parameters to set',
				},
				{
					id: 'hancData',
					type: 'dropdown',
					label: 'HANC Data',
					default: 'Pass',
					choices: [
						{ id: 'Delete', label: 'Delete' },
						{ id: 'Pass', label: 'Pass' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "hancData")`,
				},
				{
					id: 'levelB',
					type: 'dropdown',
					label: 'Level B',
					default: 'Stream A',
					choices: [
						{ id: 'Stream A', label: 'Stream A' },
						{ id: 'Stream B', label: 'Stream B' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "levelB")`,
				},
				{
					id: 'channels_1_2',
					type: 'dropdown',
					label: 'Ch 1/2',
					default: 'Pass',
					choices: [
						{ id: 'Pass', label: 'Pass' },
						{ id: 'Embed', label: 'Embed' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "channels_1_2")`,
				},
				{
					id: 'channels_3_4',
					type: 'dropdown',
					label: 'Ch 3/4',
					default: 'Pass',
					choices: [
						{ id: 'Pass', label: 'Pass' },
						{ id: 'Embed', label: 'Embed' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "channels_3_4")`,
				},
				{
					id: 'channels_5_6',
					type: 'dropdown',
					label: 'Ch 5/6',
					default: 'Pass',
					choices: [
						{ id: 'Pass', label: 'Pass' },
						{ id: 'Embed', label: 'Embed' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "channels_5_6")`,
				},
				{
					id: 'channels_7_8',
					type: 'dropdown',
					label: 'Ch 7/8',
					default: 'Pass',
					choices: [
						{ id: 'Pass', label: 'Pass' },
						{ id: 'Embed', label: 'Embed' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "channels_7_8")`,
				},
				{
					id: 'channels_9_10',
					type: 'dropdown',
					label: 'Ch 9/10',
					default: 'Pass',
					choices: [
						{ id: 'Pass', label: 'Pass' },
						{ id: 'Embed', label: 'Embed' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "channels_9_10")`,
				},
				{
					id: 'channels_11_12',
					type: 'dropdown',
					label: 'Ch 11/12',
					default: 'Pass',
					choices: [
						{ id: 'Pass', label: 'Pass' },
						{ id: 'Embed', label: 'Embed' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "channels_11_12")`,
				},
				{
					id: 'channels_13_14',
					type: 'dropdown',
					label: 'Ch 13/14',
					default: 'Pass',
					choices: [
						{ id: 'Pass', label: 'Pass' },
						{ id: 'Embed', label: 'Embed' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "channels_13_14")`,
				},
				{
					id: 'channels_15_16',
					type: 'dropdown',
					label: 'Ch 15/16',
					default: 'Pass',
					choices: [
						{ id: 'Pass', label: 'Pass' },
						{ id: 'Embed', label: 'Embed' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "channels_15_16")`,
				},
				{
					id: 'enableInternalSignalGenerator',
					type: 'checkbox',
					label: 'Signal Generator',
					default: false,
					isVisibleExpression: `arrayIncludes($(options:params), "enableInternalSignalGenerator")`,
				},
				{
					id: 'testPattern',
					type: 'dropdown',
					label: 'Test Pattern',
					default: 'Black',
					choices: [
						{ id: 'Black', label: 'Black' },
						{ id: '100% Bars', label: '100% Bars' },
						{ id: 'Grey', label: 'Grey' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "testPattern")`,
				},
				{
					id: 'videoFormat',
					type: 'dropdown',
					label: 'Video Format',
					default: '720p50',
					choices: [
						{ id: '720p50', label: '720p50' },
						{ id: '720p59.94', label: '720p59.94' },
						{ id: '1080i50', label: '1080i50' },
						{ id: '1080i59.94', label: '1080i59.94' },
					],
					isVisibleExpression: `arrayIncludes($(options:params), "videoFormat")`,
				},
				{
					id: 'testTone',
					type: 'dropdown',
					label: 'Test Tone',
					default: '1kHz',
					choices: [{ id: '1kHz', label: '1 kHz' }],
					isVisibleExpression: `arrayIncludes($(options:params), "testTone") && ($(options:type) == 'sfp')`,
				},
				{
					id: 'testToneText',
					type: 'static-text',
					label: '',
					value: 'Test Tone control is only available on the SFP port.',
					isVisibleExpression: `arrayIncludes($(options:params), "testTone") && ($(options:type) == 'sdi')`,
				},
			],
			callback: async (action: CompanionActionEvent, _context: CompanionActionContext) => {
				let msg: SdiControl | SfpControl
				let apiCall: API_CALLS
				switch (action.options['type']) {
					case 'sdi':
						apiCall = API_CALLS.ControlSdi
						msg = device.sdiControl
						break
					case 'sfp':
						apiCall = API_CALLS.ControlSfp
						msg = device.sfpControl
						break
					default:
						return
				}
				if (Array.isArray(action.options.params) && action.options.params.length > 0) {
					action.options.params.forEach((parameter) => {
						const key = parameter.toString()
						//@ts-expect-error msg key validation
						if (key in msg && action.options?.[key] !== undefined) msg[key] = action.options[key].toString()
					})
				} else return
				try {
					const response: AxiosResponse<any, any> | void =
						action.options['type'] == 'sdi'
							? await self.clientPut(apiCall, SdiControl.parse(msg))
							: await self.clientPut(apiCall, SfpControl.parse(msg))
					if (self.config.verbose && response) {
						self.log('debug', `${apiCall} sent. Response: ${JSON.stringify(response.data)}`)
					}
					self.statusManager.updateStatus(InstanceStatus.Ok)
				} catch (err) {
					self.handleError(err)
				}
			},
			learn: (action: CompanionActionEvent, _context: CompanionActionContext) => {
				switch (action.options['type']) {
					case 'sdi':
						return {
							...action.options,
							...device.sdiControl,
						}
					case 'sfp':
						return {
							...action.options,
							...device.sfpControl,
						}
				}
				return undefined
			},
		},
	}
	self.setActionDefinitions(actions)
}
