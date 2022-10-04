const mongoose = require("mongoose");
const ChartInfoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  shared: {
    type: Boolean,
    required: true
  },
  lastModified: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
});

const ChartDataSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  properties: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  },
});

const ChartInfo = mongoose.model("ChartInfo", ChartInfoSchema, 'chartInfo');
const ChartData = mongoose.model("ChartData", ChartDataSchema, 'chartData');
module.exports = { ChartInfo, ChartData };