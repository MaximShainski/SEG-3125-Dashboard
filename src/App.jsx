import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, ScatterChart, Scatter // Added ScatterChart and Scatter
} from 'recharts';

import ScatterPlotSection from './components/ScatterPlotSection';
import CustomTooltip from './components/CustomTooltip';
import LanguageAndUnitSelectors from './components/LanguageAndUnitSelectors';
import LineChartSection from './components/LineChartSection';
import BarChartSection from './components/BarChartSection';
import {translations, KM_TO_MILES, KMH_TO_MPH, KG_TO_LBS, L_TO_CU_FT, MM_TO_INCH, NM_TO_LB_FT, ACCEL_100KMH_TO_60MPH_FACTOR, WH_PER_KM_TO_WH_PER_MILE} from './constants';

const App = () => {
    // State for the actual EV data, fetched from CSV
    const [evData, setEvData] = useState([]);
    // State for loading status
    const [loading, setLoading] = useState(true);
    // State for error status
    const [error, setError] = useState(null);

    // State for current language (default to English)
    const [language, setLanguage] = useState('en');
    // State for unit system (default to Metric)
    const [unitSystem, setUnitSystem] = useState('metric');
    // State for the selected metric in the Bar Chart
    const [selectedBarMetric, setSelectedBarMetric] = useState('fast_charging_power_kw_dc');
    // State for selected models in the Scatter Plot
    const [selectedLineModels, setSelectedLineModels] = useState([]);

    // Get translations based on current language
    const t = translations[language];

    // Function to parse CSV string into an array of objects
    const parseCSV = useCallback((csvString) => {
        const lines = csvString.trim().split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(',');
            if (currentLine.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    let value = currentLine[index].trim();
                    // Attempt to convert known numerical fields to numbers
                    switch (header) {
                        case 'top_speed_kmh':
                        case 'battery_capacity_kWh':
                        case 'number_of_cells':
                        case 'torque_nm':
                        case 'efficiency_wh_per_km':
                        case 'range_km':
                        case 'acceleration_0_100_s':
                        case 'fast_charging_power_kw_dc':
                        case 'towing_capacity_kg':
                        case 'cargo_volume_l':
                        case 'seats':
                        case 'length_mm':
                        case 'width_mm':
                        case 'height_mm':
                            row[header] = value !== '' ? parseFloat(value) : null;
                            break;
                        default:
                            row[header] = value;
                    }
                });
                data.push(row);
            }
        }
        return data;
    }, []);

    // Effect to fetch and parse CSV data
    useEffect(() => {
        const fetchEVData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.BASE_URL}ev_specs.csv`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const csvText = await response.text();
                let parsedData = parseCSV(csvText);

                setEvData(parsedData);
                setError(null);
            } catch (e) {
                console.error("Failed to fetch or parse CSV:", e);
                setError(t.errorLoadingData);
            } finally {
                setLoading(false);
            }
        };

        fetchEVData();
    }, [parseCSV, t.errorLoadingData]); // Re-run if parseCSV or error message changes

    // Function to convert values based on unit system
    const convertValue = useCallback((key, value) => {
        if (value === null || value === undefined) return value; // Handle null/undefined values gracefully

        if (unitSystem === 'imperial') {
            switch (key) {
                case 'range_km':
                    return parseFloat((value * KM_TO_MILES).toFixed(1));
                case 'top_speed_kmh':
                    return parseFloat((value * KMH_TO_MPH).toFixed(1));
                case 'towing_capacity_kg':
                    return parseFloat((value * KG_TO_LBS).toFixed(1));
                case 'cargo_volume_l':
                    return parseFloat((value * L_TO_CU_FT).toFixed(1));
                case 'length_mm':
                case 'width_mm':
                case 'height_mm':
                    return parseFloat((value * MM_TO_INCH).toFixed(1));
                case 'torque_nm': // New: Torque conversion
                    return parseFloat((value * NM_TO_LB_FT).toFixed(1));
                case 'efficiency_wh_per_km': // New: Efficiency conversion
                    return parseFloat((value * WH_PER_KM_TO_WH_PER_MILE).toFixed(1));
                case 'acceleration_0_100_s': // New: Acceleration conversion
                    return parseFloat((value * ACCEL_100KMH_TO_60MPH_FACTOR).toFixed(1));
                default:
                    return value;
            }
        }
        return value;
    }, [unitSystem]);

    // Handle model selection for Scatter Plot
    const handleModelSelection = useCallback((model) => {
        setSelectedLineModels(prev => {
            if (Array.isArray(model)) { // Allows clearing all selected models
                return [];
            }
            return prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model];
        });
    }, []);

    // Determine the label for the Y-axis of the Bar Chart based on selected metric and unit system
    const getBarYAxisLabel = useCallback(() => {
        switch (selectedBarMetric) {
            case 'range_km':
                return unitSystem === 'metric' ? t.rangeKm : t.rangeMiles;
            case 'top_speed_kmh':
                return unitSystem === 'metric' ? t.topSpeedKmH : t.topSpeedMph;
            case 'acceleration_0_100_s':
                return unitSystem === 'metric' ? t.accelerationS : t.accelerationMph;
            case 'battery_capacity_kWh':
                return t.batteryCapacityKWh;
            case 'efficiency_wh_per_km':
                return unitSystem === 'metric' ? t.efficiencyWhPerKm : t.efficiencyWhPerMile;
            case 'torque_nm':
                return unitSystem === 'metric' ? t.torqueNm : t.torqueLbFt;
            case 'fast_charging_power_kw_dc':
                return t.fastChargingPowerKwDc;
            case 'towing_capacity_kg':
                return unitSystem === 'metric' ? t.towingCapacityKg : `${t.towingCapacityKg.replace('(kg)', '(lbs)')}`;
            case 'cargo_volume_l':
                return unitSystem === 'metric' ? t.cargoVolumeL : `${t.cargoVolumeL.replace('(L)', '(cu ft)')}`;
            case 'seats':
                return t.seats;
            case 'length_mm':
                return unitSystem === 'metric' ? t.lengthMm : `${t.lengthMm.replace('(mm)', '(inches)')}`;
            case 'width_mm':
                return unitSystem === 'metric' ? t.widthMm : `${t.widthMm.replace('(mm)', '(inches)')}`;
            case 'height_mm':
                return unitSystem === 'metric' ? t.heightMm : `${t.heightMm.replace('(mm)', '(inches)')}`;
            default:
                return '';
        }
    }, [selectedBarMetric, unitSystem, t]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <p className="text-xl font-semibold text-blue-700">{t.loadingData}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
                <p className="text-xl font-semibold text-red-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 font-inter text-gray-800">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-2xl">
                {/* Dashboard Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-blue-800 mb-2">{t.dashboardTitle}</h1>
                    <p className="text-lg text-gray-600 mb-6">{t.dashboardDescription}</p>

                    {/* Language and Unit Selectors Component */}
                    <LanguageAndUnitSelectors
                        language={language}
                        setLanguage={setLanguage}
                        unitSystem={unitSystem}
                        setUnitSystem={setUnitSystem}
                        t={t}
                    />
                </header>

                {/* Charts Section */}
                <section className="grid grid-cols-1 gap-8">
                    {/* Bar Chart Component */}
                    <BarChartSection
                        evData={evData} // Pass fetched data
                        selectedBarMetric={selectedBarMetric}
                        setSelectedBarMetric={setSelectedBarMetric}
                        unitSystem={unitSystem}
                        convertValue={convertValue}
                        getBarYAxisLabel={getBarYAxisLabel}
                        t={t}
                        CustomTooltip={CustomTooltip}
                    />

                    {/* Scatter Plot Component */}
                    <ScatterPlotSection
                        evData={evData} // Pass fetched data
                        selectedLineModels={selectedLineModels}
                        handleModelSelection={handleModelSelection}
                        unitSystem={unitSystem}
                        convertValue={convertValue}
                        t={t}
                        CustomTooltip={CustomTooltip}
                    />
                </section>
            </div>
        </div>
    );
};

export default App;
