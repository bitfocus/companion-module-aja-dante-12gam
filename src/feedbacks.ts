import { combineRgb, type CompanionFeedbackDefinitions, type DropdownChoice } from '@companion-module/base'
import type AjaDante12GAM from './main.js'
import { InputAudio, type SdiStatus } from './schemas.js'
import {
	audioIoOption,
	danteChannelOption,
	describeArrayValues,
	portOption,
	type AudioIo,
	type DanteChannel,
	type DanteChannelGroup,
	type PortType,
} from './options.js'
import { keysOf, unhandledOption } from './util.js'

export enum FeedbackId {
	DanteChannels = 'dante_channels',
	EmbeddedAudio = 'embedded_audio',
	InputLocked = 'input_locked',
}

/** The embedded audio groups reported by the SDI/SFP status */
export type EmbeddedGroup = keyof InputAudio

const embeddedGroups = keysOf(InputAudio.shape)

const embeddedGroupChoices: DropdownChoice<EmbeddedGroup>[] = embeddedGroups.map((id, index) => ({
	id,
	label: `Group ${index + 1}`,
}))

export type FeedbackSchema = {
	[FeedbackId.DanteChannels]: {
		type: 'boolean'
		// Each field only ever holds the channel numbers its own dropdown offers
		options: {
			[TGroup in DanteChannelGroup]: DanteChannel<TGroup>[]
		}
	}
	[FeedbackId.EmbeddedAudio]: {
		type: 'boolean'
		options: {
			type: PortType
			io: AudioIo
			groups: EmbeddedGroup[]
		}
	}
	[FeedbackId.InputLocked]: {
		type: 'boolean'
		options: {
			type: PortType
		}
	}
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

/** The status the device last reported for the selected port */
function statusForPort(self: AjaDante12GAM, port: PortType): SdiStatus {
	switch (port) {
		case 'sdi':
			return self.device.sdiStatus
		case 'sfp':
			return self.device.sfpStatus
		default:
			return unhandledOption(port, self.device.sdiStatus)
	}
}

/** The embedded audio groups for the selected direction */
function audioForIo(status: SdiStatus, io: AudioIo): InputAudio {
	switch (io) {
		case 'input':
			return status.inputAudio
		case 'output':
			return status.outputAudio
		default:
			return unhandledOption(io, status.inputAudio)
	}
}

export function UpdateFeedbacks(self: AjaDante12GAM): void {
	const feedbacks: CompanionFeedbackDefinitions<FeedbackSchema> = {
		[FeedbackId.DanteChannels]: {
			name: 'Dante Channel Presence',
			type: 'boolean',
			defaultStyle: styles.blackOnGreen,
			options: [
				danteChannelOption('ch_1_8', 'Channels 1 - 8', [1, 2]),
				danteChannelOption('ch_9_16', 'Channels 9 - 16', []),
				danteChannelOption('ch_17_24', 'Channels 17 - 24', []),
				danteChannelOption('ch_25_32', 'Channels 25 - 32', []),
				{
					id: 'info',
					type: 'static-text',
					label: '',
					value: 'Feedback checks for the presense of all selected channels',
				},
			],
			callback: ({ options }) => {
				const status = self.device.danteStatus
				let check = new Set(options.ch_1_8).isSubsetOf(status.channels_1_8)
				check &&= new Set(options.ch_9_16).isSubsetOf(status.channels_9_16)
				check &&= new Set(options.ch_17_24).isSubsetOf(status.channels_17_24)
				check &&= new Set(options.ch_25_32).isSubsetOf(status.channels_25_32)
				return check
			},
		},
		[FeedbackId.EmbeddedAudio]: {
			name: 'Embedded Audio',
			type: 'boolean',
			defaultStyle: styles.blackOnGreen,
			options: [
				portOption,
				audioIoOption,
				{
					id: 'groups',
					type: 'multidropdown',
					label: 'Embedded Groups',
					default: ['embeddedGroup1'],
					choices: embeddedGroupChoices,
					minSelection: 1,
					tooltip: 'Feedback will check for the presense of the selected groups',
					expressionDescription: describeArrayValues(embeddedGroups),
				},
			],
			callback: ({ options }) => {
				const groups = audioForIo(statusForPort(self, options.type), options.io)
				if (!Array.isArray(options.groups)) return true
				return options.groups.every((group) => groups[group] === true)
			},
		},
		[FeedbackId.InputLocked]: {
			name: 'Input Locked',
			type: 'boolean',
			defaultStyle: styles.blackOnGreen,
			options: [portOption],
			callback: ({ options }) => {
				return statusForPort(self, options.type).inputLocked
			},
		},
	}
	self.setFeedbackDefinitions(feedbacks)
}
