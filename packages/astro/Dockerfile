FROM node:19-alpine AS base

# ENV SHELL=/usr/bin/bash
RUN npm i pnpm -g

# WORKDIR /app
# COPY pnpm-lock.yaml ./
COPY package.json ./
# RUN pnpm fetch 
RUN pnpm i 
# ADD . .
COPY . .
# RUN pnpm install -r --offline 