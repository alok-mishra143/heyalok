// src/lib/r2.ts
import "server-only"

import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const getEnv = (...names: string[]) => {
  for (const name of names) {
    const value = process.env[name] ?? process.env[`${name} `]

    if (value) {
      return value.trim()
    }
  }
}

const requireEnv = (...names: string[]) => {
  const value = getEnv(...names)

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${names.join(" or ")}`
    )
  }

  return value
}

const getR2Endpoint = () => {
  return `https://${requireEnv("CLOUDFLARE_ACCOUNT_ID")}.r2.cloudflarestorage.com`
}

let _r2: S3Client | null = null

const getR2 = () => {
  if (!_r2) {
    _r2 = new S3Client({
      region: "auto",
      endpoint: getR2Endpoint(),
      credentials: {
        accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
      },
    })
  }
  return _r2
}

export const getSignedR2Url = (key: string, expiresIn = 60 * 60 * 24 * 30) => {
  return getSignedUrl(
    getR2(),
    new GetObjectCommand({
      Bucket: requireEnv("R2_BUCKET_NAME", "R2_BUCKET"),
      Key: key,
      ResponseCacheControl: "public, max-age=31536000, immutable",
    }),
    {
      expiresIn,
    }
  )
}

export const GetFromS3 = async (key: string, expiresIn?: number) => {
  const url = await getSignedR2Url(key, expiresIn)

  return { url }
}

export const getObjectContent = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: requireEnv("R2_BUCKET_NAME", "R2_BUCKET"),
    Key: key,
  })
  const response = await getR2().send(command)
  return await response.Body?.transformToString() ?? ""
}

export const listR2Objects = async (prefix: string) => {
  const command = new ListObjectsV2Command({
    Bucket: requireEnv("R2_BUCKET_NAME", "R2_BUCKET"),
    Prefix: prefix,
  })

  const response = await getR2().send(command)

  return (response.Contents ?? [])
    .map((obj) => obj.Key)
    .filter((key): key is string => key !== undefined)
}
