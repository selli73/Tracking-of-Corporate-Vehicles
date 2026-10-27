# Stage 1
FROM oven/bun:1.3.14 AS base
WORKDIR /usr/src/app

# Stage 2
FROM base AS install
COPY package.json ./
RUN bun install --frozen-lockfile

# Stage 3
FROM base AS start
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .

CMD ["bun", "run", "simulator.ts"]