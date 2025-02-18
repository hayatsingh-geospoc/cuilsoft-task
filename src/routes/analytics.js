const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');

// POST /api/analytics - Store new event
router.post('/', async (req, res) => {
    try {
        const event = await analyticsService.createEvent(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analytics - Fetch historical data with filters
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, eventType, userId, startDate, endDate } = req.query;
        const events = await analyticsService.getEvents({
            page: parseInt(page),
            limit: parseInt(limit),
            eventType,
            userId,
            startDate,
            endDate
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/analytics/aggregate - Get aggregated data
router.get('/aggregate', async (req, res) => {
    try {
        const { timeframe = '5m' } = req.query;
        const aggregatedData = await analyticsService.getAggregatedData(timeframe);
        res.json(aggregatedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 