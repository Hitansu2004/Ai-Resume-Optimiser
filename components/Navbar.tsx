"use client";

import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";

export function Navbar() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <FileText className="h-5 w-5" />
                    </div>
                    <span>ResumeMatch <span className="text-primary">AI</span></span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        How it Works
                    </button>
                    <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Features
                    </button>
                    <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Pricing
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => scrollToSection('optimize')}
                        className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
                    >
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Get Started</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
