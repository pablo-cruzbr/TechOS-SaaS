import crypto from 'crypto'
import multer from 'multer';

export default {
    upload() { 
        return {
            storage: multer.memoryStorage(), 
            limits: {
                fileSize: 5 * 1024 * 1024, // Limite de 5MB
            },
            
            filename: (request: any, file: any, callback: any) => {
                const fileHash = crypto.randomBytes(16).toString("hex");
                const fileName = `${fileHash}-${file.originalname}`;
                return callback(null, fileName);
            }
        }
    }
}