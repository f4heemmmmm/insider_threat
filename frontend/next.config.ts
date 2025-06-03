// frontend/next.config.ts

import path from "path";
import type { NextConfig } from "next";

/**
 * Next.js Configuration for Production Deployment
 * 
 * This configuration optimizes the application for standalone deployment,
 * particularly useful for containerized environments like Docker.
 * The standalone output includes all necessary dependencies and can run independently without requiring the full node_modules directory.
 */
const nextConfig: NextConfig = {
    /**
     * Enable standalone output mode for optimized production builds
     * This creates a self-contained application bundle that includes only the necessary files and dependencies, reducing deployment size and improving startup performance in containerized environments
     */
    output: "standalone",
    
    /**
     * Configure file tracing root for monorepo or multi-package setups
     * Points to the parent directory to ensure all dependencies are properly traced and included in the standalone build.
     * This is essential when the Next.js app is part of a larger project structure with shared dependencies or when using Docker multi-stage builds
     */
    outputFileTracingRoot: path.join(__dirname, "../"),
};

export default nextConfig;