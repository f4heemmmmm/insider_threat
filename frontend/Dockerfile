# Multi-stage Dockerfile for Next.js Frontend Application
# Optimized for production deployment with security hardening

# =============================================================================
# DEPENDENCIES STAGE
# Install and cache dependencies separately for better layer caching
# =============================================================================
FROM node:18-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy dependency configuration files first to leverage Docker layer caching
# If package files haven't changed, this layer can be reused
COPY package*.json ./

# Install dependencies with legacy peer deps flag for compatibility
# Using npm ci for faster, reliable, reproducible builds
RUN npm ci --legacy-peer-deps --only=production && \
    npm cache clean --force


# =============================================================================
# BUILD STAGE  
# Compile and build the Next.js application for production
# =============================================================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all dependencies including dev dependencies needed for build
RUN npm ci --legacy-peer-deps

# Copy entire source code for compilation
COPY . .

# Build the Next.js application for production
# This creates optimized static files and server-side code
RUN npm run build


# =============================================================================
# PRODUCTION STAGE
# Final optimized image with minimal footprint and security hardening
# =============================================================================
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Security hardening: Create dedicated system users for running the application
# Using system users with specific UIDs follows security best practices
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy production dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy built Next.js application from builder stage
# This includes optimized static assets and server-side rendered pages
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Optional: Copy any additional configuration files if needed
# COPY --from=builder /app/next.config.js ./

# Security: Change ownership of all application files to non-root user
# Ensures the application runs with minimal privileges
RUN chown -R nextjs:nodejs /app

# Switch to non-root user for security
# All subsequent operations and the final CMD will run as this user
USER nextjs

# Expose the application port for external access
EXPOSE 3000

# Set environment variable for port configuration
# Next.js will use this to determine which port to bind to
ENV PORT=3000
ENV NODE_ENV=production

# Health check to ensure the application is running properly
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Production command: Start the built Next.js application
# Uses the optimized production server
CMD ["npm", "start"]