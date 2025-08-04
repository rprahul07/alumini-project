import { BlobServiceClient } from "@azure/storage-blob";

const AZURE_CONN_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_BLOB_CONTAINER;

// Validate env setup
if (!AZURE_CONN_STRING || !CONTAINER_NAME) {
  throw new Error("Azure Storage configuration missing in environment variables.");
}

// Initialize BlobServiceClient and containerClient
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_CONN_STRING);
export const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
