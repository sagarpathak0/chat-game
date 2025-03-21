import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  medications: [
    {
      name: { type: String, required: true },
      dosage: { type: String },
      frequency: { type: String },
      startDate: { type: Date },
      endDate: { type: Date, required: false },
    }
  ],
  history: [
    {
      date: { type: Date, required: true },
      diagnosis: { type: String, required: true },
      treatment: { type: String, required: true },
    }
  ],
  tests: [
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        result: { type: String, required: true },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
