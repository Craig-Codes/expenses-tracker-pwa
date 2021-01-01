const mongoose = require("mongoose");

let receiptSchema = new mongoose.Schema({
  user: String,
  tripId: String,
  image: String,
  price: Number,
  timestamp: String,
});

const Receipt = mongoose.model("Receipt", receiptSchema);
module.exports = Receipt;
