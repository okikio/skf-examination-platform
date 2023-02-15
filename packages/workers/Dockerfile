FROM denoland/deno:alpine as base

ENV SHELL=/bin/sh

ENTRYPOINT ["/bin/sh", "-c"]

WORKDIR /app

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY packages/workers /app/packages/workers
COPY packages/shared /app/packages/shared

RUN cd /app/packages/workers && \
    deno task hello && \
    deno cache ./kubernetes.ts

FROM base as prod
WORKDIR /app/packages/workers
CMD ["deno", "task", "kubernetes"]

FROM base as debug
WORKDIR /app/packages/workers
CMD ["deno", "task", "deployment"]

# Prefer not to run as root.
USER deno