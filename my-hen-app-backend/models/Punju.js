const mongoose = require("mongoose");

const punjuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  seller: String,
  sellerphone_no: Number,
  location: String,
  image: String,
  battle_range: Number
});

module.exports = punjuSchema;
