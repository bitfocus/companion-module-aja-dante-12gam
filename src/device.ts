import {
	Discovers,
	BuildInfo,
	Status,
	SystemConfig,
	SdiControl,
	SfpControl,
	SystemStatus,
	SdiStatus,
	DanteStatus,
	NetDevices,
	EnvironmentStatus,
	SfpStatus,
} from './schemas.js'

export class Dante12GAM {
	#Discovers: Discovers = []
	#BuildInfo: BuildInfo
	#Status: Status
	#SystemStatus: SystemStatus
	#SystemConfig: SystemConfig
	#SdiControl: SdiControl
	#SdiStatus: SdiStatus
	#SfpControl: SfpControl
	#SfpStatus: SdiStatus
	#DanteStatus: DanteStatus
	#NetDevices: NetDevices
	#EnvironmentStatus: EnvironmentStatus

	constructor() {}

	public get status(): Status {
		return this.#Status
	}

	public set status(status: Status) {
		this.#Status = Status.parse(status)
	}

	public get buildInfo(): BuildInfo {
		return this.#BuildInfo
	}

	public set buildInfo(info: BuildInfo) {
		this.#BuildInfo = BuildInfo.parse(info)
	}

	public get systemStatus(): SystemStatus {
		return this.#SystemStatus
	}

	public set systemStatus(status: SystemStatus) {
		this.#SystemStatus = SystemStatus.parse(status)
	}

	public get discovers(): Discovers {
		return this.#Discovers
	}

	public set disovers(discovers: Discovers) {
		this.#Discovers = Discovers.parse(discovers)
	}

	public get systemConfig(): SystemConfig {
		return this.#SystemConfig
	}

	public set systemConfig(config: SystemConfig) {
		this.#SystemConfig = SystemConfig.parse(config)
	}

	public get sdiControl(): SdiControl {
		return this.#SdiControl
	}

	public set sdiControl(sdiControl: SdiControl) {
		this.#SdiControl = SdiControl.parse(sdiControl)
	}

	public get sdiStatus(): SdiStatus {
		return this.#SdiStatus
	}

	public set sdiStatus(sdiStatus: SdiStatus) {
		this.#SdiStatus = SdiStatus.parse(sdiStatus)
	}

	public get sfpControl(): SfpControl {
		return this.#SfpControl
	}

	public set sfpControl(sfpControl: SfpControl) {
		this.#SfpControl = SfpControl.parse(sfpControl)
	}

	public get sfpStatus(): SfpStatus {
		return this.#SfpStatus
	}

	public set sfpStatus(sfpStatus: SfpStatus) {
		this.#SfpStatus = SfpStatus.parse(sfpStatus)
	}

	public get danteStatus(): DanteStatus {
		return this.#DanteStatus
	}

	public set danteStatus(danteStatus: DanteStatus) {
		this.#DanteStatus = DanteStatus.parse(danteStatus)
	}

	public get netDevices(): NetDevices {
		return this.#NetDevices
	}

	public set netDevices(netDevices: NetDevices) {
		this.#NetDevices = NetDevices.parse(netDevices)
	}

	public get environmentStatus(): EnvironmentStatus {
		return this.#EnvironmentStatus
	}

	public set environmentStatus(envStatus: EnvironmentStatus) {
		this.#EnvironmentStatus = EnvironmentStatus.parse(envStatus)
	}
}
