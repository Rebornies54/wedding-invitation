// Vercel Serverless Function to get all RSVPs from Google Sheets

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get Google Apps Script Web App URL from environment
        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

        if (!GOOGLE_SCRIPT_URL) {
            return res.status(200).json({ 
                success: true, 
                data: [],
                message: 'Google Sheets not configured'
            });
        }

        // Get data from Google Apps Script
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get`, {
            method: 'GET'
        });

        console.log('Google Apps Script GET response status:', response.status);
        const responseText = await response.text();
        console.log('Google Apps Script GET response:', responseText);

        if (!response.ok) {
            throw new Error(`Failed to fetch from Google Sheets: ${response.status} - ${responseText}`);
        }

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error(`Invalid response from Google Sheets: ${responseText}`);
        }

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch from Google Sheets');
        }

        // Format data
        const rsvps = (result.data || []).map(row => ({
            id: row.id || Date.now(),
            timestamp: row.timestamp || new Date().toISOString(),
            date: row.date || new Date().toLocaleString('vi-VN'),
            name: row.name || '',
            guests: parseInt(row.guests) || 0,
            attending: row.attending || '',
            message: row.message || ''
        }));

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

