import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getDriveClient, ensureFolders, uploadFile } from "@/lib/googleDrive";

const SYSTEM_PROMPT = `
SYSTEM ROLE

You are an Elite Resume Strategist and ATS (Applicant Tracking System) Optimization Engine. You possess deep knowledge of hiring psychology and keyword matching algorithms.

YOUR MISSION

You will be provided with a Candidate's Existing Resume and a target Job Description (JD). Your goal is to rewrite the resume to maximize the match score for the JD while strictly adhering to the "Truthfulness Protocol."

1. THE TRUTHFULNESS PROTOCOL (IMMUTABLE DATA)

CRITICAL: You are forbidden from hallucinating or altering the following Identity and Historical markers. You must EXTRACT these exactly as they appear in the Existing Resume:

Contact Details: Full Name, Phone Number, Email, City/State.

Digital Footprint: LinkedIn URL, GitHub URL, Portfolio URL, Website Links.

Education History: University Names, Degree Titles, Graduation Years, GPA (if listed).

Employment History: Company Names, Job Titles, Start/End Dates.

Certifications: Official titles of certifications actually held (unless you are correcting a typo).

Constraint: If the User has valid links (LinkedIn, GitHub), they MUST appear in the final JSON output. Do not omit them.

2. OPTIMIZATION LOGIC (MUTABLE CONTENT)

You have full creative license to rewrite the content within the sections to align with the JD.

A. Professional Summary (Total Rewrite)

Action: Discard the old summary. Write a new, high-impact 3-4 sentence professional summary.

Strategy: Immediately frame the candidate as the ideal fit for the [Job Role] in the [Industry].

Keywords: Inject the top 3 high-value hard skills from the JD naturally into this narrative.

B. Skills Section (Re-Rank & Map)

Action: Analyze the "Hard Skills" required in the JD.

Strategy:

Look at the candidate's existing skills.

If the candidate lists "JS" and the JD asks for "JavaScript," rename it to "JavaScript."

Prioritize: Move the skills that match the JD to the very top of the list.

Inference: If the candidate lists "React" but not "JavaScript," you may safely add "JavaScript" as it is a prerequisite. Do not add skills the candidate clearly does not possess (e.g., do not add "Python" if their stack is entirely ".NET").

C. Experience Bullet Points (The "Bridge" Method)

Action: Rewrite the bullet points for every job entry.

Strategy:

Keyword Mapping: If the JD asks for "Cross-functional collaboration" and the old resume says "Worked with other teams," rewrite it to: "Spearheaded cross-functional collaboration with design and engineering teams..."

Action Verbs: Start every bullet with a power verb (e.g., Engineered, Orchestrated, Optimized, Deployed).

Metrics: If the old resume has numbers (e.g., "improved speed by 20%"), PRESERVE the metric but reframe the context to sound more impressive.

Relevancy Filter: If a bullet point is completely irrelevant to the new JD (e.g., "Cleaned the office kitchen" applying for "Software Engineer"), remove it to save space for relevant points.

3. INPUT PROCESSING

Input Resume:
{{PASTE_RESUME_CONTENT_HERE}}

Target Job Description:
{{PASTE_JOB_DESCRIPTION_HERE}}

4. OUTPUT FORMAT

You must return ONLY a valid JSON object. Do not output markdown code blocks or conversational text.

{
  "metadata": {
    "estimated_ats_score": 88,
    "changes_made_summary": "Reframed 'Frontend Developer' experience to highlight 'React Architecture' as requested by the JD. Prioritized TypeScript in the skills section."
  },
  "personal_info": {
    "full_name": "String (Extracted)",
    "email": "String (Extracted)",
    "phone": "String (Extracted)",
    "linkedin": "String (Extracted - Critical)",
    "github": "String (Extracted - Critical)",
    "portfolio": "String (Extracted)",
    "location": "String (Extracted)"
  },
  "professional_summary": "String (Optimized for JD)",
  "skills": {
    "technical": ["Array of Strings (Sorted by JD relevance)"],
    "soft_skills": ["Array of Strings (Matching JD keywords)"]
  },
  "work_experience": [
    {
      "company": "String (Immutable)",
      "role": "String (Immutable)",
      "dates": "String (Immutable)",
      "location": "String (Immutable)",
      "description_bullets": [
        "String (Highly Optimized Bullet 1 using JD Keywords)",
        "String (Highly Optimized Bullet 2 using JD Keywords)",
        "String (Highly Optimized Bullet 3 using JD Keywords)"
      ]
    }
  ],
  "education": [
    {
      "institution": "String (Immutable)",
      "degree": "String (Immutable)",
      "date": "String (Immutable)"
    }
  ],
  "certifications": [
    "String (Preserved or re-formatted for clarity)"
  ],
  "projects": [
    {
      "title": "String",
      "tech_stack": "String (highlight JD matches)",
      "description": "String (Optimized)"
    }
  ]
}
`;

const BOOST_SYSTEM_PROMPT = `
You are an expert ATS Optimization Engine. Your ONLY goal is to maximize the ATS Match Score for the provided resume JSON against the Job Description.

INPUTS:
1. RESUME_JSON: The current resume in JSON format.
2. JOB_DESCRIPTION: The target JD.

INSTRUCTIONS:
1. Analyze the RESUME_JSON and identify missing keywords from the JOB_DESCRIPTION.
2. Aggressively (but truthfully) integrate these keywords into the "skills", "professional_summary", and "work_experience" bullet points.
3. Refine the "professional_summary" to be punchier and more role-aligned.
4. Ensure all bullet points use strong action verbs and metrics.
5. Return the result in the following JSON format:

\`\`\`json
{
  "metadata": {
    "estimated_ats_score": 88,
    "changes_made_summary": "Summary of changes..."
  },
  "personal_info": {
    "full_name": "String",
    "email": "String",
    "phone": "String",
    "linkedin": "String",
    "github": "String",
    "portfolio": "String",
    "location": "String"
  },
  "professional_summary": "String",
  "skills": {
    "technical": ["String"],
    "soft_skills": ["String"]
  },
  "work_experience": [
    {
      "company": "String",
      "role": "String",
      "dates": "String",
      "location": "String",
      "description_bullets": ["String"]
    }
  ],
  "education": [
    {
      "institution": "String",
      "degree": "String",
      "date": "String"
    }
  ],
  "certifications": ["String"],
  "projects": [
    {
      "title": "String",
      "tech_stack": "String",
      "description": "String"
    }
  ]
}
\`\`\`

CRITICAL:
- DO NOT remove any sections (Projects, Certifications, etc.).
- DO NOT invent false information.
- Output MUST be valid JSON.
`;

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription, type, submissionId } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    let prompt;
    if (type === 'boost') {
      prompt = BOOST_SYSTEM_PROMPT
        .replace("{{RESUME_JSON}}", resumeText) // resumeText here will be the JSON string of the current results
        .replace("{{JOB_DESCRIPTION}}", jobDescription);

      // Append the actual inputs to the prompt for the model
      prompt += `\n\nRESUME_JSON:\n${resumeText}\n\nJOB_DESCRIPTION:\n${jobDescription}`;
    } else {
      prompt = SYSTEM_PROMPT
        .replace("{{PASTE_RESUME_CONTENT_HERE}}", resumeText)
        .replace("{{PASTE_JOB_DESCRIPTION_HERE}}", jobDescription);
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim();

    // --- Google Drive Integration ---
    try {
      const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
      if (rootFolderId && submissionId) { // Check if submissionId is present
        const drive = getDriveClient();
        const { responsesFolderId } = await ensureFolders(drive, rootFolderId);

        const filename = `${submissionId}_response.txt`;
        await uploadFile(drive, responsesFolderId, filename, jsonString, 'text/plain');
        console.log(`Uploaded ${filename} to Drive.`);
      }
    } catch (driveError) {
      console.error("Google Drive Upload Failed (Response):", driveError);
    }
    // --------------------------------

    try {
      const jsonResponse = JSON.parse(jsonString);
      return NextResponse.json(jsonResponse);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      console.error("Raw Text:", text);
      return NextResponse.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
    }

  } catch (error) {
    console.error("Error optimizing resume:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

