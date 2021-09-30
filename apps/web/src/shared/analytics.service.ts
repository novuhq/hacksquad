export function trackAnalyticsEvent(eventName: string, eventProps?: any): void {
  event({ action: eventName, params: eventProps });
}

export const pageview = (url) => {
  if ((window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    });
  }
};

export const event = ({ action, params }) => {
  if ((window as any).gtag) {
    (window as any).gtag('event', action, params);
  }
};
