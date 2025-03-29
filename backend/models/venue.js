import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amenities: [{
    type: String
  }],
  pricePerHour: {
    type: Number,
    required: true
  },
  images: [{
    type: String
  }],
  availability: [{
    date: Date,
    isBooked: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

venueSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const Venue = mongoose.model('Venue', venueSchema);