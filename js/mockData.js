// ============================================
// MOCK DATA FOR SMART CITY MONITORING SYSTEM
// ============================================
// This file contains sample data that simulates
// real sensor readings. In production, all data
// would come from the backend API.
// ============================================

// Air Quality Data (Last 7 days)
const airQualityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pm25: [25, 30, 28, 40, 35, 32, 28],
    no2: [35, 42, 38, 52, 48, 45, 40],
    co2: [410, 415, 412, 425, 420, 418, 415]
};

// Noise Data (Last 7 days)
const noiseData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [65, 70, 68, 78, 75, 72, 62],
    peakValues: [78, 85, 82, 92, 88, 85, 75]
};

// Weather Data
const weatherData = {
    temperature: [18, 19, 20, 21, 22, 23, 21],
    humidity: [65, 68, 62, 58, 55, 60, 70],
    windSpeed: [8, 10, 12, 14, 11, 9, 7],
    rainfall: [0, 0, 2.5, 0, 0, 1.2, 3.8]
};

// Traffic Data (vehicle count per hour)
const trafficData = {
    labels: ['00:00', '06:00', '08:00', '12:00', '17:00', '19:00', '23:00'],
    vehicleCount: [50, 200, 850, 620, 1200, 950, 100]
};

// Site-specific data
const siteData = {
    'north': {
        name: 'North Braybrook',
        pm25: 28,
        no2: 42,
        noise: 68,
        status: 'Good'
    },
    'central': {
        name: 'Central Braybrook',
        pm25: 35,
        no2: 48,
        noise: 75,
        status: 'Moderate'
    },
    'south': {
        name: 'South Braybrook',
        pm25: 42,
        no2: 52,
        noise: 78,
        status: 'High'
    },
    'east': {
        name: 'East Braybrook',
        pm25: 30,
        no2: 45,
        noise: 70,
        status: 'Good'
    },
    'west': {
        name: 'West Braybrook',
        pm25: 38,
        no2: 50,
        noise: 72,
        status: 'Moderate'
    }
};

// Pollution thresholds for status determination
const pollutionThresholds = {
    pm25: {
        good: 35,
        moderate: 75,
        high: 115,
        veryHigh: 150
    },
    no2: {
        good: 40,
        moderate: 60,
        high: 80,
        veryHigh: 100
    },
    noise: {
        quiet: 65,
        moderate: 75,
        loud: 85,
        veryLoud: 95
    }
};

// Helper function to get status based on value
function getAirQualityStatus(pm25) {
    if (pm25 <= pollutionThresholds.pm25.good) return 'Good';
    if (pm25 <= pollutionThresholds.pm25.moderate) return 'Moderate';
    if (pm25 <= pollutionThresholds.pm25.high) return 'High';
    return 'Very High';
}

function getNoiseStatus(noise) {
    if (noise <= pollutionThresholds.noise.quiet) return 'Good';
    if (noise <= pollutionThresholds.noise.moderate) return 'Moderate';
    if (noise <= pollutionThresholds.noise.loud) return 'High';
    return 'Very High';
}

// Generate hourly data for detailed charts
function generateHourlyData() {
    const hours = [];
    const pm25Values = [];
    const noiseValues = [];

    for (let i = 0; i < 24; i++) {
        hours.push(i + ':00');
        // Generate realistic variation
        pm25Values.push(Math.floor(20 + Math.random() * 40 + (i % 6) * 2));
        noiseValues.push(Math.floor(60 + Math.random() * 30 + (i % 8) * 2));
    }

    return {
        hours,
        pm25: pm25Values,
        noise: noiseValues
    };
}

// Export all mock data
const mockDataExports = {
    airQualityData,
    noiseData,
    weatherData,
    trafficData,
    siteData,
    pollutionThresholds,
    getAirQualityStatus,
    getNoiseStatus,
    generateHourlyData
};