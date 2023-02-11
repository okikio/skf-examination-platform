FROM node:19-alpine

ENV SHELL=/bin/sh
ENV RUN_COMMAND="pnpm build && pnpm start:server"
EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c"]

RUN npm i -g pnpm
WORKDIR /app

COPY ./pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./
RUN pnpm recursive install --offline --frozen-lockfile
CMD ["node"]

# Prefer not to run as root.
USER node

RUN cd packages/astro/ && \
    ${RUN_COMMAND}