import express from 'express';
import { body, validationResult } from 'express-validator';
import { Expense } from '../models/expense.js';
import { Event } from '../models/event.js';
import { BudgetTracking } from '../models/expense.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware for expenses
const validateExpense = [
  body('eventId').notEmpty(),
  body('category').isIn(['Venue', 'Catering', 'Decoration', 'Marketing', 'Staff', 'Equipment', 'Other']),
  body('amount').isFloat({ min: 0 }),
  body('description').notEmpty(),
];

// Get all expenses for a vendor
router.get('/vendor/:vendorId', auth, checkRole(['vendor', 'admin']), async (req, res) => {
  try {
    const expenses = await Expense.find({ vendorId: req.params.vendorId })
      .populate('eventId', 'title date')
      .sort('-date');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get expenses and budget tracking for a specific event
router.get('/event/:eventId', auth, checkRole(['vendor', 'admin']), async (req, res) => {
  try {
    // Fetch the event by ID
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Fetch the budget from the "price" field in the Event model
    const budget = event.price || 0; // Default to 0 if price is missing

    // Fetch all expenses for the event
    const expenses = await Expense.find({ eventId: req.params.eventId }).sort('-date');
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0); // Default to 0 if amount is missing

    // Calculate remaining budget (minimum value is 0)
    const remainingBudget = Math.max(budget - totalExpenses, 0);

    // Determine if the budget is exceeded
    const isOverBudget = remainingBudget === 0 && totalExpenses > 0;

    // Update or create budget tracking data
    let budgetTracking = await BudgetTracking.findOne({ eventId: req.params.eventId });
    if (!budgetTracking) {
      budgetTracking = new BudgetTracking({
        eventId: req.params.eventId,
        totalExpenses,
        remainingBudget,
        isOverBudget,
      });
    } else {
      budgetTracking.totalExpenses = totalExpenses;
      budgetTracking.remainingBudget = remainingBudget;
      budgetTracking.isOverBudget = isOverBudget;
    }
    await budgetTracking.save();

    // Return the response
    res.json({
      expenses,
      totalExpenses,
      budget,
      remainingBudget,
      isOverBudget,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new expense and update budget tracking
router.post('/', auth, checkRole(['vendor', 'admin']), validateExpense, async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, category, amount, description } = req.body;

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Fetch the budget from the "price" field in the Event model
    const originalBudget = event.price || 0; // Default to 0 if price is missing

    // Add the new expense
    const expense = new Expense({
      eventId,
      vendorId: req.user._id,
      category,
      amount,
      description,
    });
    await expense.save();

    // Update budget tracking
    let budgetTracking = await BudgetTracking.findOne({ eventId });
    if (!budgetTracking) {
      // Create a new budget tracking entry if it doesn't exist
      const remainingBudget = Math.max(originalBudget - amount, 0); // Ensure remainingBudget is not negative
      budgetTracking = new BudgetTracking({
        eventId,
        totalExpenses: amount,
        remainingBudget,
        isOverBudget: remainingBudget === 0, // Budget is exceeded if remainingBudget is 0
      });
    } else {
      // Update the existing budget tracking entry
      budgetTracking.totalExpenses += amount;
      budgetTracking.remainingBudget = Math.max(originalBudget - budgetTracking.totalExpenses, 0); // Ensure remainingBudget is not negative
      budgetTracking.isOverBudget = budgetTracking.remainingBudget === 0; // Budget is exceeded if remainingBudget is 0
    }
    await budgetTracking.save();

    res.status(201).json({ expense, budgetTracking });
  } catch (error) {
    console.error('Error in POST /api/finance:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update expense
router.put('/:id', auth, checkRole(['vendor', 'admin']), validateExpense, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (req.user.role === 'vendor' && expense.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    Object.assign(expense, req.body);
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:id', auth, checkRole(['vendor', 'admin']), async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (req.user.role === 'vendor' && expense.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;