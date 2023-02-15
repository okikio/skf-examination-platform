FROM node:19-alpine as base

ENV SHELL=/bin/sh
EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c"]
RUN npm i -g pnpm
WORKDIR /app

COPY ./pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./
RUN pnpm recursive install --offline --frozen-lockfile
CMD ["node"]

# Production Target
FROM base as prod
RUN pnpm --filter=astro build
CMD [ "pnpm", "--filter=astro", "start:server" ] 

# Development Target
FROM base as dev
CMD [ "pnpm", "--filter=astro", "dev" ] 

# Prefer not to run as root.
# USER node