// netlify/functions/saveKeyToBlob.js

import { getStore } from '@netlify/blobs';

/**
 * Serverless function to store JSON data in Netlify Blobs
 * Authentication is handled automatically by Netlify when executed as a Function
 *
 * @param {Request} req - Web standard Request object
 * @param {Object} context - Netlify function context
 * @returns {Response} JSON response indicating success or failure
 */
export default async function handler(req, context) {
 // Only allow POST requests
 if (req.method !== 'POST') {
 return Response.json(
 { error: 'Method not allowed' },
 { status: 405 }
 );
 }

 try {
 // Parse request body
 const { data, storeName, key, metadata = null } = await req.json();

 // Validate required fields
 if (!data || !storeName || !key) {
 return Response.json(
 { error: 'Missing required fields: data, storeName, and key are required' },
 { status: 400 }
 );
 }

 // Add timestamp to metadata
 const fullMetadata = {
 timestamp: new Date().toISOString(),
 ...metadata
 };

 // site context and auth handled automatically by Netlify
 const store = getStore(storeName);
 await store.setJSON(key, data, fullMetadata);

 // Return success response
 return Response.json({
 success: true,
 message: 'Data stored successfully',
 storeName: storeName,
 key,
 dataTimestamp: fullMetadata.timestamp,
 dataKeyCount: Object.keys(data).length
 }, { status: 200 });

 } catch (error) {
 console.error('Blob storage error:', error);
 return Response.json(
 { error: error.message || 'Unknown error occurred' },
 { status: 500 }
 );
 }
}