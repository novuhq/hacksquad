import * as mixpanel from 'mixpanel-browser';

export function initAnalytics() {
  mixpanel.init(process.env.NEXT_PUBLIC_ANALYTICS_ID);
}

export function trackAnalyticsEvent(eventName: string, eventProps?: any): void {
  mixpanel.track(eventName, eventProps);
}
