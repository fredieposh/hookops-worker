FROM node:22-alpine AS builder
WORKDIR /app

COPY hookops-shared/ /hookops-shared

COPY hookops-worker/package*.json ./
RUN npm ci

COPY hookops-worker/tsconfig.json ./
COPY hookops-worker/src/ src/
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR app

COPY --from=builder app/dist ./dist
COPY --from=builder app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

CMD ["node", "dist/main.js"]