import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  services: [{
    type: String,
    required: true
  }],
  contact: {
    email: String,
    phone: String,
    address: String
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  pricing: {
    type: Map,
    of: Number
  },
  availability: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

vendorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Vendor = mongoose.model('Vendor', vendorSchema);