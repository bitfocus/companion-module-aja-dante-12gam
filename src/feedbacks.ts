import { combineRgb, CompanionFeedbackDefinition, CompanionInputFieldDropdown } from '@companion-module/base'
import type { AjaDante12GAM } from './main.js'

export enum FeedbackId {
	DanteChannels = 'dante_channels',
	EmbeddedAudio = 'embedded_audio',
	InputLocked = 'input_locked',
}

const styles = {
	blackOnWhite: {
		bgcolor: combineRgb(255, 255, 255),
		color: combineRgb(0, 0, 0),
	},
	blackOnRed: {
		bgcolor: combineRgb(255, 0, 0),
		color: combineRgb(0, 0, 0),
	},
	blackOnGreen: {
		bgcolor: combineRgb(0, 204, 0),
		color: combineRgb(0, 0, 0),
	},
}

const type: CompanionInputFieldDropdown = {
	id: 'type',
	type: 'dropdown',
	label: 'Port',
	default: 'sdi',
	choices: [
		{ id: 'sdi', label: 'SDI' },
		{ id: 'sfp', label: 'SFP' },
	],
}

export function UpdateFeedbacks(self: AjaDante12GAM): void {
	const feedbacks: { [id in FeedbackId]: CompanionFeedbackDefinition | undefined } = {
		[FeedbackId.DanteChannels]: {
			name: 'Dante Channel Presence',
			type: 'boolean',
			defaultStyle: styles.blackOnGreen,
			options: [
				{
					id: 'ch_1_8',
					type: 'multidropdown',
					label: 'Channels 1 - 8',
					default: [1, 2],
					choices: [
						{ id: 1, label: 'Channel 1' },
						{ id: 2, label: 'Channel 2' },
						{ id: 3, label: 'Channel 3' },
						{ id: 4, label: 'Channel 4' },
						{ id: 5, label: 'Channel 5' },
						{ id: 6, label: 'Channel 6' },
						{ id: 7, label: 'Channel 7' },
						{ id: 8, label: 'Channel 8' },
					],
					minSelection: 0,
				},
				{
					id: 'ch_9_16',
					type: 'multidropdown',
					label: 'Channels 9 - 16',
					default: [],
					choices: [
						{ id: 9, label: 'Channel 9' },
						{ id: 10, label: 'Channel 10' },
						{ id: 11, label: 'Channel 11' },
						{ id: 12, label: 'Channel 12' },
						{ id: 13, label: 'Channel 13' },
						{ id: 14, label: 'Channel 14' },
						{ id: 15, label: 'Channel 15' },
						{ id: 16, label: 'Channel 16' },
					],
					minSelection: 0,
				},
				{
					id: 'ch_17_24',
					type: 'multidropdown',
					label: 'Channels 17 - 24',
					default: [],
					choices: [
						{ id: 17, label: 'Channel 17' },
						{ id: 18, label: 'Channel 18' },
						{ id: 19, label: 'Channel 19' },
						{ id: 20, label: 'Channel 20' },
						{ id: 21, label: 'Channel 21' },
						{ id: 22, label: 'Channel 22' },
						{ id: 23, label: 'Channel 23' },
						{ id: 24, label: 'Channel 24' },
					],
					minSelection: 0,
				},
				{
					id: 'ch_25_32',
					type: 'multidropdown',
					label: 'Channels 25 - 32',
					default: [],
					choices: [
						{ id: 25, label: 'Channel 25' },
						{ id: 26, label: 'Channel 26' },
						{ id: 27, label: 'Channel 27' },
						{ id: 28, label: 'Channel 28' },
						{ id: 29, label: 'Channel 29' },
						{ id: 30, label: 'Channel 30' },
						{ id: 31, label: 'Channel 31' },
						{ id: 32, label: 'Channel 32' },
					],
					minSelection: 0,
				},
				{
					id: 'info',
					type: 'static-text',
					label: '',
					value: 'Feedback checks for the presense of all selected channels',
				},
			],
			callback: (feedback, _context) => {
				const status = self.device.danteStatus
				let check = true
				check &&= new Set<number>(feedback.options['ch_1_8'] as number[]).isSubsetOf(status.channels_1_8)
				check &&= new Set<number>(feedback.options['ch_9_16'] as number[]).isSubsetOf(status.channels_9_16)
				check &&= new Set<number>(feedback.options['ch_17_24'] as number[]).isSubsetOf(status.channels_17_24)
				check &&= new Set<number>(feedback.options['ch_25_32'] as number[]).isSubsetOf(status.channels_25_32)
				return check
			},
		},
		[FeedbackId.EmbeddedAudio]: {
			name: 'Embedded Audio',
			type: 'boolean',
			defaultStyle: styles.blackOnGreen,
			options: [
				type,
				{
					id: 'io',
					type: 'dropdown',
					label: 'I/O',
					default: 'input',
					choices: [
						{ id: 'input', label: 'Input' },
						{ id: 'output', label: 'Output' },
					],
				},
				{
					id: 'groups',
					type: 'multidropdown',
					label: 'Embedded Groups',
					default: ['embeddedGroup1'],
					choices: [
						{ id: 'embeddedGroup1', label: 'Group 1' },
						{ id: 'embeddedGroup2', label: 'Group 2' },
						{ id: 'embeddedGroup3', label: 'Group 3' },
						{ id: 'embeddedGroup4', label: 'Group 4' },
					],
					minSelection: 1,
					tooltip: 'Feedback will check for the presense of the selected groups',
				},
			],
			callback: (feedback, _context) => {
				const status = feedback.options['type'] === 'sdi' ? self.device.sdiStatus : self.device.sfpStatus
				const groups = feedback.options['io'] === 'input' ? status.inputAudio : status.outputAudio
				let check = true
				if (Array.isArray(feedback.options['groups'])) {
					if (feedback.options['groups'].includes('embeddedGroup1')) check &&= groups.embeddedGroup1
					if (feedback.options['groups'].includes('embeddedGroup2')) check &&= groups.embeddedGroup2
					if (feedback.options['groups'].includes('embeddedGroup3')) check &&= groups.embeddedGroup3
					if (feedback.options['groups'].includes('embeddedGroup4')) check &&= groups.embeddedGroup4
				}
				return check
			},
		},
		[FeedbackId.InputLocked]: {
			name: 'Input Locked',
			type: 'boolean',
			defaultStyle: styles.blackOnGreen,
			options: [type],
			callback: (feedback, _context) => {
				return feedback.options['type'] === 'sdi'
					? self.device.sdiStatus.inputLocked
					: self.device.sfpStatus.inputLocked
			},
		},
	}
	self.setFeedbackDefinitions(feedbacks)
}
