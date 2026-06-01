# Stage 1: build Nuxt app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline
COPY . .
ARG NUXT_PUBLIC_API_BASE=http://localhost:8080
ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
RUN npm run build

# Stage 2: minimal runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.output ./.output
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", ".output/server/index.mjs"]
