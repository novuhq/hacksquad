import * as mixpanel from 'mixpanel-browser';

export function initAnalytics() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ID) mixpanel.init(process.env.NEXT_PUBLIC_ANALYTICS_ID);
}

export function trackAnalyticsEvent(eventName: string, eventProps?: any): void {
  if (mixpanel.track) mixpanel.track(eventName, eventProps);
}
