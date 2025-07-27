// models/Buffalo.js
const mongoose = require("mongoose");

const buffaloSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  milk_capacity: String, // 🔄 Renamed from MilkCapacity
  seller: String,
  sellerphone_no: String,
  location: String,
  image: String,
});

module.exports = buffaloSchema;
