import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// optional test
pool.on("connect", () => {
  console.log("Database connected (Neon)");
});

export default pool;

// import pg from "pg";

// const { Pool } = pg;

// const pool = new Pool({

//   user: "postgres",

//   host: "localhost",

//   database: "LostFound",

//   password: "",

//   port: 5432

// });

// pool.on("connect", () => {

//   console.log("Local PostgreSQL connected");

// });

// export default pool;