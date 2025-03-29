import express from 'express';
import { body, validationResult } from 'express-validator';
import { Event } from '../models/event.js';
import { User } from '../models/user.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware for events
const validateEvent = [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('date').isISO8601(),
  body('location').notEmpty(),
  body('capacity').isInt({ min: 1 }),
  body('price').isFloat({ min: 0 })
];

// Get all events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find()
      .populate('vendorId', 'name email')
      .populate('registeredAttendees.userId', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//endpoint to get all users registered in the app
router.get('/users', auth, checkRole(['admin']), async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select('name email role createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all registered vendors
router.get('/vendors', auth, checkRole(['admin']), async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('name email phone createdAt');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get vendor's events
router.get('/vendor', auth, checkRole(['vendor']), async (req, res) => {
  try {
    const events = await Event.find({ vendorId: req.user._id })
      .populate('registeredAttendees.userId', 'name email');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's registered events
router.get('/registered', auth, async (req, res) => {
  try {
    // Ensure `req.user` contains the authenticated user's ID
    const userId = req.user._id;

    // Fetch events where the user is registered
    const events = await Event.find({ 'registeredAttendees.userId': userId })
      .populate('vendorId', 'name email')
      .populate('registeredAttendees.userId', 'name email');

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event (admin or vendor)
router.post('/', auth, checkRole(['admin', 'vendor']), validateEvent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = new Event({
      ...req.body,
      vendorId: req.user._id // Automatically assign vendorId or adminId
    });

    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event
router.put('/:id', auth, checkRole(['admin', 'vendor']), validateEvent, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role === 'vendor' && event.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', auth, checkRole(['admin', 'vendor']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role === 'vendor' && event.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for event
router.post('/:id/register', auth, checkRole(['user']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already registered
    const isRegistered = event.registeredAttendees.some(
      attendee => attendee.userId.toString() === req.user._id.toString()
    );

    if (isRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check capacity
    if (event.registeredAttendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.registeredAttendees.push({ userId: req.user._id });
    await event.save();

    // Add event to user's registered events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { registeredEvents: event._id }
    });

    res.json({ message: 'Successfully registered for event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unregister from event
router.delete('/:id/register', auth, checkRole(['user']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.registeredAttendees = event.registeredAttendees.filter(
      attendee => attendee.userId.toString() !== req.user._id.toString()
    );
    await event.save();

    // Remove event from user's registered events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { registeredEvents: event._id }
    });

    res.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event attendees (admin and vendor only)
router.get('/:id/attendees', auth, checkRole(['admin', 'vendor']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registeredAttendees.userId', 'name email phone');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Vendors can only see attendees for their own events
    if (req.user.role === 'vendor' && event.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these attendees' });
    }

    res.json(event.registeredAttendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;