# Real-time Analytics Dashboard

A full-stack application featuring real-time analytics visualization with React and Node.js. The system collects and displays analytics events in real-time using WebSocket connections and provides aggregated data visualization.

## Project Structure

roject/
├── client/ # Frontend React application
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── services/ # API and WebSocket services
│ │ └── styles/ # CSS styles
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
└── server/ # Backend Node.js application
├── src/
│ ├── config/ # Configuration files
│ ├── models/ # MongoDB models
│ ├── routes/ # API routes
│ ├── services/ # Business logic
│ └── websocket/ # WebSocket handlers
├── .env
├── package.json
└── app.js

## Features

### Backend

- Real-time event processing using Socket.IO
- RESTful API endpoints for analytics data
- MongoDB integration with Change Streams
- Event aggregation and statistics
- Configurable time-based analytics

### Frontend

- Real-time event display
- Interactive charts and visualizations
- Responsive dashboard layout
- WebSocket connection management
- Error handling and retry mechanisms
- Connection status indicators

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:bash
   git clone <repository-url>
   cd project

2. Install server dependencies:

```bash
cd server
npm install
```

3. Install client dependencies:

```bash
cd ../client
npm install
```

## Configuration

1. Create a `.env` file in the server directory:

```env
MONGODB_URI=mongodb+srv://your_mongodb_uri
PORT=3000
```

2. Update client configuration if needed:

- Edit `client/vite.config.js` for proxy settings
- Modify `client/src/services/apiService.js` for API endpoints

## Running the Application

1. Start the backend server:

```bash
cd server
npm run dev
```

The server will start on http://localhost:3000

2. Start the frontend development server:

```bash
cd client
npm run dev
```

The client will start on http://localhost:5173

## API Documentation

### Available Endpoints

#### Events API

1. **Create Event (POST /api/analytics)**

```bash
# Basic event
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "page_view",
    "userId": "user123",
    "metadata": {
      "page": "/home",
      "browser": "Chrome"
    }
  }'

# Click event
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "button_click",
    "userId": "user456",
    "metadata": {
      "buttonId": "submit-form",
      "location": "checkout-page"
    }
  }'

# Purchase event
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "purchase",
    "userId": "user789",
    "metadata": {
      "orderId": "ORD-123",
      "amount": 99.99,
      "currency": "USD",
      "items": ["item1", "item2"]
    }
  }'

# Form submission event
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "form_submit",
    "userId": "user101",
    "metadata": {
      "formId": "contact-form",
      "fields": ["name", "email", "message"],
      "success": true
    }
  }'
```

2. **Get Events (GET /api/analytics)**

```bash
# Get all events (paginated)
curl "http://localhost:3000/api/analytics"

# With pagination parameters
curl "http://localhost:3000/api/analytics?page=1&limit=10"

# Filter by event type
curl "http://localhost:3000/api/analytics?eventType=page_view"

# Filter by user ID
curl "http://localhost:3000/api/analytics?userId=user123"

# Filter by date range
curl "http://localhost:3000/api/analytics?startDate=2024-03-01T00:00:00Z&endDate=2024-03-20T23:59:59Z"

# Combined filters
curl "http://localhost:3000/api/analytics?eventType=purchase&userId=user789&page=1&limit=20"
```

3. **Get Aggregated Data (GET /api/analytics/aggregate)**

```bash
# Default 5-minute timeframe
curl "http://localhost:3000/api/analytics/aggregate"

# Custom timeframes
curl "http://localhost:3000/api/analytics/aggregate?timeframe=15m"
curl "http://localhost:3000/api/analytics/aggregate?timeframe=30m"
curl "http://localhost:3000/api/analytics/aggregate?timeframe=60m"
```

### Example Responses

1. **Create Event Response**

```json
{
  "_id": "65f9e8b7c832f6a8b4c0e123",
  "eventType": "page_view",
  "userId": "user123",
  "timestamp": "2024-03-19T12:00:00.000Z",
  "metadata": {
    "page": "/home",
    "browser": "Chrome"
  }
}
```

2. **Get Events Response**

```json
{
  "data": [
    {
      "_id": "65f9e8b7c832f6a8b4c0e123",
      "eventType": "page_view",
      "userId": "user123",
      "timestamp": "2024-03-19T12:00:00.000Z",
      "metadata": {
        "page": "/home",
        "browser": "Chrome"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

3. **Get Aggregated Data Response**

```json
{
  "timeLabels": ["12:00", "12:01", "12:02", "12:03", "12:04"],
  "eventCounts": [5, 8, 3, 12, 6],
  "eventTypes": {
    "page_view": 20,
    "button_click": 14,
    "purchase": 3
  },
  "topUsers": [
    { "userId": "user123", "count": 15 },
    { "userId": "user456", "count": 10 }
  ]
}
```

### Error Responses

```json
{
  "error": "Invalid event data",
  "message": "Event type is required"
}
```

### Query Parameters

1. **Events Endpoint**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `eventType` (optional): Filter by event type
- `userId` (optional): Filter by user ID
- `startDate` (optional): Filter by start date (ISO format)
- `endDate` (optional): Filter by end date (ISO format)

2. **Aggregate Endpoint**

- `timeframe` (optional): Time window in minutes (default: 5m)
  - Supported values: "5m", "15m", "30m", "60m"

### Testing with WebSocket

Using `wscat` for WebSocket testing:

```bash
# Install wscat globally
npm install -g wscat

# Connect to WebSocket server
wscat -c ws://localhost:3000

# Connection will receive real-time events automatically
```

## WebSocket Events

- `analyticsEvent`
