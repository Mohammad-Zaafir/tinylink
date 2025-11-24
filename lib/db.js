// lib/db.js
import pkg from 'pg';
const { Pool } = pkg;


let pool;


if (!global.pgPool) {
global.pgPool = new Pool({
connectionString: process.env.DATABASE_URL,
// Optional: adjust pool size for serverless
max: 1,
});
}


pool = global.pgPool;


export default {
query: (text, params) => pool.query(text, params),
};