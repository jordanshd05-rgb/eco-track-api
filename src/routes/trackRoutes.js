// src/routes/trackRoutes.js
const express = require('express');
const router = express.Router();
let supplies = require('../data/supplies');

// [READ ALL] - Melihat semua log audit karbon
router.get('/', (req, res) => {
  const auditLogs = supplies.map(item => ({
    id: item.id,
    namaBarang: item.namaBarang,
    statusEmisi: item.statusEmisi,
    jejakKarbonKg: item.jejakKarbonKg
  }));
  res.status(200).json({ success: true, count: auditLogs.length, data: auditLogs });
});

// [READ BY ID] - Melihat status karbon satu barang spesifik
router.get('/:id', (req, res) => {
  const item = supplies.find(s => s.id === req.params.id);
  if (item) {
    res.status(200).json({
      success: true,
      data: { id: item.id, namaBarang: item.namaBarang, statusEmisi: item.statusEmisi, jejakKarbonKg: item.jejakKarbonKg }
    });
  } else {
    res.status(404).json({ success: false, message: "ID Audit tidak ditemukan" });
  }
});

// [CREATE] - Membuat lembar audit karbon baru untuk barang terdaftar
// [CREATE] - Jalur POST /api/tracks yang sudah diperbaiki sesuai dokumentasi web
router.post('/', (req, res) => {
  const { id, namaBarang, statusEmisi, jejakKarbonKg } = req.body;

  // 1. Saringan Validasi Form (Sesuai Desain Laporan)
  if (!id || !namaBarang) {
    return res.status(400).json({ success: false, error: "VALIDATION_ERROR", message: "ID & Nama Barang wajib disertakan!" });
  }

  // Validasi format ID harus diawali dengan 'TRK-'
  if (!id.startsWith("TRK-")) {
    return res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      message: "ID format must be TRK-XXX and emission output cannot be negative!"
    });
  }

  // Validasi angka emisi tidak boleh minus
  if (jejakKarbonKg !== undefined && jejakKarbonKg < 0) {
    return res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      message: "ID format must be TRK-XXX and emission output cannot be negative!"
    });
  }

  // 2. Cek apakah ID sudah terdaftar di logistik utama (Pintu Shipments)
  const isExist = supplies.some(s => s.id === id);
  if (isExist) {
    return res.status(400).json({ success: false, error: "DUPLICATE_ERROR", message: "ID tersebut sudah memiliki manifes logistik!" });
  }

  // Jika lolos semua saringan, buat data baru
  const newCarbonLog = { 
    id, 
    namaBarang, 
    vendor: "Manual Entry", 
    jumlah: 0, 
    lokasiGudang: "Belum Ditentukan", 
    statusEmisi: statusEmisi || "Pending Audit", 
    jejakKarbonKg: jejakKarbonKg || 0 
  };
  
  supplies.push(newCarbonLog);
  res.status(201).json({ success: true, message: "Data audit karbon baru berhasil direkam!", data: newCarbonLog });
});

// [UPDATE] - Memperbarui atau mengubah status emisi hasil audit
router.put('/:id', (req, res) => {
  const index = supplies.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    const { statusEmisi, jejakKarbonKg } = req.body;
    if (statusEmisi) supplies[index].statusEmisi = statusEmisi;
    if (jejakKarbonKg !== undefined) supplies[index].jejakKarbonKg = jejakKarbonKg;
    
    res.status(200).json({ success: true, message: "Data audit emisi sukses diperbarui!", data: supplies[index] });
  } else {
    res.status(404).json({ success: false, message: "ID tidak ditemukan untuk diperbarui." });
  }
});

// [DELETE] - Menyetel ulang atau menghapus rekaman data karbon (mengembalikan ke default)
router.delete('/:id', (req, res) => {
  const index = supplies.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    supplies[index].statusEmisi = "Pending Audit";
    supplies[index].jejakKarbonKg = 0;
    res.status(200).json({ success: true, message: "Data emisi karbon berhasil di-reset ke nilai default!", data: supplies[index] });
  } else {
    res.status(404).json({ success: false, message: "ID tidak ditemukan." });
  }
});

module.exports = router;