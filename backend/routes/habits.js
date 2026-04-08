const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// GET /api/habits — Get all habits for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }

    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ message: 'Server error while fetching habits' });
  }
});

// POST /api/habits — Create a new habit
router.post('/', async (req, res) => {
  try {
    const { name, description, frequency, startDate, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({ message: 'name and userId are required' });
    }

    const habit = await Habit.create({
      name,
      description: description || '',
      frequency: frequency || 'daily',
      startDate: startDate || new Date().toISOString().split('T')[0],
      completedDates: [],
      streak: 0,
      bestStreak: 0,
      userId
    });

    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Server error while creating habit' });
  }
});

// PUT /api/habits/:id — Update a habit
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const habit = await Habit.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json(habit);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ message: 'Server error while updating habit' });
  }
});

// DELETE /api/habits/:id — Delete a habit
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findByIdAndDelete(id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully', id });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Server error while deleting habit' });
  }
});

module.exports = router;
