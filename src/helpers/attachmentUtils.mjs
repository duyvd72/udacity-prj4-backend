import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()

export async function generateUploadUrl({ userId, todoId }) {
  const {
    S3_BUCKET: s3BucketName,
    SIGNED_URL_EXPIRATION,
    AWS_REGION: region
  } = process.env
  const urlExpiration = SIGNED_URL_EXPIRATION

  const s3Client = new S3Client({ region })

  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: todoId
  })

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })

  const attachmentUrl = `https://${s3BucketName}.s3.${region}.amazonaws.com/${todoId}`
  await todoAccess.saveImgUrl({ userId, todoId, attachmentUrl })

  return signedUrl
}
