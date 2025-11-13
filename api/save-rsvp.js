// Vercel Serverless Function to save RSVP to Google Sheets
// Using Google Sheets API via Apps Script Web App

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

        // Get Google Apps Script Web App URL from environment
        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

        if (!GOOGLE_SCRIPT_URL) {
            // Fallback: return the entry (local only)
            return res.status(200).json({ 
                success: true, 
                data: {
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    date: new Date().toLocaleString('vi-VN'),
                    name: String(name).trim(),
                    guests: parseInt(guests) || 1,
                    attending: attending,
                    message: (message || '').trim()
                },
                message: 'RSVP saved (local only - configure Google Sheets for centralized storage)'
            });
        }

        // Send data to Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'save',
                data: {
                    name: String(name).trim(),
                    guests: parseInt(guests) || 1,
                    attending: attending,
                    message: (message || '').trim()
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save to Google Sheets');
        }

        const result = await response.json();

        return res.status(200).json({ 
            success: true, 
            data: result.data || {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleString('vi-VN'),
                name: String(name).trim(),
                guests: parseInt(guests) || 1,
                attending: attending,
                message: (message || '').trim()
            },
            message: 'RSVP saved successfully to Google Sheets'
        });

    } catch (error) {
        console.error('Error saving RSVP:', error);
        return res.status(500).json({ 
            error: 'Failed to save RSVP', 
            message: error.message 
        });
    }
}

