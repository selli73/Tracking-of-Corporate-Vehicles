# Stage 1: зависимости
FROM oven/bun:1.3.14 AS install
WORKDIR /usr/src/app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: сборка
FROM install AS build
COPY . .
RUN bun run build

# Stage 3: nginx с готовыми файлами
FROM nginx:alpine AS release
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]