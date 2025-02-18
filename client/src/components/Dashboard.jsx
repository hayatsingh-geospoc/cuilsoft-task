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

    const refreshAggregatedData = useCallback(async () => {
        try {
            const data = await apiService.getAggregatedData();
            setAggregatedData(data);
        } catch (error) {
            console.error('Error refreshing aggregated data:', error);
        }
    }, []);

    const handleNewEvent = useCallback((event) => {
        setRealTimeEvents(prev => {
            const newEvents = [event, ...prev].slice(0, 10);
            return newEvents;
        });
        refreshAggregatedData();
    }, [refreshAggregatedData]);

    const loadInitialData = useCallback(async () => {
        try {
            setLoading(true);
            const events = await apiService.getEvents({ limit: 10 });
            setRealTimeEvents(events.data || []);
            
            const aggregated = await apiService.getAggregatedData();
            setAggregatedData(aggregated);
            setError(null);
        } catch (error) {
            console.error('Error loading initial data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Setup WebSocket connection
        socketService.connect();
        
        // Add connection status listeners
        socketService.onConnect(() => {
            setIsConnected(true);
            loadInitialData();
        });

        socketService.onDisconnect(() => {
            setIsConnected(false);
        });

        // Subscribe to events
        socketService.subscribeToEvents(handleNewEvent);

        // Load initial data
        loadInitialData();

        // Cleanup function
        return () => {
            socketService.disconnect();
        };
    }, [handleNewEvent, loadInitialData]);

    // Add periodic data refresh
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            if (isConnected) {
                refreshAggregatedData();
            }
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(refreshInterval);
    }, [isConnected, refreshAggregatedData]);

    if (loading) {
        return (
            <div className="loading-container">
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button 
                    className="retry-btn" 
                    onClick={loadInitialData}
                >
                    Retry
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