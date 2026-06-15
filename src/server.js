// src/server.js
const express = require('express');
const app = express();
const port = 3001; // Pastikan port sesuai yang kamu pakai

const loggerMiddleware = require('./middleware/logger');
const apiKeyMiddleware = require('./middleware/apiKey');

// Import 2 rute baru kita yang sudah di-split
const shipmentRoutes = require('./routes/shipmentRoutes');
const trackRoutes = require('./routes/trackRoutes');

app.use(express.json());
app.use(loggerMiddleware);

// --- INDUK ROOT PATH (TAMPILAN DATA BANYAK) ---
app.get('/', (req, res) => {
  const dataSuplai = require('./data/supplies'); 
  
  res.status(200).json({
    status: "Online",
    service: "Eco-Track Gateway Server",
    version: "1.0.0",
    course: "Integrasi Sistem - Tugas Akhir UAS",
    institution: "Universitas Teuku Umar (UTU)",
    developer: "Kelompok 2 (Prodi TIF)",
    endpoints_available: {
      shipments: {
        path: "/api/shipments",
        methods: ["GET", "POST"],
        description: "Manajemen manifes dan pengiriman logistik ramah lingkungan"
      },
      carbon_tracking: {
        path: "/api/tracks",
        methods: ["GET", "PUT"],
        description: "Audit emisi karbon dan pelacakan status keberlanjutan supply chain"
      }
    },
    security_policy: "All business endpoints require a valid 'x-api-key' in request headers",
    active_records_count: dataSuplai.length,
    live_database_snapshot: dataSuplai 
  });
});

// Registrasi endpoint ber-middleware API Key
app.use('/api/shipments', apiKeyMiddleware, shipmentRoutes); 
app.use('/api/tracks', apiKeyMiddleware, trackRoutes);       

app.listen(port, () => {
  console.log(`================================================================`);
  console.log(`🚀 Server Eco-Track Gateway Aktif di http://localhost:${port}`);
  console.log(`================================================================`);
});