export { ambassadorWeeklyRhythm, getAmbassadorDay } from "./weekly-rhythm";

export type { AmbassadorDayType, AmbassadorWeeklyDay } from "./weekly-rhythm";

export type {
  AmbassadorWeekDelivery,
  ThursdayClassroomPlan,
  ThursdayExperiencePlan,
} from "./week-delivery";

export { resolveAppliedLearningAssets } from "./week-delivery";

export { ambassadorWeek01Delivery } from "./week-01-delivery";

export {
  ambassadorWeeks02To08Delivery,
  getAmbassadorWeek02To08Delivery,
} from "./weeks-02-08-delivery";

export {
  ambassadorWeeks09To16Delivery,
  getAmbassadorWeek09To16Delivery,
} from "./weeks-09-16-delivery";

import type { AmbassadorWeekDelivery } from "./week-delivery";
import { ambassadorWeek01Delivery } from "./week-01-delivery";
import { ambassadorWeeks02To08Delivery } from "./weeks-02-08-delivery";
import { ambassadorWeeks09To16Delivery } from "./weeks-09-16-delivery";

export const ambassadorWeekDeliveries: AmbassadorWeekDelivery[] = [
  ambassadorWeek01Delivery,
  ...ambassadorWeeks02To08Delivery,
  ...ambassadorWeeks09To16Delivery,
];

export function getAmbassadorWeekDelivery(
  week: number,
): AmbassadorWeekDelivery | undefined {
  return ambassadorWeekDeliveries.find((delivery) => delivery.week === week);
}
