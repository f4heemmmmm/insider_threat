// frontend/next.config.ts

import path from "path";
import type { NextConfig } from "next";

/**
 * Next.js Configuration for Production Deployment with TSParticles Support
 * 
 * This configuration optimizes the application for standalone deployment while ensuring
 * TSParticles and other client-side libraries work correctly.
 */
const nextConfig: NextConfig = {
    /**
     * Enable standalone output mode for optimized production builds
     * This creates a self-contained application bundle that includes only the necessary files and dependencies
     */
    output: "standalone",
    
    /**
     * Configure file tracing root for monorepo or multi-package setups
     * Points to the parent directory to ensure all dependencies are properly traced and included in the standalone build.
     */
    outputFileTracingRoot: path.join(__dirname, "../"),

    /**
     * Transpile TSParticles packages for compatibility with Next.js
     * These packages use modern ES modules that need to be transpiled for browser compatibility
     */
    transpilePackages: [
        '@tsparticles/react',
        '@tsparticles/slim',
        '@tsparticles/engine',
        '@tsparticles/basic',
        '@tsparticles/move-base',
        '@tsparticles/shape-circle',
        '@tsparticles/updater-color',
        '@tsparticles/updater-opacity',
        '@tsparticles/updater-out-modes',
        '@tsparticles/updater-size',
        '@tsparticles/interaction-external-attract',
        '@tsparticles/interaction-external-bounce',
        '@tsparticles/interaction-external-bubble',
        '@tsparticles/interaction-external-connect',
        '@tsparticles/interaction-external-grab',
        '@tsparticles/interaction-external-pause',
        '@tsparticles/interaction-external-push',
        '@tsparticles/interaction-external-remove',
        '@tsparticles/interaction-external-repulse',
        '@tsparticles/interaction-external-slow',
        '@tsparticles/interaction-particles-attract',
        '@tsparticles/interaction-particles-collisions',
        '@tsparticles/interaction-particles-links',
        '@tsparticles/plugin-easing-quad'
    ],

    /**
     * Webpack configuration to handle TSParticles modules
     */
    webpack: (config, { isServer }) => {
        // Don't try to bundle TSParticles on the server side
        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push('@tsparticles/react', '@tsparticles/slim');
        }

        // Handle ES modules properly
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        });

        return config;
    },

    /**
     * Experimental features for better ESM support
     */
    // experimental: {
    //     esmExternals: 'loose', // Allow loose ESM handling for better compatibility
    // }
};

export default nextConfig;