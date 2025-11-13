// Vercel Serverless Function to get all RSVPs from JSONBin.io

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
        const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;

        if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
            return res.status(200).json({ 
                success: true, 
                data: [],
                message: 'JSONBin.io not configured'
            });
        }

        // Get RSVPs from JSONBin.io
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from JSONBin.io');
        }

        const binData = await response.json();
        const rsvps = binData.record || [];

        // Sort by timestamp (newest first)
        rsvps.sort((a, b) => {
            const timeA = a.id || (a.timestamp ? new Date(a.timestamp).getTime() : 0);
            const timeB = b.id || (b.timestamp ? new Date(b.timestamp).getTime() : 0);
            return timeB - timeA;
        });

        return res.status(200).json({ 
            success: true, 
            data: rsvps,
            count: rsvps.length
        });

    } catch (error) {
        console.error('Error fetching RSVPs:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch RSVPs', 
            message: error.message 
        });
    }
}

