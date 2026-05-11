FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server.ts tsconfig.json ./
COPY shared ./shared
COPY src ./src

RUN npm run build
RUN npm prune --omit=dev

FROM node:20-alpine

# Instalar Docker CLI
RUN apk add --no-cache docker-cli

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["npm", "start"]
