import type { InstanceBase } from '@companion-module/base'
import type { ActionSchema } from './actions.js'
import type { ModuleConfig, ModuleSecrets } from './config.js'
import type { Dante12GAM } from './device.js'
import type { FeedbackSchema } from './feedbacks.js'
import type {
	BuildInfo,
	DanteStatus,
	Discover,
	EnvironmentStatus,
	NetDevice,
	SdiControl,
	SdiStatus,
	SfpControl,
	SfpStatus,
	Status,
	SystemConfig,
	SystemStatus,
} from './schemas.js'

type UnionToIntersection<TUnion> = (TUnion extends unknown ? (arg: TUnion) => void : never) extends (
	arg: infer TIntersection,
) => void
	? TIntersection
	: never

/** Collapses an intersection into a single object type, so editor hovers stay readable */
type Simplify<T> = { [K in keyof T]: T[K] } & {}

type Keys<T> = Extract<keyof T, string>
type ScalarKeys<T> = { [K in Keys<T>]: T[K] extends object ? never : K }[Keys<T>]
type ObjectKeys<T> = { [K in Keys<T>]: T[K] extends object ? K : never }[Keys<T>]

/** The variables a flat object contributes, named `prefix_key` */
export type FlatVariables<TPrefix extends string, TShape> = {
	[K in Keys<TShape> as `${TPrefix}_${K}`]: TShape[K]
}

/** The variables an object of nested objects contributes, named `prefix_key_subkey` */
type NestedVariables<TPrefix extends string, TShape> = UnionToIntersection<
	{ [K in Keys<TShape>]: FlatVariables<`${TPrefix}_${K}`, TShape[K]> }[Keys<TShape>]
>

/** The variables an object of mixed scalar and object values contributes, flattened one level */
export type OneLevelVariables<TPrefix extends string, TShape> = Simplify<
	FlatVariables<TPrefix, Pick<TShape, ScalarKeys<TShape>>> & NestedVariables<TPrefix, Pick<TShape, ObjectKeys<TShape>>>
>

/** The variables each entry of an array of flat objects contributes, named `prefix_index_key` */
export type IndexedVariables<TPrefix extends string, TShape> = {
	[K in Keys<TShape> as `${TPrefix}_${number}_${K}`]: TShape[K]
}

/** The variables each entry of an array of nested objects contributes, named `prefix_index_key_subkey` */
export type IndexedNestedVariables<TPrefix extends string, TShape> = UnionToIntersection<
	{
		[K in Keys<TShape>]: { [K2 in Keys<TShape[K]> as `${TPrefix}_${number}_${K}_${K2}`]: TShape[K][K2] }
	}[Keys<TShape>]
>

/** The Dante channel sets are exposed as comma separated lists */
export type DanteStatusVariables = { [K in Keys<DanteStatus> as `danteStatus_${K}`]: string }

/**
 * Every variable this module exposes, derived from the device schemas so that a schema change
 * shows up as a compile error here rather than as a missing variable at runtime.
 *
 * `discovers_*` and `netDevice_*` are keyed by an array index, so they are pattern index
 * signatures rather than named members.
 */
export type VariableSchema = Simplify<
	{ alarms: number } & FlatVariables<'buildInfo', BuildInfo> &
		FlatVariables<'status', Status> &
		FlatVariables<'systemStatus', SystemStatus> &
		FlatVariables<'systemConfig', SystemConfig> &
		FlatVariables<'sdiControl', SdiControl> &
		FlatVariables<'sfpControl', SfpControl> &
		DanteStatusVariables &
		FlatVariables<'environmentStatus', EnvironmentStatus> &
		OneLevelVariables<'sdiStatus', SdiStatus> &
		OneLevelVariables<'sfpStatus', SfpStatus> &
		IndexedVariables<'discovers', Discover> &
		IndexedNestedVariables<'netDevice', NetDevice>
>

export interface ModuleTypes {
	config: ModuleConfig
	secrets: ModuleSecrets
	actions: ActionSchema
	feedbacks: FeedbackSchema
	variables: VariableSchema
}

export interface InstanceBaseExt extends InstanceBase<ModuleTypes> {
	config: ModuleConfig
	device: Dante12GAM
}
