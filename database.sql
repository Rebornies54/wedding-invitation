-- SQL script to create RSVP table for wedding invitation
-- Run this in your MySQL database (PlanetScale Console or MySQL client)

CREATE TABLE IF NOT EXISTS rsvps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  attending VARCHAR(10) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_attending (attending)
);

-- Optional: Insert a test record (you can delete this later)
-- INSERT INTO rsvps (name, guests, attending, message) 
-- VALUES ('Test User', 2, 'yes', 'Test message');

