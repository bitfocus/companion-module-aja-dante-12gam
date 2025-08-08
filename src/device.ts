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
	Alarm,
	InputAudio,
	InputVideo,
} from './schemas.js'

const audioGroup: InputAudio = {
	embeddedGroup1: false,
	embeddedGroup2: false,
	embeddedGroup3: false,
	embeddedGroup4: false,
}

const videoGroup: InputVideo = {
	bitDepth: '',
	colorimetry: '',
	colorspace: '',
	dataRate: '',
	eotf: '',
	format: '',
}

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
	#NetDevices: NetDevices = []
	#EnvironmentStatus: EnvironmentStatus
	#Alarms: Alarm = []

	constructor() {
		this.#BuildInfo = {
			buildType: '',
			date: '',
			qtVersion: '',
			repoident: '',
			serverVersion: '',
			time: '',
		}
		this.#Status = {
			licenseActive: false,
			serialNumber: '',
			systemDate: '',
			systemTime: '',
		}
		this.#SystemStatus = {
			mainbootVersion: '',
			runningVersion: '',
			safeboot: false,
			safebootVersion: '',
		}
		this.#SystemConfig = {
			authenticationEnable: false,
			checkLicenseRequest: false,
			domainName: '',
			factoryPreset: false,
			factoryReset: false,
			hostName: '',
			identify: false,
			reboot: false,
			shutdown: false,
			ssdpEnable: false,
			systemOrganizationName: '',
			updateRequest: false,
		}
		this.#EnvironmentStatus = {
			dieTemp: '',
			externalPowerPresent: false,
			fanSpeed1: 0,
			fanSpeed2: 0,
			poePresent: false,
			poeT2p: false,
		}
		this.#SdiControl = {
			channels_1_2: '',
			channels_3_4: '',
			channels_5_6: '',
			channels_7_8: '',
			channels_9_10: '',
			channels_11_12: '',
			channels_13_14: '',
			channels_15_16: '',
			enableInternalSignalGenerator: false,
			hancData: '',
			levelB: '',
			testPattern: '',
			videoFormat: '',
		}
		this.#SfpControl = {
			...structuredClone(this.#SdiControl),
			testTone: '',
		}
		this.#DanteStatus = {
			channels_1_8: new Set<number>(),
			channels_9_16: new Set<number>(),
			channels_17_24: new Set<number>(),
			channels_25_32: new Set<number>(),
		}
		this.#SdiStatus = {
			inputAudio: structuredClone(audioGroup),
			outputAudio: structuredClone(audioGroup),
			inputVideo: structuredClone(videoGroup),
			outputVideo: structuredClone(videoGroup),
			inputLevelB: '',
			inputLocked: false,
			outputTSGEnabled: false,
		}
		this.#SfpStatus = structuredClone(this.#SdiStatus)
	}

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

	public set discovers(discovers: Discovers) {
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

	public get alarms(): Alarm {
		return this.#Alarms
	}

	public set alarms(alarms: Alarm) {
		this.#Alarms = Alarm.parse(alarms)
	}
}
