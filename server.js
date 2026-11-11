require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Koneksi ke database Replit
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Tes koneksi database
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS waktu"
    );

    res.json({
      status: "Berhasil",
      database: "Terhubung",
      waktu: result.rows[0].waktu
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      status: "Gagal",
      database: "Tidak terhubung"
    });
  }
});

// Menjalankan server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Joose Juice berjalan di port ${PORT}`);
});
