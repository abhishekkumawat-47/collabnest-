# Dockerfile for Next.js frontend
FROM node:18-bullseye

WORKDIR /app

# Copy package files and set environment
COPY package*.json ./
ENV TAILWIND_MODE=build

# Clean npm cache and install dependencies
RUN npm cache clean --force
RUN npm ci

# Rebuild native modules (lightningcss)
RUN npm rebuild lightningcss

# Copy rest of the source
COPY . .


RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]


