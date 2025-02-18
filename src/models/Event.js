const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

// Create indexes for efficient querying
eventSchema.index({ eventType: 1, timestamp: -1 });
eventSchema.index({ userId: 1, timestamp: -1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 