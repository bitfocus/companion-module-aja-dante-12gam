/**
 * `Object.keys`/`Object.entries` widen keys to `string`, which loses the variable names the
 * schema is built from. These keep them.
 */

export function keysOf<T extends object>(obj: T): Extract<keyof T, string>[] {
	return Object.keys(obj) as Extract<keyof T, string>[]
}

export function entriesOf<T extends object>(
	obj: T,
): { [K in Extract<keyof T, string>]: [K, T[K]] }[Extract<keyof T, string>][] {
	return Object.entries(obj) as { [K in Extract<keyof T, string>]: [K, T[K]] }[Extract<keyof T, string>][]
}

/**
 * Marks a branch the type system believes is unreachable, and supplies the value to use if it
 * is reached anyway. Leaving a union member unhandled above becomes a compile error here.
 *
 * It falls back rather than throwing: option values are restored from a saved configuration, so
 * one that this version no longer offers is still possible at runtime.
 */
export function unhandledOption<TFallback>(_value: never, fallback: TFallback): TFallback {
	return fallback
}
