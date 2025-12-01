import { NextResponse } from "next/server";
import PDFParser from "pdf2json";
import { getDriveClient, ensureFolders, getNextSequenceNumber, uploadFile } from "@/lib/googleDrive";

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

        const parser = new PDFParser();

        const parsedText = await new Promise<string>((resolve, reject) => {
            parser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
            parser.on("pdfParser_dataReady", (pdfData: any) => {
                const rawText = parser.getRawTextContent();
                resolve(rawText);
            });

            parser.parseBuffer(buffer);
        });

        return NextResponse.json({ text: parsedText, submissionId });

    } catch (error) {
        console.error("Error parsing PDF:", error);
        return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
    }
}
