import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpdateVariableValues } from './values.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { StatusManager } from './status.js'
import { API_CALLS } from './enums.js'
import { Dante12GAM } from './device.js'
import axios, { Axios, AxiosError, AxiosResponse } from 'axios'
import PQueue from 'p-queue'
import { ZodError } from 'zod'
import { SdiControl, SfpControl } from './schemas.js'

const TIMEOUT = 2000
const API_PATH = '/v2'
const HEADERS = { 'Content-Type': 'application/json' }

export class AjaDante12GAM extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	#client!: Axios
	#controller = new AbortController()
	#queue = new PQueue({ concurrency: 4, interval: 200, intervalCap: 8 })
	#pollTimer: NodeJS.Timeout | undefined
	#device = new Dante12GAM()
	public statusManager: StatusManager = new StatusManager(this)
	constructor(internal: unknown) {
		super(internal)
	}

	public async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.#device.on('updateVariables', () => this.updateVariableDefinitions())
		this.configUpdated(config).catch(() => {})
	}
	// When module gets deleted
	public async destroy(): Promise<void> {
		this.log('debug', `destroy ${this.id}`)
		if (this.#pollTimer) {
			clearTimeout(this.#pollTimer)
			this.#pollTimer = undefined
		}
		this.#queue.clear()
		this.#controller.abort('Destroying connection')
		this.statusManager.destroy()
	}

	public async configUpdated(config: ModuleConfig): Promise<void> {
		const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

		this.config = config
		process.title = this.label
		if (this.#pollTimer) {
			clearTimeout(this.#pollTimer)
			this.#pollTimer = undefined
		}
		if (this.config.bonjourHost) {
			const [ip, rawPort] = this.config.bonjourHost.split(':')
			const port = Number(rawPort)
			if (ip.match(ipRegex) && !isNaN(port)) {
				this.config.host = ip
				this.config.port = port
			}
		}
		if (this.config.host) {
			this.setupClient(this.config)
			this.setupPolling()
		} else {
			this.statusManager.updateStatus(InstanceStatus.BadConfig, `No host`)
		}
	}

	private setupClient(config: ModuleConfig): Axios {
		this.#queue.clear()
		if (this.#client) {
			this.#controller.abort('Setting up new client')
		}
		return (this.#client = axios.create({
			baseURL: `http://${config.host}:${config.port}${API_PATH}`,
			timeout: TIMEOUT,
			headers: HEADERS,
		}))
	}

	async clientGet(path: API_CALLS): Promise<AxiosResponse<any, any> | void> {
		return await this.#queue.add(
			async () => {
				return await this.#client
					.get(path)
					.then((response) => {
						this.statusManager.updateStatus(InstanceStatus.Ok)
						if (this.config.verbose) {
							this.log('debug', `Response from API call to ${path}:\n${JSON.stringify(response.data)}`)
						}
						return response
					})
					.catch((error) => this.handleError(error))
			},
			{ priority: 1 },
		)
	}

	async clientPut(
		path: API_CALLS.ControlSdi | API_CALLS.ControlSfp,
		data: SdiControl | SfpControl,
	): Promise<AxiosResponse<any, any> | void> {
		return await this.#queue.add(
			async () => {
				return await this.#client
					.put(path, data)
					.then((response) => {
						this.statusManager.updateStatus(InstanceStatus.Ok)
						if (this.config.verbose) {
							this.log('debug', `Response from API call to ${path}:\n${JSON.stringify(response.data)}`)
						}
						return response
					})
					.catch((error) => this.handleError(error))
			},
			{ priority: 2 },
		)
	}

	//eslint-disable-next-line
	public handleError(err: any): void {
		if (err instanceof AxiosError) {
			this.statusManager.updateStatus(InstanceStatus.ConnectionFailure, err.code)
			if (this.config.verbose) {
				this.log('error', JSON.stringify(err))
			} else {
				this.log('error', err.code ?? err.message)
			}
		} else if (err instanceof ZodError) {
			this.statusManager.updateStatus(InstanceStatus.UnknownWarning, err.issues[0].message)
			if (this.config.verbose) {
				this.log('warn', JSON.stringify(err))
			} else {
				this.log('warn', err.issues[0].message)
			}
		} else {
			this.statusManager.updateStatus(InstanceStatus.UnknownError)
			this.log('debug', `Unknown error: ${err.toString()}`)
		}
	}

	private setupPolling(): void {
		this.#pollTimer = setTimeout(() => {
			this.pollDevice().catch(() => {})
			this.setupPolling()
		}, this.config.pollInterval)
	}

	async pollDevice(): Promise<void> {
		if (this.#queue.size < 20) {
			try {
				const response = await this.clientGet(API_CALLS.StatusSystem)
				if (response && response.data) {
					this.#device.systemStatus = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.Status)
				if (response && response.data) {
					this.#device.status = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.BuildInfo)
				if (response && response.data) {
					this.#device.buildInfo = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.Alarm)
				if (response && response.data) {
					this.#device.alarms = response.data
					if (this.#device.alarms.length > 0) this.log('warn', JSON.stringify(this.#device.alarms))
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.Config)
				if (response && response.data) {
					this.#device.systemConfig = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.ControlSdi)
				if (response && response.data) {
					this.#device.sdiControl = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.ControlSfp)
				if (response && response.data) {
					this.#device.sfpControl = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.StatusSdi)
				if (response && response.data) {
					this.#device.sdiStatus = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.StatusSfp)
				if (response && response.data) {
					this.#device.sfpStatus = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.StatusDante)
				if (response && response.data) {
					this.#device.danteStatus = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.StatusEnvironment)
				if (response && response.data) {
					this.#device.environmentStatus = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.Discovers)
				if (response && response.data) {
					this.#device.discovers = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			try {
				const response = await this.clientGet(API_CALLS.Devices)
				if (response && response.data) {
					this.#device.netDevices = response.data
				}
			} catch (err) {
				this.handleError(err)
			}
			this.checkFeedbacks()
			this.updateVariableValues()
		}
	}

	// Return config fields for web config
	public getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	get device(): Dante12GAM {
		return this.#device
	}

	private updateActions(): void {
		UpdateActions(this, this.device)
	}

	private updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	private updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this, this.device)
	}

	private updateVariableValues(): void {
		UpdateVariableValues(this, this.device)
	}
}

runEntrypoint(AjaDante12GAM, UpgradeScripts)
