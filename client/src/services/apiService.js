const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
    async getEvents(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/analytics?${queryString}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetched events:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    },

    async getAggregatedData(timeframe = '5m') {
        try {
            const response = await fetch(`${API_BASE_URL}/analytics/aggregate?timeframe=${timeframe}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetched aggregated data:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error fetching aggregated data:', error);
            throw error;
        }
    },

    async createEvent(eventData) {
        try {
            const response = await fetch(`${API_BASE_URL}/analytics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Created event:', data); // Debug log
            return data;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }
}; 