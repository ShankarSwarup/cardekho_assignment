FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY packages/ ./packages/
COPY apps/server/ ./apps/server/

RUN npm ci
RUN npm run build --workspace=@automatch/types
RUN npm run build --workspace=@automatch/utils
RUN npm run build --workspace=@automatch/server

FROM node:22-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/packages ./packages
COPY --from=builder /usr/src/app/apps/server/dist ./apps/server/dist
COPY --from=builder /usr/src/app/apps/server/package.json ./apps/server/package.json

ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "run", "start", "--workspace=@automatch/server"]
