FROM node:22.23.4-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev --ignore-scripts
RUN npx prisma generate

FROM node:22.23.4-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY . .
RUN chown -R app:app /app
USER app
EXPOSE 8000
CMD ["node", "server.js"]