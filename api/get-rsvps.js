// Vercel Serverless Function to get all RSVPs from MySQL database

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get database connection from environment variables
        const dbConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
        };

        // Check if database is configured
        if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
            return res.status(200).json({ 
                success: true, 
                data: [],
                message: 'MySQL not configured'
            });
        }

        // Create connection
        const connection = await mysql.createConnection(dbConfig);

        // Get all RSVPs, ordered by newest first
        const [rows] = await connection.execute(
            'SELECT * FROM rsvps ORDER BY created_at DESC'
        );

        await connection.end();

        // Format data
        const rsvps = rows.map(row => ({
            id: row.id,
            timestamp: row.created_at.toISOString(),
            date: new Date(row.created_at).toLocaleString('vi-VN'),
            name: row.name,
            guests: row.guests,
            attending: row.attending,
            message: row.message || ''
        }));

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

