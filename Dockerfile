FROM node:22.23.4-bookworm-slim

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --global npm@10.9.9 \
  && npm ci --no-audit --no-fund
COPY . .
RUN npm run build \
  && npm run validate

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
