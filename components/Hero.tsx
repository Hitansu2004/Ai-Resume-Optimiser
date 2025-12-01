"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Upload, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-24 text-center lg:pt-32">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-20 bg-grid-pattern opacity-20" />
            <div className="absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-[100px]" />

            <div className="container mx-auto grid gap-12 lg:grid-cols-2 lg:items-center relative z-10">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center lg:items-start lg:text-left"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>AI-Powered Resume Optimization</span>
                    </motion.div>

                    <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
                        Beat the ATS with <br />
                        <span className="text-gradient">Precision Engineering</span>
                    </h1>

                    <p className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                        Upload your resume and the job description. Our elite AI strategist will rewrite your resume to achieve a <span className="font-semibold text-foreground">100% match score</span> while maintaining strict truthfulness.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <button
                            onClick={() => document.getElementById('optimize')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90"
                        >
                            Optimize Now
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 text-lg font-medium backdrop-blur-sm transition-colors hover:bg-white/10">
                            View Sample
                        </button>
                    </div>

                    <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>ATS Friendly</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>AI Powered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span>Instant Results</span>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mx-auto w-full max-w-[500px] lg:max-w-none flex justify-center"
                >
                    <div className="relative aspect-square w-full max-w-[600px]">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[60px] rounded-full" />
                        <Image
                            src="/hero-illustration.png"
                            alt="AI Resume Optimization"
                            fill
                            className="object-contain drop-shadow-2xl animate-float"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />

                        {/* Floating Elements - Fixed Positioning */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="absolute top-[10%] right-[0%] lg:-right-[5%] p-4 glass-panel rounded-2xl animate-float-delayed z-20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                    <span className="font-bold">98%</span>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Match Score</p>
                                    <p className="font-bold text-foreground">Excellent</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="absolute bottom-[15%] left-[0%] lg:-left-[5%] p-4 glass-panel rounded-2xl animate-float z-20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                    <Upload className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Processing</p>
                                    <p className="font-bold text-foreground">Resume.pdf</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
