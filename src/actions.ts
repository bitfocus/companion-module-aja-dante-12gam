import { API_CALLS } from './enums.js'
import type { AjaDante12GAM } from './main.js'
import { SdiControl, SfpControl } from './schemas.js'
import { Dante12GAM } from './device.js'

export function UpdateActions(self: AjaDante12GAM, device: Dante12GAM): void {
	self.setActionDefinitions({
		sample_action: {
			name: 'My First Action',
			options: [
				{
					id: 'type',
					type: 'dropdown',
					label: 'SDI / SFP',
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
					tooltip: 'Select Parameters to set',
				},
				{
					id: 'hancData',
					type: 'dropdown',
					label: 'HANC Data',
					default: 'Stream A',
					choices: [
						{ id: 'Delete', label: 'Delete' },
						{ id: 'Pass', label: 'Pass' },
					],
					isVisibleExpression: `includes(options:params, hancData)`,
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
					isVisibleExpression: `includes(options:params, levelB)`,
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
					isVisibleExpression: `includes(options:params, channels_1_2)`,
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
					isVisibleExpression: `includes(options:params, channels_3_4)`,
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
					isVisibleExpression: `includes(options:params, channels_5_6)`,
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
					isVisibleExpression: `includes(options:params, channels_7_8)`,
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
					isVisibleExpression: `includes(options:params, channels_9_10)`,
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
					isVisibleExpression: `includes(options:params, channels_11_12)`,
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
					isVisibleExpression: `includes(options:params, channels_13_14)`,
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
					isVisibleExpression: `includes(options:params, channels_15_16)`,
				},
				{
					id: 'enableInternalSignalGenerator',
					type: 'checkbox',
					label: 'Signal Generator',
					default: false,
					isVisibleExpression: `includes(options:params, enableInternalSignalGenerator)`,
				},
				{
					id: 'testPattern',
					type: 'dropdown',
					label: 'Test Pattern',
					default: 'Black',
					choices: [
						{ id: 'Black', label: 'Black' },
						{ id: '100 % Bars', label: '100 % Bars' },
						{ id: 'Grey', label: 'Grey' },
					],
					isVisibleExpression: `includes(options:params, testPattern)`,
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
					isVisibleExpression: `includes(options:params, videoFormat)`,
				},
			],
			callback: async (action, _context) => {
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
						if (key in msg && action.options[key]) msg[key] = action.options[key].toString()
					})
				} else return
				try {
					switch (action.options['type']) {
						case 'sdi':
							await self.clientPut(apiCall, SdiControl.parse(msg))
							break
						case 'sfp':
							await self.clientPut(apiCall, SfpControl.parse(msg))
					}
				} catch (err) {
					self.handleError(err)
				}
			},
		},
	})
}
