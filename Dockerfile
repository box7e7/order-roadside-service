# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Build the Next.js app
RUN yarn build

# Stage 2: Production image
FROM node:18-alpine

WORKDIR /app



# Expose the port that Next.js listens on
EXPOSE 3000

# Start Next.js
CMD ["yarn", "start"]
