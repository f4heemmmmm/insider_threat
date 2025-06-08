// frontend/src/app/login/layout.tsx

"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from 'next/dynamic';
import type { ISourceOptions } from "@tsparticles/engine";

// Dynamically import TSParticles to avoid SSR issues
const Particles = dynamic(() => import('@tsparticles/react'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-white text-sm">Loading particles...</div>
        </div>
    )
});

interface LoginLayoutProps {
    children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
    const [init, setInit] = useState(false);
    const [error, setError] = useState<string>("");

    // Initialize TSParticles with proper error handling
    useEffect(() => {
        const initializeParticles = async () => {
            try {
                console.log("🚀 Starting TSParticles initialization...");
                
                // Dynamically import to avoid SSR issues
                const { initParticlesEngine } = await import('@tsparticles/react');
                const { loadSlim } = await import('@tsparticles/slim');
                
                console.log("📦 Packages imported successfully");
                
                await initParticlesEngine(async (engine) => {
                    console.log("⚙️ Loading slim configuration...");
                    await loadSlim(engine);
                    console.log("✅ TSParticles engine ready!");
                });
                
                setInit(true);
                
            } catch (err) {
                console.error("❌ TSParticles initialization failed:", err);
                setError(`Failed to load particles: ${err}`);
            }
        };

        // Only run in browser environment
        if (typeof window !== 'undefined') {
            initializeParticles();
        }
    }, []);

    // Optimized particle configuration for cyber theme
    const particlesOptions: ISourceOptions = useMemo(() => ({
        background: {
            color: {
                value: "transparent",
            },
        },
        fullScreen: {
            enable: false, // Important: don't take over full screen
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: {
                    enable: true,
                },
            },
            modes: {
                push: {
                    quantity: 2,
                },
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#fd79a8"],
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.4,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: true,
                speed: 4,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    width: 1920,
                    height: 1080,
                },
                value: 60,
            },
            opacity: {
                value: {
                    min: 0.3,
                    max: 0.8,
                },
            },
            shape: {
                type: "circle",
            },
            size: {
                value: {
                    min: 1,
                    max: 4,
                },
            },
        },
        detectRetina: true,
        smooth: true,
    }), []);

    // Debug info in development
    useEffect(() => {
        if (init) {
            const checkParticles = setTimeout(() => {
                const canvas = document.querySelector('#tsparticles-bg canvas');
                if (canvas) {
                    console.log("✅ Particles canvas rendered successfully");
                } else {
                    console.warn("⚠️ Particles canvas not found");
                }
            }, 2000);

            return () => clearTimeout(checkParticles);
        }
    }, [init]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-900">
            {/* Error display */}
            {error && (
                <div className="absolute top-4 right-4 z-50 bg-red-900 text-white p-3 rounded-lg text-sm max-w-xs">
                    <div className="font-semibold">Particles Error:</div>
                    <div className="text-xs mt-1">{error}</div>
                </div>
            )}

            {/* TSParticles Background */}
            {init && !error && (
                <div className="absolute inset-0 w-full h-full">
                    <Particles
                        id="tsparticles-bg"
                        options={particlesOptions}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1,
                        }}
                        className="particles-container"
                    />
                </div>
            )}

            {/* Fallback background pattern if particles fail */}
            {!init && !error && (
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-red-900/20"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.3),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.3),transparent_50%)]"></div>
                </div>
            )}

            {/* Dark overlay for content readability */}
            <div className="absolute inset-0 bg-black/30 z-5"></div>
            
            {/* Content Layer */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};