FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install

# Copy source
COPY . .

# Build
RUN npm run build

EXPOSE 9000

# Run migrations then start
CMD ["sh", "-c", "npx medusa migrations run && npx medusa start"]
