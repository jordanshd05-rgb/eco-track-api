// src/routes/docsRoutes.js
const express = require('express');
const router = express.Router();

// Endpoint GET /api/docs - Menampilkan informasi meta API dan daftar rute
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    apiName: "Eco-Track Supply Chain REST API",
    version: "1.0.0",
    description: "Sistem REST API terintegrasi untuk pelacakan logistik pengiriman barang dan audit emisi jejak karbon lingkungan.",
    author: "Kelompok 4 - Integrasi Sistem UTU",
    security: {
      type: "Custom Header Authentication",
      requiredHeader: "x-api-key",
      defaultValue: "ecotrack2026uas"
    },
    availableRoutes: {
      shipments: {
        baseUrl: "/api/shipments",
        description: "Manajemen manifes fisik pengiriman barang",
        supportedOperations: ["GET /", "GET /:id", "POST /", "PUT /:id", "DELETE /:id"]
      },
      tracks: {
        baseUrl: "/api/tracks",
        description: "Audit status emisi lingkungan dan jejak karbon",
        supportedOperations: ["GET /", "GET /:id", "POST /", "PUT /:id", "DELETE /:id"]
      },
      documentation: {
        baseUrl: "/api/docs",
        description: "Menampilkan informasi meta rute API saat ini (Pintu ini bebas dari x-api-key)",
        supportedOperations: ["GET /"]
      }
    }
  });
});

module.exports = router;