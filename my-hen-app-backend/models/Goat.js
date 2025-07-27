const mongoose = require("mongoose");

const GoatSchema = new mongoose.Schema({
  name: String,
  price: Number,
  weight: Number,
  description: String,
  seller: String,
  sellerphone_no: Number,
  location: String,
  image: String
});

module.exports = GoatSchema;
