import { InstanceStatus, createModuleLogger } from '@companion-module/base'
import type AjaDante12GAM from './main.js'
import { throttle, type ThrottledFunction } from 'es-toolkit'

export interface Status {
	status: InstanceStatus
	message: string | object | null
}

/**
 * Status Manager Utility
 * Only calls update Status if status has actually changed, with a configurable debounce
 * @param self Module instance from which to call updateStatus
 * @param initStatus Status to be set on init
 * @param throttleTimeout Throttle duration to limit status update rate
 *
 */

export class StatusManager {
	#currentStatus: Status = { status: InstanceStatus.Disconnected, message: '' }
	#newStatus: Status = { status: InstanceStatus.Disconnected, message: '' }
	#parentInstance!: AjaDante12GAM
	#throttleTimeout: number = 2000
	#isDestroyed: boolean = false
	#logger = createModuleLogger('Status Manager')
	private setNewStatus!: ThrottledFunction<(newStatus?: Status) => void>

	constructor(
		self: AjaDante12GAM,
		initStatus: Status = { status: InstanceStatus.Disconnected, message: null },
		throttleTimeout: number = 2000,
	) {
		this.#parentInstance = self
		this.#throttleTimeout = throttleTimeout

		/**
		 * Perform the status update
		 * @param newStatus
		 *
		 */

		this.setNewStatus = throttle(
			(newStatus: Status = this.#newStatus) => {
				if (typeof newStatus.message === 'object' && newStatus.message !== null) {
					this.#parentInstance.updateStatus(newStatus.status, JSON.stringify(newStatus.message))
				} else {
					this.#parentInstance.updateStatus(newStatus.status, newStatus.message)
				}
				this.#currentStatus = newStatus
			},
			this.#throttleTimeout,
			{ edges: ['leading', 'trailing'] },
		)

		this.setNewStatus(initStatus)
	}

	/**
	 * @returns Current status
	 *
	 */

	public get status(): Status {
		return this.#currentStatus
	}

	public get isDestroyed(): boolean {
		return this.#isDestroyed
	}

	/**
	 * Updates status if changed after debounce interval
	 * @param newStatus Status & Message
	 *
	 */

	public updateStatus(newStatus: InstanceStatus, newMsg: string | object | null = null): void {
		if (this.#isDestroyed) {
			this.#logger.warn(
				`Module destroyed. Can't update status\n${newStatus}: ${typeof newMsg == 'object' ? JSON.stringify(newMsg) : newMsg}`,
			)
			return
		}
		if (this.#currentStatus.status === newStatus && this.#currentStatus.message === newMsg) return
		this.#newStatus = { status: newStatus, message: newMsg }
		this.setNewStatus(this.#newStatus)
	}

	/**
	 * Clears any running debounce timer, sets status to disconnected
	 *
	 */

	public destroy(): void {
		this.setNewStatus.flush()
		this.setNewStatus({ status: InstanceStatus.Disconnected, message: 'Destroyed' })
		this.#isDestroyed = true
	}
}
