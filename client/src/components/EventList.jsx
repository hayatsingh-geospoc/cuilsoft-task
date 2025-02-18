import React from 'react';
import '../styles/EventList.css';

const EventList = ({ events }) => {
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatMetadata = (metadata) => {
        if (Object.keys(metadata).length === 0) return '-';
        return Object.entries(metadata)
            .map(([key, value]) => {
                if (typeof value === 'object') {
                    return `${key}: ${JSON.stringify(value)}`;
                }
                return `${key}: ${value}`;
            })
            .join(', ');
    };

    return (
        <div className="event-list-container">
            <h2>Real-time Events</h2>
            <div className="table-container">
                <table className="events-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Event Type</th>
                            <th>User ID</th>
                            <th>Metadata</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-events">
                                    No events to display
                                </td>
                            </tr>
                        ) : (
                            events.map((event, index) => (
                                <tr key={event._id || index}>
                                    <td>{formatTimestamp(event.timestamp)}</td>
                                    <td>
                                        <span className={`event-type ${event.eventType}`}>
                                            {event.eventType}
                                        </span>
                                    </td>
                                    <td>{event.userId}</td>
                                    <td className="metadata-cell">
                                        <div className="metadata-content">
                                            {formatMetadata(event.metadata)}
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className="view-details-btn"
                                            onClick={() => alert(JSON.stringify(event, null, 2))}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventList; 