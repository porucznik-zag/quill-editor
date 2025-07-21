import {
  createPrayerTitleHandler,
  createPrayerHeaderHandler,
  createPrayerQuoteHandler,
} from "./prayerFormatHandlers";

import { createPrayerOpacityHandler } from "./prayerOpacityHandler";
import { createPrayerLineHandler } from "./prayerLineHandler";
import { createScrollHandler } from "./scrollHandler";

export const PrayerHandlers = {
  createTitleHandler: createPrayerTitleHandler,
  createHeaderHandler: createPrayerHeaderHandler,
  createQuoteHandler: createPrayerQuoteHandler,
  createOpacityHandler: createPrayerOpacityHandler,
  createLineHandler: createPrayerLineHandler,
  createScrollHandler: createScrollHandler,
};
