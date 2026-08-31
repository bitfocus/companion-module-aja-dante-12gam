import type {
	CompanionInputFieldDropdown,
	CompanionInputFieldMultiDropdown,
	DropdownChoice,
} from '@companion-module/base'

/**
 * Option helpers shared by actions and feedbacks, so that every dropdown offers exactly the
 * values its schema accepts, and the option types stay unions of literals rather than
 * widening to `string`/`number`.
 */

/** Builds dropdown choices from a schema's literal values, using each value as its own label. */
export function toChoices<T extends string>(values: readonly T[]): DropdownChoice<T>[] {
	return values.map((id) => ({ id, label: id }))
}

/** The port an action or feedback targets */
export const PortType = ['sdi', 'sfp'] as const
export type PortType = (typeof PortType)[number]

export const portOption: CompanionInputFieldDropdown<'type', PortType> = {
	id: 'type',
	type: 'dropdown',
	label: 'Port',
	default: 'sdi',
	choices: [
		{ id: 'sdi', label: 'SDI' },
		{ id: 'sfp', label: 'SFP' },
	],
}

/** Whether a feedback looks at the port's input or output */
export const AudioIo = ['input', 'output'] as const
export type AudioIo = (typeof AudioIo)[number]

export const audioIoOption: CompanionInputFieldDropdown<'io', AudioIo> = {
	id: 'io',
	type: 'dropdown',
	label: 'I/O',
	default: 'input',
	choices: [
		{ id: 'input', label: 'Input' },
		{ id: 'output', label: 'Output' },
	],
}

/** The Dante channel numbers each channel presence option field offers */
export const danteChannelGroups = {
	ch_1_8: [1, 2, 3, 4, 5, 6, 7, 8],
	ch_9_16: [9, 10, 11, 12, 13, 14, 15, 16],
	ch_17_24: [17, 18, 19, 20, 21, 22, 23, 24],
	ch_25_32: [25, 26, 27, 28, 29, 30, 31, 32],
} as const

export type DanteChannelGroup = keyof typeof danteChannelGroups

/** The channel numbers a single channel presence option field may hold */
export type DanteChannel<TGroup extends DanteChannelGroup> = (typeof danteChannelGroups)[TGroup][number]

export function danteChannelOption<TGroup extends DanteChannelGroup>(
	group: TGroup,
	label: string,
	defaults: DanteChannel<TGroup>[],
): CompanionInputFieldMultiDropdown<TGroup, DanteChannel<TGroup>> {
	const channels: readonly DanteChannel<TGroup>[] = danteChannelGroups[group]
	return {
		id: group,
		type: 'multidropdown',
		label,
		default: defaults,
		choices: channels.map((id) => ({ id, label: `Channel ${id}` })),
		minSelection: 0,
	}
}
