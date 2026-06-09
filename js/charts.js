// ============================================
// CHART INITIALIZATION & VISUALIZATION
// ============================================
// Uses Chart.js library for interactive charts
// ============================================

// Chart color scheme (Environmental theme)
const chartColors = {
    pm25: 'rgb(255, 159, 64)',      // Orange
    no2: 'rgb(54, 162, 235)',       // Blue
    co2: 'rgb(75, 192, 192)',       // Teal
    noise: 'rgb(255, 99, 132)',     // Red
    temperature: 'rgb(255, 159, 64)', // Orange
    gridColor: 'rgba(0, 0, 0, 0.05)',
    textColor: 'rgba(0, 0, 0, 0.7)'
};

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Air Quality Chart
    const airQualityCtx = document.getElementById('airQualityChart');
    if (airQualityCtx) {
        new Chart(airQualityCtx, {
            type: 'line',
            data: {
                labels: airQualityData.labels,
                datasets: [
                    {
                        label: 'PM2.5 (μg/m³)',
                        data: airQualityData.pm25,
                        borderColor: chartColors.pm25,
                        backgroundColor: 'rgba(255, 159, 64, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: chartColors.pm25,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'NO₂ (ppb)',
                        data: airQualityData.no2,
                        borderColor: chartColors.no2,
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: chartColors.no2,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 13,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: chartColors.gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: chartColors.textColor,
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: chartColors.gridColor,
                            drawBorder: false
                        },
                        ticks: {
                            color: chartColors.textColor,
                            font: {
                                size: 12
                            }
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Noise Level Chart
    const noiseCtx = document.getElementById('noiseChart');
    if (noiseCtx) {
        new Chart(noiseCtx, {
            type: 'line',
            data: {
                labels: noiseData.labels,
                datasets: [
                    {
                        label: 'Average Noise Level (dB(A))',
                        data: noiseData.values,
                        borderColor: chartColors.noise,
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: chartColors.noise,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Peak Noise Level (dB(A))',
                        data: noiseData.peakValues,
                        borderColor: 'rgba(244, 67, 54, 0.8)',
                        backgroundColor: 'rgba(244, 67, 54, 0.05)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: 'rgba(244, 67, 54, 0.8)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 13,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: