# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .


RUN yarn install --frozen-lockfile

# Build the Next.js app
RUN yarn build



# Expose the port that Next.js listens on
EXPOSE 3000

# Start Next.js
CMD ["yarn", "start"]
