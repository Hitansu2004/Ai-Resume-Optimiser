import { google } from 'googleapis';
import { Readable } from 'stream';

// Initialize Google Drive Client
export const getDriveClient = () => {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Handle newlines in env var

    if (!clientEmail || !privateKey) {
        throw new Error("Missing Google Drive credentials in environment variables.");
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    return google.drive({ version: 'v3', auth });
};

// Ensure 'uploads' and 'responses' folders exist inside the root folder
export const ensureFolders = async (drive: any, rootFolderId: string) => {
    const query = (name: string) =>
        `mimeType='application/vnd.google-apps.folder' and name='${name}' and '${rootFolderId}' in parents and trashed=false`;

    const createFolder = async (name: string) => {
        const res = await drive.files.create({
            requestBody: {
                name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [rootFolderId],
            },
            fields: 'id',
        });
        return res.data.id;
    };

    const getOrCreate = async (name: string) => {
        const res = await drive.files.list({
            q: query(name),
            fields: 'files(id)',
            spaces: 'drive',
        });

        if (res.data.files && res.data.files.length > 0) {
            return res.data.files[0].id;
        }
        return await createFolder(name);
    };

    const uploadsFolderId = await getOrCreate('uploads');
    const responsesFolderId = await getOrCreate('responses');

    return { uploadsFolderId, responsesFolderId };
};

// Get the next sequence number based on file count in 'uploads'
export const getNextSequenceNumber = async (drive: any, uploadsFolderId: string): Promise<number> => {
    const res = await drive.files.list({
        q: `'${uploadsFolderId}' in parents and trashed=false`,
        fields: 'files(id)',
        spaces: 'drive',
    });

    // Simple count-based sequence. 
    // Note: In a high-concurrency production env, this needs a database or atomic counter.
    // For this use case, it's acceptable.
    return (res.data.files?.length || 0) + 1;
};

// Upload a file to Drive
export const uploadFile = async (
    drive: any,
    folderId: string,
    filename: string,
    content: Buffer | string,
    mimeType: string
) => {
    const media = {
        mimeType,
        body: Readable.from(content),
    };

    const res = await drive.files.create({
        requestBody: {
            name: filename,
            parents: [folderId],
        },
        media: media,
        fields: 'id, name, webViewLink',
    });

    return res.data;
};
