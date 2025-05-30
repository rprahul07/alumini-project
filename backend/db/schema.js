import pool from './db.js';

export async function createTables() {
    try {
        // Create students table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone_number VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                department VARCHAR(100),
                current_semester VARCHAR(10),
                roll_number VARCHAR(50) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create alumni table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS alumni (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone_number VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                graduation_year INTEGER,
                department VARCHAR(100),
                course VARCHAR(100),
                current_job_title VARCHAR(100),
                company_name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create faculty table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS faculty (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone_number VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                department VARCHAR(100),
                designation VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ All tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
}

export async function dropTables() {
    try {
        await pool.query(`
            DROP TABLE IF EXISTS students CASCADE;
            DROP TABLE IF EXISTS alumni CASCADE;
            DROP TABLE IF EXISTS faculty CASCADE;
        `);
        console.log('✅ All tables dropped successfully');
    } catch (error) {
        console.error('Error dropping tables:', error);
        throw error;
    }
} 