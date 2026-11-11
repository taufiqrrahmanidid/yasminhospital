FROM node:22.23.4-alpine AS builder
WORKDIR /app

ARG VITE_BACKEND_URL=""
ARG VITE_GOOGLE_MAPS_API_KEY=""
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}

COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]