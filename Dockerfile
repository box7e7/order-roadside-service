# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Create .env and .env.local files
RUN touch /app/.env /app/.env.local

# Copy environment files if they exist locally
COPY .env* /app/

# Build the Next.js app
RUN yarn build

COPY --from=builder /app /app

RUN yarn install --frozen-lockfile --production

# Create .env and .env.local files
# Expose the port that Next.js listens on
EXPOSE 3000


# Start Next.js without cron
CMD ["yarn", "start"]
