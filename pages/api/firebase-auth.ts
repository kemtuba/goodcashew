import type { NextApiRequest, NextApiResponse } from 'next';

// Define the shape of the data you expect to send back on success
type SuccessResponseData = {
  userProfile: {
    id: string;
    full_name: string | null;
    role: string | null;
    is_active: boolean | null;
  }
};

// Define the shape of the data for an error response
type ErrorResponseData = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponseData | ErrorResponseData>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { firebase_token } = req.body;

    if (!firebase_token) {
      return res.status(400).json({ error: 'Firebase token not provided.' });
    }
    
    // Determine the Edge Function URL based on the environment
    const edgeFunctionUrl = `${process.env.SUPABASE_URL}/functions/v1/firebase-auth`;

    const edgeRes = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ firebase_token }),
    });

    const data = await edgeRes.json();

    if (!edgeRes.ok) {
      // Forward the error from the edge function
      return res.status(edgeRes.status).json({ error: data.error || 'Edge function returned an error.' });
    }

    // On success, return the data which should match our SuccessResponseData type
    return res.status(200).json(data);

  } catch (err) {
    console.error('Error in API route:', err);
    // Use a safe way to get the error message
    const errorMessage = err instanceof Error ? err.message : 'An internal server error occurred.';
    return res.status(500).json({ error: errorMessage });
  }
}