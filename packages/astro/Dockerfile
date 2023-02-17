FROM node:19-alpine as base

RUN npm i -g pnpm
WORKDIR /app

COPY ./pnpm-lock.yaml ./
#RUN pnpm fetch

COPY . ./

#RUN pnpm recursive install --offline --frozen-lockfile
#RUN pnpm --filter=astro build

# Development Target
FROM base as dev
ENTRYPOINT ["tail", "-f", "/dev/null"]

# COPY --from=base /app/packages/astro /packages/astro
#EXPOSE 3000
#CMD [ "pnpm", "--filter=astro", "dev" ] 

# Production Target
FROM base as prod
ENTRYPOINT ["tail", "-f", "/dev/null"]

# COPY --from=base /app/packages/astro /packages/astro
#EXPOSE 3000
#CMD [ "pnpm", "--filter=astro", "start:server" ] 

# Prefer not to run as root.
# USER node