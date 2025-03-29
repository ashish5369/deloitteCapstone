import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Venue', 'Catering', 'Decoration', 'Marketing', 'Staff', 'Equipment', 'Other']
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
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

expenseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Expense = mongoose.model('Expense', expenseSchema);

const budgetTrackingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  totalExpenses: {
    type: Number,
    default: 0,
  },
  remainingBudget: {
    type: Number,
    required: true,
  },
  isOverBudget: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

budgetTrackingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export const BudgetTracking = mongoose.model('BudgetTracking', budgetTrackingSchema);