const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model('Visitor', visitorSchema);
