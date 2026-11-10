import { datadogRum } from "@datadog/browser-rum";
import { nextjsPlugin } from "@datadog/browser-rum-nextjs";

export { onRouterTransitionStart } from "@datadog/browser-rum-nextjs";

const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;

const isDev = process.env.NODE_ENV === "development";
const allowRumInDev = process.env.NEXT_PUBLIC_DATADOG_ENABLE_DEV === "true";
const shouldInitializeRum = !isDev || allowRumInDev;
// avoid Datadog in development mode. Enable it with NEXT_PUBLIC_DATADOG_ENABLE_DEV=true if needed.
const rumEnvironment =
  process.env.NEXT_PUBLIC_DATADOG_ENV ||
  (isDev ? "local-development" : "local-build");

if (shouldInitializeRum && applicationId && clientToken) {
  datadogRum.init({
    applicationId,
    clientToken,
    site: "datadoghq.eu",
    service: "web-performance-lab",
    env: rumEnvironment,
    version: process.env.NEXT_PUBLIC_DATADOG_VERSION || undefined,
    plugins: [nextjsPlugin()],
    trackingConsent: "not-granted",
    sessionSampleRate: 100,
    sessionReplaySampleRate: rumEnvironment === "production" ? 20 : 0,
    trackResources: true,
    trackUserInteractions: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask",
    enablePrivacyForActionName: true,
  });
}
