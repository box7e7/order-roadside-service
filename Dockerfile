# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build the Next.js app
RUN yarn build

COPY --from=builder /app /app

RUN yarn install --frozen-lockfile --production

# Expose the port that Next.js listens on
EXPOSE 3000


# Start Next.js without cron
CMD ["yarn", "start"]