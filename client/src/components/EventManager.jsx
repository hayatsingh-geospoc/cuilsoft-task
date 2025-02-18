import React, { useState } from 'react';
import { apiService } from '../services/apiService';
import '../styles/EventManager.css';

const EventManager = () => {
    const [eventData, setEventData] = useState({
        eventType: '',
        userId: '',
        metadata: {}
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiService.createEvent(eventData);
            alert('Event created successfully!');
            setEventData({
                eventType: '',
                userId: '',
                metadata: {}
            });
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="event-manager">
            <h2>Create New Event</h2>
            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                    <label>Event Type:</label>
                    <input
                        type="text"
                        value={eventData.eventType}
                        onChange={(e) => setEventData({...eventData, eventType: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>User ID:</label>
                    <input
                        type="text"
                        value={eventData.userId}
                        onChange={(e) => setEventData({...eventData, userId: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Metadata (JSON):</label>
                    <textarea
                        value={JSON.stringify(eventData.metadata, null, 2)}
                        onChange={(e) => {
                            try {
                                const metadata = JSON.parse(e.target.value);
                                setEventData({...eventData, metadata});
                            } catch (error) {
                                // Invalid JSON, ignore
                            }
                        }}
                        placeholder="{ 'key': 'value' }"
                    />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>Create Event</button>
            </form>
        </div>
    );
};

export default EventManager; 