import { datadogRum } from "@datadog/browser-rum";
import { nextjsPlugin } from "@datadog/browser-rum-nextjs";

export { onRouterTransitionStart } from "@datadog/browser-rum-nextjs";

const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;

if (applicationId && clientToken) {
  datadogRum.init({
    applicationId,
    clientToken,
    site: "datadoghq.eu",
    service: "web-performance-lab",
    env: process.env.NEXT_PUBLIC_DATADOG_ENV || "local",
    plugins: [nextjsPlugin()],
    trackingConsent: "not-granted",
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    trackResources: true,
    trackUserInteractions: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask",
    enablePrivacyForActionName: true,
  });
}
