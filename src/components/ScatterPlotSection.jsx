import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {drivetrainColors } from '../constants';
// Assuming drivetrainColors are imported or defined globally
// const drivetrainColors = { ... };

const ScatterPlotSection = ({
    evData, selectedLineModels, handleModelSelection, unitSystem,
    convertValue, t, CustomTooltip
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Effect to update search results based on search term
    useEffect(() => {
        if (searchTerm.length > 1) { // Only search if more than 1 character
            const filtered = evData.filter(d =>
                d.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.brand.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]); // Clear results if search term is too short
        }
    }, [searchTerm, evData]);

    // Data for scatter plot, including drivetrain for coloring
    const scatterPlotData = evData
        .filter(d => selectedLineModels.includes(d.model))
        .map(d => ({
            model: d.model,
            brand: d.brand, // Pass brand for tooltip
            batteryCapacity: d.battery_capacity_kWh, // X-axis
            efficiency: convertValue('efficiency_wh_per_km', d.efficiency_wh_per_km), // Y-axis
            range: convertValue('range_km', d.range_km), // For dot size
            drivetrain: d.drivetrain || 'Other', // Ensure drivetrain exists for coloring
        }));

    // Custom dot component for scatter plot to apply drivetrain colors and size by range
    const renderDot = (props) => {
        const { cx, cy, payload } = props;
        const color = drivetrainColors[payload.drivetrain] || drivetrainColors['Other'];
        // Scale range to a reasonable dot size (e.g., 50km range = 5px radius, 500km range = 15px radius)
        // Ensure minimum radius to make small points visible
        const radius = Math.max(5, Math.min(20, payload.range / (unitSystem === 'metric' ? 30 : 20))); // Adjust scaling factor as needed
        return (
            <circle cx={cx} cy={cy} r={radius} fill={color} stroke="#fff" strokeWidth={1.5} />
        );
    };

    // Prepare legend data for drivetrains
    const drivetrainLegendData = Object.keys(drivetrainColors).map(key => ({
        value: t[key.toLowerCase()] || key, // Translate drivetrain names
        type: 'circle',
        color: drivetrainColors[key]
    }));

    return (
        <div className="bg-green-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">{t.scatterPlotTitle}</h2>
            <div className="mb-4">
                <label htmlFor="model-search" className="font-medium text-gray-700 block mb-2">{t.selectModels}:</label>
                <input
                    type="text"
                    id="model-search"
                    placeholder={t.searchModels}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out mb-2"
                />
                {searchTerm.length > 1 && searchResults.length > 0 && (
                    <div className="max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md bg-white mb-2">
                        {searchResults.map(d => (
                            <div
                                key={d.model}
                                className={`flex items-center p-1 cursor-pointer hover:bg-gray-100 rounded-md ${selectedLineModels.includes(d.model) ? 'bg-green-100 font-semibold' : ''}`}
                                onClick={() => handleModelSelection(d.model)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedLineModels.includes(d.model)}
                                    readOnly // Checkbox is controlled by onClick of div
                                    className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {d.brand} {d.model} <span className="text-gray-500 text-xs">({t.clickToAdd})</span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                {searchTerm.length > 1 && searchResults.length === 0 && (
                    <p className="text-sm text-gray-500 mb-2">{t.noModelsFound}</p>
                )}

                {selectedLineModels.length > 0 && (
                    <div className="mb-2">
                        <p className="font-medium text-gray-700 mb-1">{t.selectedModelsForComparison}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedLineModels.map(modelName => {
                                const modelData = evData.find(d => d.model === modelName);
                                return (
                                    <span key={modelName} className="flex items-center bg-green-200 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {modelData ? `${modelData.brand} ${modelData.model}` : modelName}
                                        <button
                                            onClick={() => handleModelSelection(modelName)}
                                            className="ml-1 text-green-800 hover:text-green-900 focus:outline-none"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => handleModelSelection([])} // Clear all
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md shadow-sm transition duration-150 ease-in-out"
                        >
                            {t.clearSelection}
                        </button>
                    </div>
                )}
            </div>
            {scatterPlotData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            type="number"
                            dataKey="batteryCapacity"
                            name={t.batteryCapacity}
                            unit=" kWh"
                            label={{ value: t.batteryCapacityKWh, position: 'bottom', offset: 0, fill: '#555' }}
                            tick={{ fill: '#555' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="efficiency"
                            name={t.efficiencyWhPerKm}
                            unit=" Wh/km"
                            label={{ value: t.efficiencyWhPerKm, angle: -90, position: 'insideLeft', fill: '#555' }}
                            tick={{ fill: '#555' }}
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip unitSystem={unitSystem} t={t} convertValue={convertValue} />} />
                        <Legend payload={drivetrainLegendData} />
                        <Scatter name={t.selectedModels} data={scatterPlotData} dot={renderDot} />
                    </ScatterChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-40 bg-gray-100 rounded-md text-gray-500 text-center">
                    {t.noDataSelected}
                </div>
            )}
        </div>
    );
};

export default ScatterPlotSection