FROM node:24-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
# Next.js intègre les variables publiques au build.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_DATADOG_APPLICATION_ID
ARG NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
ARG NEXT_PUBLIC_DATADOG_ENV
ARG NEXT_PUBLIC_DATADOG_VERSION
ARG DATADOG_UPLOAD_SOURCEMAPS=false
RUN npm run build

RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
RUN if [ "$DATADOG_UPLOAD_SOURCEMAPS" = "true" ]; then \
      npm install --global @datadog/datadog-ci@5.27.0; \
    fi
RUN --mount=type=secret,id=datadog_api_key \
    --mount=type=bind,from=dotgit,target=/app/.git \
    if [ "$DATADOG_UPLOAD_SOURCEMAPS" = "true" ]; then \
      test -s /run/secrets/datadog_api_key && \
      test -n "$NEXT_PUBLIC_DATADOG_VERSION" && \
      test -n "$(find .next/static -type f -name '*.js.map' -print -quit)" && \
      DATADOG_API_KEY="$(cat /run/secrets/datadog_api_key)" DD_SITE=datadoghq.eu \
      datadog-ci sourcemaps upload .next/static \
        --service web-performance-lab \
        --release-version "$NEXT_PUBLIC_DATADOG_VERSION" \
        --minified-path-prefix /_next/static; \
    fi
# Les maps sont des artefacts privés du build.
RUN find .next/static -type f -name '*.map' -delete

FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
# Create the cache directory (-d), with node as its owner (-o) and group (-g).
RUN install -d -o node -g node /app/.next/cache/images
USER node
EXPOSE 3000
CMD ["node", "server.js"]
