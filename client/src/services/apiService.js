const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
    async getEvents(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/analytics?${queryString}`);
        return response.json();
    },

    async getAggregatedData(timeframe = '5m') {
        const response = await fetch(`${API_BASE_URL}/analytics/aggregate?timeframe=${timeframe}`);
        return response.json();
    },

    async createEvent(eventData) {
        const response = await fetch(`${API_BASE_URL}/analytics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
        });
        return response.json();
    }
}; 