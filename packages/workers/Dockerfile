FROM denoland/deno:alpine as base

RUN apk add doas; \
    adduser foobar -G wheel; \
    echo 'foobar:foobar' | chpasswd; \
    echo 'permit :wheel as root' > /etc/doas.d/doas.conf

USER foobar

WORKDIR /home/foobar

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY packages/workers /home/foobar/packages/workers
COPY packages/shared /home/foobar/packages/shared
COPY node_modules /home/foobar/node_modules

RUN chown -R foobar:wheel /home/foobar/node_modules
RUN chown -R foobar:wheel /home/foobar/packages/shared
RUN chown -R foobar:wheel /home/foobar/packages/workers

#RUN cd /app/packages/workers && \
#    deno task hello && \
#    deno cache ./kubernetes.ts

# VOLUME [ "/data" ]
#USER 1001:1001

FROM base as prod
USER foobar
ENTRYPOINT ["tail", "-f", "/dev/null"]

#WORKDIR /app/packages/workers
#CMD ["deno", "task", "kubernetes"]

FROM base as debug
USER foobar
ENTRYPOINT ["tail", "-f", "/dev/null"]

#WORKDIR /app/packages/workers
#CMD ["/bin/bash", "top"]
#CMD ["deno", "task", "deployment"]

# Prefer not to run as root.
#USER deno