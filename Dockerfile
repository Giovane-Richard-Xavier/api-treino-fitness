FROM node:20-slim

RUN apt-get update && apt-get install -y openssl bash

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install -g @nestjs/cli

COPY . .

RUN chmod +x .docker/entrypoint.sh

ENTRYPOINT ["/home/node/app/.docker/entrypoint.sh"]