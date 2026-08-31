import { API_CALLS } from './enums.js'
import type AjaDante12GAM from './main.js'
import { Channel, HancData, LevelB, SdiControl, SfpControl, TestPattern, VideoFormat } from './schemas.js'
import { Dante12GAM } from './device.js'
import { portOption, toChoices, type PortType } from './options.js'
import { unhandledOption } from './util.js'
import {
	type CompanionActionDefinitions,
	type DropdownChoice,
	InstanceStatus,
	type JsonValue,
	createModuleLogger,
} from '@companion-module/base'

const logger = createModuleLogger('Actions')

export enum ActionId {
	ControlPort = 'control_port',
}

/** The control parameters that may be included in a control port action */
export type ControlParam = keyof SfpControl

/**
 * Every control parameter is typed by the schema it is sent under, so each option value is a
 * union of the literals the device accepts rather than a bare string.
 */
export type ControlPortOptions = SfpControl & {
	type: PortType
	params: ControlParam[]
}

const controlParamChoices: DropdownChoice<ControlParam>[] = [
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
]

export type ActionSchema = {
	[ActionId.ControlPort]: {
		options: ControlPortOptions
	}
}

export function UpdateActions(self: AjaDante12GAM, device: Dante12GAM): void {
	const actions: CompanionActionDefinitions<ActionSchema> = {
		[ActionId.ControlPort]: {
			name: 'Control Port',
			options: [
				// `type` and `params` are referenced by the isVisibleExpression of the fields below,
				// which is only allowed for fields that cannot themselves be expressions
				{ ...portOption, disableAutoExpression: true },
				{
					id: 'params',
					type: 'multidropdown',
					label: 'Parameters',
					default: ['channels_1_2'],
					choices: controlParamChoices,
					minSelection: 1,
					tooltip: 'Select Parameters to set',
					disableAutoExpression: true,
				},
				{
					id: 'hancData',
					type: 'dropdown',
					label: 'HANC Data',
					default: 'Pass',
					choices: toChoices(HancData),
					isVisibleExpression: `arrayIncludes($(options:params), "hancData")`,
				},
				{
					id: 'levelB',
					type: 'dropdown',
					label: 'Level B',
					default: 'Stream A',
					choices: toChoices(LevelB),
					isVisibleExpression: `arrayIncludes($(options:params), "levelB")`,
				},
				{
					id: 'channels_1_2',
					type: 'dropdown',
					label: 'Ch 1/2',
					default: 'Pass',
					choices: toChoices(Channel),
					isVisibleExpression: `arrayIncludes($(options:params), "channels_1_2")`,
				},
				{
					id: 'channels_3_4',
					type: 'dropdown',
					label: 'Ch 3/4',
					default: 'Pass',
					choices: toChoices(Channel),
					isVisibleExpression: `arrayIncludes($(options:params), "channels_3_4")`,
				},
				{
					id: 'channels_5_6',
					type: 'dropdown',
					label: 'Ch 5/6',
					default: 'Pass',
					choices: toChoices(Channel),
					isVisibleExpression: `arrayIncludes($(options:params), "channels_5_6")`,
				},
				{
					id: 'channels_7_8',
					type: 'dropdown',
					label: 'Ch 7/8',
					default: 'Pass',
					choices: toChoices(Channel),
					isVisibleExpression: `arrayIncludes($(options:params), "channels_7_8")`,
				},
				{
					id: 'channels_9_10',
					type: 'dropdown',
					label: 'Ch 9/10',
					default: 'Pass',
					choices: toChoices(Channel),
					isVisibleExpression: `arrayIncludes($(options:params), "channels_9_10")`,
				},
				{
					id: 'channels_11_12',
					type: 'dropdown',
					label: 'Ch 11/12',
					default: 'Pass',
					choices: toChoices(Channel),
					isVisibleExpression: `arrayIncludes($(options:params), "channels_11_12")`,
				},
				{
					id: 'channels_13_14',
					type: 'dropdown',
					label: 'Ch 13/14',
					default: 'Pass',
					choices: toChoices(Channel),
					isVisibleExpression: `arrayIncludes($(options:params), "channels_13_14")`,
				},
				{
					id: 'channels_15_16',
					type: 'dropdown',
					label: 'Ch 15/16',
					default: 'Pass',
					choices: toChoices(Channel),
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
					choices: toChoices(TestPattern),
					isVisibleExpression: `arrayIncludes($(options:params), "testPattern")`,
				},
				{
					id: 'videoFormat',
					type: 'dropdown',
					label: 'Video Format',
					default: '720p50',
					choices: toChoices(VideoFormat),
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
			callback: async ({ options }) => {
				let apiCall: API_CALLS.ControlSdi | API_CALLS.ControlSfp
				// Start from the last known device state, so unselected parameters are left as they are
				let msg: Record<string, JsonValue>
				switch (options.type) {
					case 'sdi':
						if (!device.sdiControlKnown) {
							logger.warn(`${ActionId.ControlPort}: SDI control state has not been read from the device yet`)
							return
						}
						apiCall = API_CALLS.ControlSdi
						msg = { ...device.sdiControl }
						break
					case 'sfp':
						if (!device.sfpControlKnown) {
							logger.warn(`${ActionId.ControlPort}: SFP control state has not been read from the device yet`)
							return
						}
						apiCall = API_CALLS.ControlSfp
						msg = { ...device.sfpControl }
						break
					default:
						return unhandledOption(options.type, undefined)
				}
				if (!Array.isArray(options.params) || options.params.length === 0) return
				for (const parameter of options.params) {
					const value = options[parameter]
					if (parameter in msg && value !== undefined) msg[parameter] = value
				}
				try {
					const response =
						apiCall === API_CALLS.ControlSdi
							? await self.clientPut(apiCall, SdiControl.parse(msg))
							: await self.clientPut(apiCall, SfpControl.parse(msg))
					if (self.config.verbose && response) {
						logger.debug(`${apiCall} sent. Response: ${JSON.stringify(response.data)}`)
					}
					self.statusManager.updateStatus(InstanceStatus.Ok)
				} catch (err) {
					self.handleError(err)
				}
			},
			// Only return the learned values, so that expressions in the other fields are preserved
			learn: ({ options }) => {
				switch (options.type) {
					case 'sdi':
						return device.sdiControlKnown ? { ...device.sdiControl } : undefined
					case 'sfp':
						return device.sfpControlKnown ? { ...device.sfpControl } : undefined
					default:
						return unhandledOption(options.type, undefined)
				}
			},
		},
	}
	self.setActionDefinitions(actions)
}
