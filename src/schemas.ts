import { z } from 'zod'

export const Channel = ['Pass', 'Embed']
export const TestPattern = ['Black', '100 % Bars', 'Grey']
export const VideoFormat = ['720p50', '720p59.94', '1080i50', '1080i59.94']
export const LevelB = ['Stream A', 'Stream B']
export const HancData = ['Delete', 'Pass']
export const IpConfig = ['Static', 'DHCP']

const stringToNumberSetSchema = z.string().transform((val) => {
	const elements = val.split(',').map((item) => item.trim())
	const filteredElements = elements.map((item) => Number.parseInt(item)).filter((item) => !Number.isNaN(item))
	return new Set(filteredElements)
})

export const Discover = z.object({
	boardID: z.string(),
	boardNumber: z.string(),
	boardType: z.string(),
	description: z.string(),
	deviceName: z.string(),
	hostName: z.string(),
	ipAddress: z.ipv4(),
	port: z.int().min(1).max(65535),
	serviceDescription: z.string(),
	serviceDomain: z.string(),
	serviceType: z.string(),
})

export type Discover = z.infer<typeof Discover>

export const Discovers = z.array(Discover)

export type Discovers = z.infer<typeof Discovers>

export const BuildInfo = z.object({
	buildType: z.string(),
	date: z.iso.date(),
	qtVersion: z.string(),
	repoident: z.string(),
	serverVersion: z.string(),
	time: z.iso.time(),
})

export type BuildInfo = z.infer<typeof BuildInfo>

export const Status = z.object({
	licenseActive: z.boolean(),
	serialNumber: z.string(),
	systemDate: z.string(),
	systemTime: z.iso.time(),
})

export type Status = z.infer<typeof Status>

export const SystemConfig = z.object({
	authenticationEnable: z.boolean(),
	checkLicenseRequest: z.boolean(),
	domainName: z.string(),
	factoryPreset: z.boolean(),
	factoryReset: z.boolean(),
	hostName: z.string(),
	identify: z.boolean(),
	reboot: z.boolean(),
	shutdown: z.boolean(),
	ssdpEnable: z.boolean(),
	systemOrganizationName: z.string(),
	updateRequest: z.boolean(),
})

export type SystemConfig = z.infer<typeof SystemConfig>

export const SdiControl = z.object({
	channels_11_12: z.enum(Channel),
	channels_13_14: z.enum(Channel),
	channels_15_16: z.enum(Channel),
	channels_1_2: z.enum(Channel),
	channels_3_4: z.enum(Channel),
	channels_5_6: z.enum(Channel),
	channels_7_8: z.enum(Channel),
	channels_9_10: z.enum(Channel),
	enableInternalSignalGenerator: z.boolean(),
	hancData: z.enum(HancData),
	levelB: z.enum(LevelB),
	testPattern: z.enum(TestPattern),
	videoFormat: z.enum(VideoFormat),
})

export type SdiControl = z.infer<typeof SdiControl>

export const SfpControl = z.object({
	...SdiControl.shape,
	testTone: z.string(),
})

export type SfpControl = z.infer<typeof SfpControl>

export const SystemStatus = z.object({
	mainbootVersion: z.string(),
	runningVersion: z.string(),
	safeboot: z.boolean(),
	safebootVersion: z.string(),
})

export type SystemStatus = z.infer<typeof SystemStatus>

export const Alarm = z.array(z.any())

export type Alarm = z.infer<typeof Alarm>

export const InputAudio = z.object({
	embeddedGroup1: z.boolean(),
	embeddedGroup2: z.boolean(),
	embeddedGroup3: z.boolean(),
	embeddedGroup4: z.boolean(),
})

export type InputAudio = z.infer<typeof InputAudio>

export const InputVideo = z.object({
	bitDepth: z.string(),
	colorimetry: z.string(),
	colorspace: z.string(),
	dataRate: z.string(),
	eotf: z.string(),
	format: z.string(),
})

export type InputVideo = z.infer<typeof InputVideo>

export const OutputAudio = InputAudio

export type OutputAudio = z.infer<typeof OutputAudio>

export const OutputVideo = InputVideo

export type OutputVideo = z.infer<typeof OutputVideo>

export const SdiStatus = z.object({
	inputAudio: InputAudio,
	outputAudio: OutputAudio,
	inputVideo: InputVideo,
	outputVideo: OutputVideo,
	inputLevelB: z.string(),
	inputLocked: z.boolean(),
	outputTSGEnabled: z.boolean(),
})

export type SdiStatus = z.infer<typeof SdiStatus>

export const SfpStatus = SdiStatus

export type SfpStatus = z.infer<typeof SfpStatus>

export const DanteStatus = z.object({
	channels_17_24: stringToNumberSetSchema,
	channels_1_8: stringToNumberSetSchema,
	channels_25_32: stringToNumberSetSchema,
	channels_9_16: stringToNumberSetSchema,
})

export type DanteStatus = z.infer<typeof DanteStatus>

export const NetDeviceActiveParams = z.object({
	address: z.ipv4(),
	dnsSearch: z.string(),
	dnsServer1: z.union([z.literal(''), z.ipv4()]),
	dnsServer2: z.union([z.literal(''), z.ipv4()]),
	gateway: z.union([z.literal(''), z.ipv4()]),
	speed: z.string(),
	subnet: z.union([z.literal(''), z.ipv4()]),
})

export type NetDeviceActiveParams = z.infer<typeof NetDeviceActiveParams>

export const NetDeviceStagedParams = NetDeviceActiveParams

export type NetDeviceStagedParams = z.infer<typeof NetDeviceStagedParams>

export const NetDeviceConfig = z.object({
	enable: z.boolean(),
	ipChangeCommit: z.int().min(0),
	ipConfig: z.enum(IpConfig),
	pingAddress: z.union([z.literal(''), z.ipv4()]),
	pingEnable: z.boolean(),
	resetBadPacketCount: z.boolean(),
})

export type NetDeviceConfig = z.infer<typeof NetDeviceConfig>

export const NetDeviceStatus = z.object({
	connected: z.boolean(),
	dhcpState: z.string(),
	interfaceSetupState: z.string(),
	ipAddressOffered: z.ipv4(),
	linkErrors: z.int().min(0),
	linkState: z.string(),
	lldpChassisId: z.string(),
	lldpName: z.string(),
	lldpPortId: z.string(),
	mac: z.string(),
	name: z.string(),
	pingOutput: z.string(),
})

export type NetDeviceStatus = z.infer<typeof NetDeviceStatus>

export const NetDevice = z.object({
	activeParams: NetDeviceActiveParams,
	config: NetDeviceConfig,
	stagedParams: NetDeviceStagedParams,
	status: NetDeviceStatus,
})

export type NetDevice = z.infer<typeof NetDevice>

export const NetDevices = z.array(NetDevice)

export type NetDevices = z.infer<typeof NetDevices>

export const EnvironmentStatus = z.object({
	dieTemp: z.string(),
	externalPowerPresent: z.boolean(),
	fanSpeed1: z.int().min(0),
	fanSpeed2: z.int().min(0),
	poePresent: z.boolean(),
	poeT2p: z.boolean(),
})

export type EnvironmentStatus = z.infer<typeof EnvironmentStatus>
