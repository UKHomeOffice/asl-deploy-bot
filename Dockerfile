FROM node:10-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci --production --no-optional --ignore-scripts
COPY . /app

ENV PATH="/app/bin:${PATH}"
