import * as amplitude from "@amplitude/analytics-browser";
import Hotjar from "@hotjar/browser";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const init = () => {
  if (process.env.NEXT_PUBLIC_TRACK_EVENTS !== "true") {
    return;
  }
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_TRACK_ID, undefined, {
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: true,
      fileDownloads: true,
    },
  });

  Hotjar.init(
    Number(process.env.NEXT_PUBLIC_HOTJAR_ID),
    Number(process.env.NEXT_PUBLIC_HOTJAR_VERSION),
    {
      debug: false,
    }
  );
};

export const setIdentity = (session) => {
  if (process.env.NEXT_PUBLIC_TRACK_EVENTS !== "true") {
    return;
  }
  amplitude.setUserId(session.user.email);
  Hotjar.identify(session.user.email);
};

export const pageview = (url) => {
  if (process.env.NEXT_PUBLIC_TRACK_EVENTS !== "true") {
    return;
  }
  if (!window) {
    console.error("no window found");
    return;
  }
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const trackEvent = (action, meta = {}) => {
  if (process.env.NEXT_PUBLIC_TRACK_EVENTS !== "true") {
    return;
  }
  window.gtag("event", action, {
    event_category: action,
    event_label: action,
    value: 1,
  });
  amplitude.track(action, meta);
};

export const trackRevenue = (productId, price, quantity) => {
  if (process.env.NEXT_PUBLIC_TRACK_EVENTS !== "true") {
    return;
  }
  const event = new amplitude.Revenue()
    .setProductId(productId)
    .setPrice(price)
    .setQuantity(quantity);

  amplitude.revenue(event);
};

export const trackPageView = async (url) => {
  if (process.env.NEXT_PUBLIC_TRACK_EVENTS !== "true") {
    return;
  }
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};
