"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, FileCheck } from "lucide-react";

const steps = [
    {
        icon: <Upload className="h-8 w-8 text-primary" />,
        title: "Upload Resume",
        description: "Upload your current resume in PDF format. We'll extract your skills and experience."
    },
    {
        icon: <Cpu className="h-8 w-8 text-primary" />,
        title: "AI Analysis",
        description: "Our Gemini AI analyzes your profile against the job description to find gaps."
    },
    {
        icon: <FileCheck className="h-8 w-8 text-primary" />,
        title: "Get Optimized",
        description: "Receive a perfectly tailored resume with a high ATS match score in seconds."
    }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Three simple steps to your dream job.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/10">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>

                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
