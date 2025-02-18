import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Charts = ({ data }) => {
    if (!data) return <div>Loading...</div>;

    const lineChartData = {
        labels: data.timeLabels,
        datasets: [{
            label: 'Events per Minute',
            data: data.eventCounts,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const barChartData = {
        labels: Object.keys(data.eventTypes),
        datasets: [{
            label: 'Events by Type',
            data: Object.values(data.eventTypes),
            backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }]
    };

    return (
        <div className="charts">
            <div className="chart">
                <h3>Events Over Time</h3>
                <Line data={lineChartData} />
            </div>
            <div className="chart">
                <h3>Events by Type</h3>
                <Bar data={barChartData} />
            </div>
        </div>
    );
};

export default Charts; 