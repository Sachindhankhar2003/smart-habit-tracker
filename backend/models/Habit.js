const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    default: 'daily'
  },
  startDate: {
    type: String
  },
  completedDates: {
    type: [String],
    default: []
  },
  streak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);
