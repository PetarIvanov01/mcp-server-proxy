# 1. Install dependencies only when needed
FROM node:21-alpine AS deps

WORKDIR /app

# Copy package files
COPY src/telerik-license.txt ./telerik-license.txt
COPY package*.json ./

# Install all dependencies including dev dependencies for building
RUN npm ci

# 2. Build the source code
FROM node:21-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/telerik-license.txt ./telerik-license.txt
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# 3. Production image
FROM node:21-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/telerik-license.txt ./telerik-license.txt
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/index.js"] 