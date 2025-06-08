# Multi-stage Dockerfile for Next.js Frontend Application
# Supports both development (with hot-reload) and production environments

# =============================================================================
# BASE STAGE
# Common base image for all stages to ensure consistency
# =============================================================================
FROM node:18-alpine AS base

# Install essential tools
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app


# =============================================================================
# DEPENDENCIES STAGE
# Install and cache dependencies separately for better layer caching
# =============================================================================
FROM base AS dependencies

# Copy dependency configuration files
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm ci --legacy-peer-deps

# Create a separate stage for production dependencies
FROM base AS prod-dependencies

# Copy dependency configuration files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --legacy-peer-deps --omit=dev


# =============================================================================
# DEVELOPMENT STAGE
# Optimized for hot-reload with Next.js Fast Refresh
# =============================================================================
FROM base AS development

# Copy all dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy package files and Next.js config
COPY package*.json ./
COPY next.config.ts ./
COPY tsconfig.json ./

# Copy any other config files that might exist
COPY tailwind.config.* ./
COPY postcss.config.* ./

# Set development environment
ENV NODE_ENV=development
ENV PORT=3000

# Enable Next.js telemetry in development (optional - can be disabled)
ENV NEXT_TELEMETRY_DISABLED=1

# Expose the application port
EXPOSE 3000

# Health check for development
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Development command with hot-reload
# Source files will be mounted as volumes
CMD ["npm", "run", "dev"]


# =============================================================================
# BUILD STAGE
# Compile and build the Next.js application for production
# =============================================================================
FROM base AS builder

# Copy all dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy entire source code for compilation
COPY . .

# Build the Next.js application
RUN npm run build


# =============================================================================
# PRODUCTION STAGE
# Final optimized image with minimal footprint and security hardening
# =============================================================================
FROM base AS production

# Security hardening: Create dedicated system users
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy production dependencies from prod-dependencies stage
COPY --from=prod-dependencies /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy package.json for scripts
COPY package*.json ./

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Health check for production
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Production command using standalone server
CMD ["node", "server.js"]