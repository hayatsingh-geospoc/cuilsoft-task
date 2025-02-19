import React, { useState, useEffect, useCallback } from 'react';
import EventList from './EventList';
import Charts from './Charts';
import socketService from '../services/socketService';
import { apiService } from '../services/apiService';

const Dashboard = () => {
    const [realTimeEvents, setRealTimeEvents] = useState([]);
    const [aggregatedData, setAggregatedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const loadInitialData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Create some initial test events if needed
            await createTestEvents();

            const eventsResponse = await apiService.getEvents({ limit: 10 });
            console.log('Loaded events:', eventsResponse);
            setRealTimeEvents(eventsResponse.data || []);
            
            const aggregatedResponse = await apiService.getAggregatedData();
            console.log('Loaded aggregated data:', aggregatedResponse);
            setAggregatedData(aggregatedResponse);

        } catch (error) {
            console.error('Error loading initial data:', error);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to create test events
    const createTestEvents = async () => {
        try {
            const testEvents = [
                {
                    eventType: 'page_view',
                    userId: 'user123',
                    metadata: { page: '/home', browser: 'Chrome' }
                },
                {
                    eventType: 'button_click',
                    userId: 'user456',
                    metadata: { buttonId: 'submit', location: 'header' }
                }
            ];

            for (const event of testEvents) {
                await apiService.createEvent(event);
            }
        } catch (error) {
            console.error('Error creating test events:', error);
        }
    };

    useEffect(() => {
        // Setup WebSocket connection
        socketService.connect();
        
        socketService.onConnect(() => {
            console.log('WebSocket connected');
            setIsConnected(true);
            loadInitialData();
        });

        socketService.onDisconnect(() => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        });

        // Subscribe to real-time events
        socketService.subscribeToEvents((event) => {
            console.log('Received new event:', event);
            setRealTimeEvents(prev => [event, ...prev].slice(0, 10));
        });

        // Load initial data
        loadInitialData();

        return () => {
            socketService.disconnect();
        };
    }, [loadInitialData]);

    if (loading) {
        return (
            <div className="loading-container">
                <h2>Loading dashboard data...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button className="retry-btn" onClick={loadInitialData}>
                    Retry Loading
                </button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h1>Analytics Dashboard</h1>
            {!isConnected && (
                <div className="connection-warning">
                    Disconnected from server. Attempting to reconnect...
                </div>
            )}
            <div className="dashboard-grid">
                {aggregatedData && <Charts data={aggregatedData} />}
                <EventList events={realTimeEvents} />
            </div>
        </div>
    );
};

export default Dashboard; 