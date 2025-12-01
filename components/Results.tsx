"use client";

import { motion } from "framer-motion";
import { Download, CheckCircle2, Zap, Loader2 } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumePDF } from "./ResumePDF";
import { useState } from "react";

interface ResultsProps {
    results: any; // Added results prop
    onUpdate?: (newResults: any) => void; // Added onUpdate prop
}

export function Results({ results, onUpdate }: ResultsProps) {
    const [isBoosting, setIsBoosting] = useState(false);
    const { metadata, personal_info, professional_summary, skills, work_experience, education, certifications, projects } = results;

    const atsScore = metadata?.estimated_ats_score || 0;

    const scoreColor =
        atsScore >= 90
            ? "text-green-500"
            : atsScore >= 70
                ? "text-yellow-500"
                : "text-red-500";

    const handleBoost = async () => {
        setIsBoosting(true);
        try {
            const response = await fetch("/api/optimize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeText: JSON.stringify(results), // Send current results as input
                    jobDescription: localStorage.getItem("jobDescription") || "", // Retrieve JD from local storage or prop
                    type: "boost"
                }),
            });

            if (!response.ok) throw new Error("Failed to boost score");

            const data = await response.json();
            if (onUpdate) onUpdate(data);

        } catch (error) {
            console.error("Boost error:", error);
            alert("Failed to boost score. Please try again.");
        } finally {
            setIsBoosting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl space-y-8"
        >
            {/* Score Card */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-primary/10 blur-[100px] rounded-full" />

                <div className="flex items-center gap-6">
                    <div className="relative h-32 w-32 flex items-center justify-center">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-white/10"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-primary drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                                strokeDasharray={`${atsScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold">{atsScore}%</span>
                            <span className="text-xs text-muted-foreground">Match Score</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Optimization Complete!</h2>
                        <p className="text-muted-foreground max-w-md">{metadata?.changes_made_summary}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                    <PDFDownloadLink
                        document={<ResumePDF data={results} />}
                        fileName={`Optimized_Resume_${personal_info?.full_name?.replace(/\s+/g, "_") || "Candidate"}.pdf`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90"
                    >
                        {({ loading }) => (
                            <>
                                <Download className="h-5 w-5" />
                                {loading ? "Generating PDF..." : "Download PDF"}
                            </>
                        )}
                    </PDFDownloadLink>

                    <button
                        onClick={handleBoost}
                        disabled={isBoosting || atsScore >= 95}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-6 py-3 font-bold text-primary transition-all hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isBoosting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Boosting Score...
                            </>
                        ) : (
                            <>
                                <Zap className="h-5 w-5" />
                                Boost ATS Score
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Optimized Content */}
            <div className="relative rounded-xl bg-white p-12 text-black shadow-2xl overflow-hidden">
                {/* Paper texture effect */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50 pointer-events-none" />

                {/* Download Button */}
                <div className="absolute top-8 right-8 z-10">
                    <PDFDownloadLink
                        document={<ResumePDF data={results} />}
                        fileName={`${personal_info?.full_name?.replace(/\s+/g, "_") || "Candidate"}_Optimized_Resume.pdf`}
                        className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:bg-gray-800 hover:scale-105"
                    >
                        {({ blob, url, loading, error }) =>
                            loading ? "Preparing PDF..." : (
                                <>
                                    <Download className="h-4 w-4" />
                                    Download PDF
                                </>
                            )
                        }
                    </PDFDownloadLink>
                </div>

                {/* Header */}
                <div className="relative mb-10 border-b-2 border-gray-900 pb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{personal_info?.full_name}</h1>
                    <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
                        <span>{personal_info?.phone}</span>
                        <span>{personal_info?.email}</span>
                        <span>{personal_info?.location}</span>
                        {personal_info?.linkedin && (
                            <a href={personal_info.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>
                        )}
                        {personal_info?.github && (
                            <a href={personal_info.github} className="text-blue-600 hover:underline">GitHub</a>
                        )}
                        {personal_info?.portfolio && (
                            <a href={personal_info.portfolio} className="text-blue-600 hover:underline">Portfolio</a>
                        )}
                    </div>
                </div>

                {/* Professional Summary */}
                <div className="relative mb-10">
                    <h2 className="mb-4 text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                        Professional Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-justify">{professional_summary}</p>
                </div>

                {/* Skills */}
                <div className="relative mb-10">
                    <h2 className="mb-4 text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {skills?.technical?.map((skill: string, i: number) => (
                            <span
                                key={`tech-${i}`}
                                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-800 border border-gray-200"
                            >
                                {skill}
                            </span>
                        ))}
                        {skills?.soft_skills?.map((skill: string, i: number) => (
                            <span
                                key={`soft-${i}`}
                                className="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-800 border border-blue-200"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div className="relative mb-10">
                    <h2 className="mb-4 text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
                        Experience
                    </h2>
                    <div className="space-y-8">
                        {work_experience?.map((job: any, i: number) => (
                            <div key={i}>
                                <div className="flex flex-col justify-between sm:flex-row sm:items-baseline mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{job.role}</h3>
                                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{job.dates}</span>
                                </div>
                                <div className="mb-3 flex justify-between text-sm text-gray-600 font-medium">
                                    <span>{job.company}</span>
                                    <span>{job.location}</span>
                                </div>
                                <ul className="list-disc space-y-2 pl-5 text-gray-700">
                                    {job.description_bullets?.map((point: string, j: number) => (
                                        <li key={j} dangerouslySetInnerHTML={{ __html: point }} className="pl-1" />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div className="relative mb-10">
                    <h2 className="mb-4 text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
                        Education
                    </h2>
                    <div className="space-y-4">
                        {education?.map((edu: any, i: number) => (
                            <div key={i} className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{edu.institution}</h3>
                                    <p className="text-gray-700">{edu.degree}</p>
                                </div>
                                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{edu.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <div className="relative mb-10">
                        <h2 className="mb-4 text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
                            Certifications
                        </h2>
                        <ul className="list-disc space-y-2 pl-5 text-gray-700">
                            {certifications.map((cert: string, i: number) => (
                                <li key={i} className="pl-1">{cert}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <div className="relative">
                        <h2 className="mb-4 text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-2">
                            Projects
                        </h2>
                        <div className="space-y-6">
                            {projects.map((project: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                                        <span className="text-sm font-medium text-gray-500">{project.tech_stack}</span>
                                    </div>
                                    <p className="text-gray-700">{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
