# Stage 1
FROM oven/bun:1.3.14 AS base
WORKDIR /usr/src/app

# Stage 2
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Stage 3
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun run fleet:generate
RUN bun run booking:generate
RUN bun run telemetry:generate
RUN bun run billing:generate
RUN bun run notification:generate

RUN bun run build gateway
RUN bun run build fleet
RUN bun run build booking
RUN bun run build telemetry
RUN bun run build billing
RUN bun run build notification

# Stage 3.5 - файлы Prisma только для сервиса у которого есть
FROM prerelease AS prisma-files
ARG APP
RUN mkdir -p /prisma-files && \
    if [ -d apps/${APP}/prisma ]; then \
        cp -r apps/${APP}/prisma apps/${APP}/prisma7.config.ts /prisma-files/; \
    fi

# Stage 4
FROM base AS release
ARG APP
ENV APP=${APP}
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=prisma-files /prisma-files ./apps/${APP}/
COPY --from=prerelease /usr/src/app/dist/apps/${APP} ./dist/apps/${APP}
COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER bun
ENTRYPOINT [ "sh", "-c", "bun run ${APP}:migrate:deploy && exec bun dist/apps/${APP}/main.js" ]