FROM denoland/deno:alpine as base

RUN apk add doas; \
    echo 'deno:deno' | chpasswd; \
    echo 'permit :wheel as root' > /etc/doas.d/doas.conf

USER root

WORKDIR /home/deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY packages/workers /home/deno/packages/workers
COPY packages/shared /home/deno/packages/shared
COPY node_modules /home/deno/node_modules

RUN chown -R deno:wheel /home/deno/node_modules
RUN chown -R deno:wheel /home/deno/packages

#RUN cd /app/packages/workers && \
#    deno task hello && \
#    deno cache ./kubernetes.ts

# VOLUME [ "/data" ]
#USER 1001:1001

FROM base as prod
USER deno
CMD ["deno", "task", "kubernetes"]
ENTRYPOINT ["tail", "-f", "/dev/null"]

#WORKDIR /app/packages/workers

FROM base as debug
USER deno
CMD ["deno", "task", "deployment"]
ENTRYPOINT ["tail", "-f", "/dev/null"]

#WORKDIR /app/packages/workers
#CMD ["/bin/bash", "top"]

# Prefer not to run as root.
#USER deno