const mongoose = require('mongoose');

const activityLogsSchema = new mongoose.Schema({
  
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  module: {
    type: String,
  },
  payload: {
    type: String,
    default: ''
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'DELETE'],
  },
  response: {
    type: String,
    default: ''
  }
});

const ActivityLogs = mongoose.model('ActivityLogs', activityLogsSchema);

module.exports = ActivityLogs;
