import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { StatusManager } from './status.js'
import { API_CALLS } from './enums.js'
import axios, { Axios, AxiosError, AxiosResponse } from 'axios'
import PQueue from 'p-queue'

const TIMEOUT = 2000
const API_PATH = '/v2'
const HEADERS = { 'Content-Type': 'application/json' }

export class AjaDante12GAM extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	#client!: Axios
	#controller = new AbortController()
	#queue = new PQueue({ concurrency: 1, interval: 30, intervalCap: 1 })
	private statusManager: StatusManager = new StatusManager(this)
	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.configUpdated(config).catch(() => {})
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
		this.#queue.clear()
		this.#controller.abort('Destroying connection')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		process.title = this.label
		if (this.config.bonjourHost) {
			this.config.host = config.bonjourHost?.split(':')[0]
			this.config.port = Number(config.bonjourHost?.split(':')[1])
		}
		if (this.config.host) {
			this.setupClient(this.config)
		} else {
			this.statusManager.updateStatus(InstanceStatus.BadConfig, `No host`)
		}
	}

	setupClient(config: ModuleConfig): Axios {
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
		const response = (await this.#queue.add(
			async () => {
				if (!this.#client) throw new Error('Client not initialized')
				await this.#client
					.get(path, {
						signal: this.#controller.signal,
					})
					.then((response) => {
						this.statusManager.updateStatus(InstanceStatus.Ok)
						return response
					})
					.catch((error) => {
						if (error instanceof AxiosError) {
							this.log('error', JSON.stringify(error))
							this.statusManager.updateStatus(InstanceStatus.ConnectionFailure, error.code)
						}
					})
			},
			{ priority: 1 },
		)) as Promise<AxiosResponse<any, any>> | void
		return response
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(AjaDante12GAM, UpgradeScripts)
