const Event = require('../models/Event');

const analyticsService = {
    // Create a new event
    async createEvent(eventData) {
        try {
            const event = new Event({
                ...eventData,
                timestamp: new Date()
            });
            return await event.save();
        } catch (error) {
            throw new Error(`Error creating event: ${error.message}`);
        }
    },

    // Get events with filters and pagination
    async getEvents({ page = 1, limit = 10, eventType, userId, startDate, endDate }) {
        try {
            const query = {};
            
            if (eventType) query.eventType = eventType;
            if (userId) query.userId = userId;
            
            if (startDate || endDate) {
                query.timestamp = {};
                if (startDate) query.timestamp.$gte = new Date(startDate);
                if (endDate) query.timestamp.$lte = new Date(endDate);
            }

            const skip = (page - 1) * limit;
            
            const [events, total] = await Promise.all([
                Event.find(query)
                    .sort({ timestamp: -1 })
                    .skip(skip)
                    .limit(limit),
                Event.countDocuments(query)
            ]);

            return {
                data: events,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total
                }
            };
        } catch (error) {
            throw new Error(`Error fetching events: ${error.message}`);
        }
    },

    // Get aggregated analytics data
    async getAggregatedData(timeframe = '5m') {
        try {
            const minutes = parseInt(timeframe);
            const startTime = new Date(Date.now() - minutes * 60 * 1000);

            // Get events in time range
            const events = await Event.find({
                timestamp: { $gte: startTime }
            }).sort({ timestamp: 1 });

            // Generate time labels
            const timeLabels = [];
            const eventCounts = [];
            const eventTypes = {};
            const userCounts = {};

            // Create minute buckets
            for (let i = 0; i < minutes; i++) {
                const time = new Date(startTime.getTime() + i * 60 * 1000);
                timeLabels.push(time.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                }));
                eventCounts[i] = 0;
            }

            // Process events
            events.forEach(event => {
                // Count by minute bucket
                const minuteIndex = Math.floor(
                    (event.timestamp - startTime) / (60 * 1000)
                );
                if (minuteIndex >= 0 && minuteIndex < minutes) {
                    eventCounts[minuteIndex]++;
                }

                // Count by event type
                eventTypes[event.eventType] = (eventTypes[event.eventType] || 0) + 1;

                // Count by user
                userCounts[event.userId] = (userCounts[event.userId] || 0) + 1;
            });

            // Get top users
            const topUsers = Object.entries(userCounts)
                .map(([userId, count]) => ({ userId, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            return {
                timeLabels,
                eventCounts,
                eventTypes,
                topUsers
            };
        } catch (error) {
            throw new Error(`Error getting aggregated data: ${error.message}`);
        }
    }
};

module.exports = analyticsService; 