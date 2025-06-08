import mysql from "mysql";
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "RAY@1234",
    database: process.env.DB_NAME || "exp_criativa",
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL database:', err);
        return;
    }
    console.log('✅ Connected to MySQL database successfully!');
});

// Proper error handling for database disconnections
process.on('SIGINT', () => {
    db.end((err) => {
        console.log('MySQL connection closed');
        process.exit(err ? 1 : 0);
    });
});

export default db;