import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const generateFileName = (originalName) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
};

export const uploadToS3 = async (file, folder = '') => {
    const fileName = generateFileName(file.originalname);
    const key = folder ? `${folder}/${fileName}` : fileName;
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    await s3Client.send(command);
    return `https://${process.env.ACCESS_URL}/${key}`;
};

export const deleteFromS3 = async (url) => {
    const key = new URL(url).pathname.substring(1);
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });
    
    await s3Client.send(command);
};

export const emptyS3Bucket = async () => {
    try {
        let isTruncated = true;
        let continuationToken = undefined;
        while (isTruncated) {
            const listCommand = new ListObjectsV2Command({
                Bucket: process.env.AWS_BUCKET_NAME,
                ContinuationToken: continuationToken,
            });
            const listResponse = await s3Client.send(listCommand);
            
            if (listResponse.Contents && listResponse.Contents.length > 0) {
                // Delete objects in batch (up to 1000 at a time)
                const deleteCommand = new DeleteObjectsCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Delete: {
                        Objects: listResponse.Contents.map(({ Key }) => ({ Key })),
                        Quiet: true
                    }
                });
                await s3Client.send(deleteCommand);
            }

            isTruncated = listResponse.IsTruncated;
            continuationToken = listResponse.NextContinuationToken;
        }

        return true;
    } catch (error) {
        console.error('Error emptying S3 bucket:', error);
        throw error;
    }
}; 