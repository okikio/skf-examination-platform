#!/usr/bin/env bash
docker run -d -p 5000:5000 --restart=always --name registry registry:2

docker tag workers:latest localhost:5000/workers:latest
docker tag astro:latest localhost:5000/astro:latest


docker push localhost:5000/astro:latest
docker push localhost:5000/workers:latest