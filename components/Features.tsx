"use client";

import { motion } from "framer-motion";
import { Zap, Brain, Target } from "lucide-react";

const features = [
    {
        title: "AI-Powered Precision",
        description: "Our advanced Gemini AI analyzes your resume against the job description to identify gaps and optimize content.",
        icon: <Brain className="h-16 w-16 text-primary drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />,
    },
    {
        title: "ATS Compatibility",
        description: "Ensure your resume passes Applicant Tracking Systems with a 100% keyword match score.",
        icon: <Target className="h-16 w-16 text-primary drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />,
    },
    {
        title: "Instant Results",
        description: "Get a fully optimized resume in seconds, ready to download and apply immediately.",
        icon: <Zap className="h-16 w-16 text-primary drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />,
    },
];

export function Features() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Why Choose <span className="text-gradient">ResumeMatch AI</span>?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We combine cutting-edge AI with proven recruitment strategies to help you land your dream job.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:bg-white/10 transition-colors group h-full"
                        >
                            <div className="mb-6 relative h-24 w-24 flex items-center justify-center rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                <div className="transform group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
