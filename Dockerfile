FROM node:24-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
# Next.js intègre cet identifiant public pendant le build, pas au démarrage.
ARG NEXT_PUBLIC_GTM_ID
RUN npm run build

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
