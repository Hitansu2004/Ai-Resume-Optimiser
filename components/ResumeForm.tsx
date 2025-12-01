"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Briefcase, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeFormProps {
    onSubmit: (resumeText: string, jobDescription: string) => Promise<void>;
    isLoading: boolean;
    onAnalysisComplete: (resumeText: string, submissionId?: number | null) => void;
}

export function ResumeForm({ onSubmit, isLoading, onAnalysisComplete }: ResumeFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [resumeText, setResumeText] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            setError("Please upload a PDF file.");
            return;
        }

        setFile(selectedFile);
        setError("");
        setIsParsing(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("/api/parse-pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errText = await response.text();
                let errorMessage = `Failed to parse PDF (${response.status})`;
                try {
                    const errData = JSON.parse(errText);
                    if (errData.error) errorMessage = errData.error;
                } catch (e) {
                    console.error("Non-JSON error response:", errText);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            if (data.text) {
                setResumeText(data.text);
                onAnalysisComplete(data.text, data.submissionId);
            } else {
                console.error("Empty text received:", data);
                throw new Error("Failed to parse PDF: Server returned empty text.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to read resume content. Please try again.");
        } finally {
            setIsParsing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeText || !jobDescription) {
            setError("Please upload a resume and provide a job description.");
            return;
        }
        onSubmit(resumeText, jobDescription);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel w-full max-w-3xl rounded-3xl p-8 sm:p-10"
        >
            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Resume Upload */}
                <div className="space-y-4">
                    <label className="flex items-center gap-3 text-xl font-semibold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                            1
                        </div>
                        Upload Resume
                    </label>
                    <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-10 transition-all hover:border-primary/50 hover:bg-primary/5">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 z-50 cursor-pointer opacity-0"
                            disabled={isLoading || isParsing}
                        />
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className={cn(
                                "rounded-full p-4 transition-all duration-300 group-hover:scale-110",
                                file ? "bg-green-500/20 text-green-500" : "bg-primary/10 text-primary"
                            )}>
                                {file ? <CheckCircle2 className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-medium">
                                    {file ? file.name : "Drop your resume here"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {file ? "Ready to process" : "Support for PDF files (max 5MB)"}
                                </p>
                            </div>
                        </div>
                    </div>
                    {isParsing && (
                        <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Extracting text from resume...
                        </div>
                    )}
                </div>

                {/* Job Description */}
                <div className="space-y-4">
                    <label className="flex items-center gap-3 text-xl font-semibold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                            2
                        </div>
                        Job Description
                    </label>
                    <div className="relative group">
                        <Briefcase className="absolute top-4 left-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here..."
                            className="min-h-[200px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !resumeText || !jobDescription}
                    className={cn(
                        "w-full rounded-2xl bg-gradient-to-r from-primary to-violet-600 py-5 text-xl font-bold text-white shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]",
                        (isLoading || !resumeText || !jobDescription) && "cursor-not-allowed opacity-50 grayscale"
                    )}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-3">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            Optimizing Resume...
                        </div>
                    ) : (
                        "Generate Optimized Resume"
                    )}
                </button>
            </form>
        </motion.div>
    );
}
