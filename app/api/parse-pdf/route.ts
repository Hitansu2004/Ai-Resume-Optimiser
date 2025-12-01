import { NextResponse } from "next/server";
import { getDriveClient, ensureFolders, getNextSequenceNumber, uploadFile } from "@/lib/googleDrive";
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // --- Google Drive Integration ---
        let submissionId = null;
        try {
            const rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
            if (rootFolderId) {
                const drive = getDriveClient();
                const { uploadsFolderId } = await ensureFolders(drive, rootFolderId);
                const sequenceNum = await getNextSequenceNumber(drive, uploadsFolderId);
                submissionId = sequenceNum;

                const filename = `${sequenceNum}.pdf`;
                await uploadFile(drive, uploadsFolderId, filename, buffer, 'application/pdf');
                console.log(`Uploaded ${filename} to Drive. Submission ID: ${submissionId}`);
            } else {
                console.warn("GOOGLE_DRIVE_ROOT_FOLDER_ID not set. Skipping Drive upload.");
            }
        } catch (driveError) {
            console.error("Google Drive Upload Failed:", driveError);
            // Continue with parsing even if upload fails, but log it.
        }
        // --------------------------------

        // --------------------------------

        // Use pdf-parse for more reliable text extraction
        // Polyfill for DOMMatrix which is missing in some Node environments
        if (typeof DOMMatrix === 'undefined') {
            (global as any).DOMMatrix = class DOMMatrix {
                constructor() { return this; }
                toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
            };
        }
        let parseFunc = pdfParse;
        // Handle different export structures (CommonJS vs ES modules vs library specifics)
        if (typeof parseFunc !== 'function') {
            if (parseFunc.default && typeof parseFunc.default === 'function') {
                parseFunc = parseFunc.default;
            } else if (parseFunc.PDFParse && typeof parseFunc.PDFParse === 'function') {
                // Based on logs, it might be a property
                parseFunc = parseFunc.PDFParse;
            } else {
                // Fallback: if it's an object but we can't find the function, try to find *any* function or just log
                console.error("pdf-parse export structure:", Object.keys(pdfParse));
                // Attempt to use the main object if it looks like a function but typeof lied (unlikely)
            }
        }

        if (typeof parseFunc !== 'function') {
            throw new Error(`pdf-parse is not a function. Type: ${typeof pdfParse}, Keys: ${Object.keys(pdfParse)}`);
        }

        const data = await parseFunc(buffer);
        const parsedText = data.text;

        if (!parsedText || parsedText.trim().length === 0) {
            throw new Error("No text content found in PDF");
        }

        return NextResponse.json({ text: parsedText, submissionId }, {
            headers: { "X-Parser-Version": "v2-pdf-parse" }
        });

    } catch (error: any) {
        console.error("Error parsing PDF (Full Details):", error);
        console.error("Stack Trace:", error.stack);
        return NextResponse.json({ error: `Failed to parse PDF: ${error.message}` }, { status: 500 });
    }
}
