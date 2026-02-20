export const GA_TRACKING_ID = "G-VCE6VJN1FD";

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const triggerGAEvent = (
    action: string,
    category: string,
    label: string,
    serviceName: string = "my-food-test"
) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", action, {
            event_category: category,
            event_label: label,
            service_name: serviceName,
        });
    }
};
