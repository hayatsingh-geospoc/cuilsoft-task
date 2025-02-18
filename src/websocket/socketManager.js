const Event = require('../models/Event');

const initializeSocketManager = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected');

        // Set up MongoDB Change Stream
        const changeStream = Event.watch();
        
        changeStream.on('change', (change) => {
            if (change.operationType === 'insert') {
                // Emit new event to all connected clients
                io.emit('analyticsEvent', change.fullDocument);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
            changeStream.close();
        });
    });
};

module.exports = initializeSocketManager; 