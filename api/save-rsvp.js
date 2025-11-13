// Vercel Serverless Function to save RSVP to JSONBin.io
// This allows centralized storage of RSVPs from all users

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, guests, attending, message } = req.body;

        // Validate required fields
        if (!name || !guests || !attending) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create RSVP entry
        const rsvpEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleString('vi-VN'),
            name: String(name).trim(),
            guests: parseInt(guests) || 1,
            attending: attending,
            message: (message || '').trim()
        };

        // Save to JSONBin.io
        // You need to create a bin at https://jsonbin.io and get your API key
        const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
        const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;

        if (!JSONBIN_API_KEY || !JSONBIN_BIN_ID) {
            // Fallback: return the entry (you can save it manually or use another service)
            return res.status(200).json({ 
                success: true, 
                data: rsvpEntry,
                message: 'RSVP saved (local only - configure JSONBin.io for centralized storage)'
            });
        }

        // Get existing RSVPs from JSONBin.io
        const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });

        let existingRSVPs = [];
        if (getResponse.ok) {
            const binData = await getResponse.json();
            existingRSVPs = binData.record || [];
        }

        // Add new RSVP
        existingRSVPs.push(rsvpEntry);

        // Save back to JSONBin.io
        const putResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(existingRSVPs)
        });

        if (!putResponse.ok) {
            throw new Error('Failed to save to JSONBin.io');
        }

        return res.status(200).json({ 
            success: true, 
            data: rsvpEntry,
            message: 'RSVP saved successfully'
        });

    } catch (error) {
        console.error('Error saving RSVP:', error);
        return res.status(500).json({ 
            error: 'Failed to save RSVP', 
            message: error.message 
        });
    }
}

