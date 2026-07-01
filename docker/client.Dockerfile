FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY apps/client/ ./apps/client/

RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "dev:client", "--", "--host"]
