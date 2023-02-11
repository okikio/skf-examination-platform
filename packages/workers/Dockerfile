FROM denoland/deno:alpine

ENV SHELL=/bin/sh
ENV RUN_COMMAND="deno task deployment"

ENTRYPOINT ["/bin/sh", "-c"]

WORKDIR /app

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY packages/workers /app/packages/workers
COPY packages/shared /app/packages/shared

# Prefer not to run as root.
USER deno

# RUN cd /app/packages/workers && ${RUN_COMMAND}