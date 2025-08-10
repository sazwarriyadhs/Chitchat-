
import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import path from 'path';
import pool from '@/lib/db';
import { promisify } from 'util';

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Helper to run multer middleware
const runMiddleware = (req: NextRequest, res: NextResponse, fn: any) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

export async function POST(req: NextRequest) {
    const res = new NextResponse();
    
    try {
        // HACK: We need to access the underlying request object for multer to work
        const anyReq = req as any;
        
        // Promisify the upload middleware
        const uploadMiddleware = promisify(upload.single('presentation'));
        
        // Run multer middleware
        await uploadMiddleware(anyReq, res);

        const senderId = parseInt(anyReq.body.senderId) || 1; // example sender_id
        const fileName = anyReq.file.filename;
        const fileUrl = `/uploads/${fileName}`;

        const query = 'INSERT INTO presentations (sender_id, file_name, file_url) VALUES ($1, $2, $3) RETURNING *';
        const values = [senderId, fileName, fileUrl];

        const result = await pool.query(query, values);

        return NextResponse.json({ presentation: result.rows[0] });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: `Something went wrong! ${error.message}` }, { status: 500 });
    }
}
