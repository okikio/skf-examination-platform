FROM node:19-alpine as base

RUN apk add doas; \
    echo 'node:node' | chpasswd; \
    echo 'permit :wheel as root' > /etc/doas.d/doas.conf

USER root

RUN npm i -g pnpm

# WORKDIR /app
WORKDIR /home/node

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY packages/astro /home/node/packages/astro
COPY packages/shared /home/node/packages/shared
COPY node_modules /home/node/node_modules

COPY ./pnpm-lock.yaml ./
# RUN pnpm fetch

COPY . ./

# RUN mkdir /.config

# RUN chown -R node:wheel /home/node/node_modules
# RUN chown -R node:wheel /home/node/packages

#RUN pnpm recursive install --offline --frozen-lockfile
#RUN pnpm --filter=astro build

# Development Target
FROM base as dev
USER node
ENTRYPOINT ["tail", "-f", "/dev/null"]

# COPY --from=base /app/packages/astro /packages/astro
#EXPOSE 3000
#CMD [ "pnpm", "--filter=astro", "dev" ] 

# Production Target
FROM base as prod
USER node
ENTRYPOINT ["tail", "-f", "/dev/null"]

# COPY --from=base /app/packages/astro /packages/astro
#EXPOSE 3000
#CMD [ "pnpm", "--filter=astro", "start:server" ] 

# Prefer not to run as root.
# USER node