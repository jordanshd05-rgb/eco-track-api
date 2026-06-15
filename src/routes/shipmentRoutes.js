// src/routes/shipmentRoutes.js
const express = require('express');
const router = express.Router();
let supplies = require('../data/supplies');

// [READ ALL] - Mengambil semua data pengiriman
router.get('/', (req, res) => {
  res.status(200).json({ success: true, count: supplies.length, data: supplies });
});

// [READ BY ID] - Melihat satu pengiriman spesifik
router.get('/:id', (req, res) => {
  const item = supplies.find(s => s.id === req.params.id);
  if (item) res.status(200).json({ success: true, data: item });
  else res.status(404).json({ success: false, message: "ID Pengiriman tidak ditemukan" });
});

// [CREATE] - Menambahkan manifes pengiriman baru
router.post('/', (req, res) => {
  const { id, namaBarang, vendor, jumlah, lokasiGudang } = req.body;
  if (!id || !namaBarang) return res.status(400).json({ success: false, message: "ID & Nama Barang wajib diisi!" });
  
  const isExist = supplies.some(s => s.id === id);
  if (isExist) return res.status(400).json({ success: false, message: "ID Shipment sudah terdaftar!" });

  const newShipment = { id, namaBarang, vendor, jumlah, lokasiGudang, statusEmisi: "Pending Audit", jejakKarbonKg: 0 };
  supplies.push(newShipment);
  res.status(201).json({ success: true, message: "Sukses membuat data pengiriman baru!", data: newShipment });
});

// [UPDATE] - Mengedit rincian data pengiriman
router.put('/:id', (req, res) => {
  const index = supplies.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    supplies[index] = { ...supplies[index], ...req.body };
    res.status(200).json({ success: true, message: "Data pengiriman sukses diperbarui!", data: supplies[index] });
  } else {
    res.status(404).json({ success: false, message: "Data pengiriman gagal diedit, ID tidak ditemukan" });
  }
});

// [DELETE] - Menghapus data manifes pengiriman
router.delete('/:id', (req, res) => {
  const index = supplies.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    const deleted = supplies.splice(index, 1);
    res.status(200).json({ success: true, message: "Data pengiriman berhasil dihapus!", data: deleted[0] });
  } else {
    res.status(404).json({ success: false, message: "Gagal menghapus, ID tidak ditemukan" });
  }
});

module.exports = router;