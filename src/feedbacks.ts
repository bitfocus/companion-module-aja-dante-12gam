import { CompanionFeedbackDefinitions } from '@companion-module/base'
import type { AjaDante12GAM } from './main.js'

export function UpdateFeedbacks(self: AjaDante12GAM): void {
	const feedbacks: CompanionFeedbackDefinitions = {}
	self.setFeedbackDefinitions(feedbacks)
}
