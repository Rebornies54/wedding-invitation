// Vercel Serverless Function to save RSVP to MySQL database
// Using PlanetScale (MySQL-compatible) or any MySQL database

import mysql from 'mysql2/promise';

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
                data: {
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    date: new Date().toLocaleString('vi-VN'),
                    name: String(name).trim(),
                    guests: parseInt(guests) || 1,
                    attending: attending,
                    message: (message || '').trim()
                },
                message: 'RSVP saved (local only - configure MySQL for centralized storage)'
            });
        }

        // Create connection
        const connection = await mysql.createConnection(dbConfig);

        // Insert RSVP into database
        const [result] = await connection.execute(
            `INSERT INTO rsvps (name, guests, attending, message, created_at) 
             VALUES (?, ?, ?, ?, NOW())`,
            [String(name).trim(), parseInt(guests) || 1, attending, (message || '').trim()]
        );

        // Get the inserted record
        const [rows] = await connection.execute(
            'SELECT * FROM rsvps WHERE id = ?',
            [result.insertId]
        );

        await connection.end();

        return res.status(200).json({ 
            success: true, 
            data: {
                id: rows[0].id,
                timestamp: rows[0].created_at.toISOString(),
                date: new Date(rows[0].created_at).toLocaleString('vi-VN'),
                name: rows[0].name,
                guests: rows[0].guests,
                attending: rows[0].attending,
                message: rows[0].message || ''
            },
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

