const mongoose = require("mongoose");

let tripSchema = new mongoose.Schema({
  user: String,
  tripId: String,
  location: String,
  description: String,
  dateFrom: Date,
  dateTo: Date,
  amount: Number,
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
