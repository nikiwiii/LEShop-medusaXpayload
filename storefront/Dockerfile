FROM node:20-alpine AS base
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install

COPY . .

# Generate Payload import map then build
RUN npx payload generate:importmap && npm run build

EXPOSE 3000

CMD ["npm", "start"]
