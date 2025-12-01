"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for trying out the platform.",
        features: ["1 Resume Optimization", "Basic ATS Score", "PDF Download", "Standard Support"],
        popular: false
    },
    {
        name: "Pro",
        price: "$19",
        description: "For serious job seekers.",
        features: ["Unlimited Optimizations", "Detailed Analysis", "Cover Letter Generation", "Priority Support", "LinkedIn Optimization"],
        popular: true
    },
    {
        name: "Enterprise",
        price: "$49",
        description: "For recruitment agencies.",
        features: ["Bulk Processing", "API Access", "Custom Branding", "Dedicated Account Manager", "Team Collaboration"],
        popular: false
    }
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 relative bg-secondary/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Simple Pricing
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your needs.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' : 'border-white/10 bg-white/5 glass-panel'}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                                <p className="text-muted-foreground mt-2">{plan.description}</p>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}>
                                Get Started
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
