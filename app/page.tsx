"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ResumeForm } from "@/components/ResumeForm";
import { Results } from "@/components/Results";

import { Features } from "@/components/Features";

import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";

import { BackgroundEffects } from "@/components/BackgroundEffects";

export default function Home() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState<number | null>(null); // New state

  const handleAnalysisComplete = (text: string, id?: number | null) => {
    // Assuming resumeText state would be managed elsewhere or passed down
    // setResumeText(text); // This line would require a resumeText state
    if (id) setSubmissionId(id);
  };

  const handleOptimize = async (resumeText: string, jobDescription: string) => {
    setIsLoading(true);
    setResults(null);
    localStorage.setItem("jobDescription", jobDescription); // Save JD for boosting

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText, jobDescription, type: "optimize", submissionId }), // Pass submissionId
      });

      if (!response.ok) {
        throw new Error("Failed to optimize resume");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative">
      <BackgroundEffects />
      <Navbar />

      <div className="flex flex-col items-center pb-24 relative z-10">
        <Hero />

        <HowItWorks />

        <Features />

        <Pricing />

        <div id="optimize" className="container mx-auto px-4 mt-12 w-full flex justify-center">
          <ResumeForm
            onSubmit={handleOptimize}
            isLoading={isLoading}
            onAnalysisComplete={handleAnalysisComplete}
          />
        </div>

        {results && (
          <div id="results" className="w-full flex justify-center px-4 pb-24">
            <Results results={results} onUpdate={setResults} />
          </div>
        )}
      </div>
    </main>
  );
}
