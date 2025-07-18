import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {drivetrainColors } from '../constants';

const ScatterPlotSection = ({
    evData, selectedLineModels, handleModelSelection, unitSystem,
    convertValue, t, CustomTooltip
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    
    // Add ref for the search container
    const searchContainerRef = useRef(null);

    // Effect to update search results based on search term
    useEffect(() => {
        if (searchTerm.length === 0) {
            if (isSearchFocused) {
                setSearchResults(evData);
            } else {
                setSearchResults([]);
            }
        } else if (searchTerm.length >= 1) {
            const filtered = evData.filter(d =>
                d.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.brand.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filtered);
        }
    }, [searchTerm, evData, isSearchFocused]);

    // Handle clicks outside the search area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Data for scatter plot, including drivetrain for coloring
    const scatterPlotData = evData
        .filter(d => selectedLineModels.includes(d.model))
        .map(d => ({
            model: d.model,
            brand: d.brand,
            batteryCapacity: d.battery_capacity_kWh,
            efficiency: convertValue('efficiency_wh_per_km', d.efficiency_wh_per_km),
            range: convertValue('range_km', d.range_km),
            drivetrain: d.drivetrain || 'Other',
        }));

    // Custom dot component for scatter plot
    const renderDot = (props) => {
        const { cx, cy, payload } = props;
        const color = drivetrainColors[payload.drivetrain] || drivetrainColors['Other'];
        const radius = Math.max(5, Math.min(20, payload.range / (unitSystem === 'metric' ? 30 : 20)));
        return (
            <circle cx={cx} cy={cy} r={radius} fill={color} stroke="#fff" strokeWidth={1.5} />
        );
    };

    const drivetrainLegendData = Object.keys(drivetrainColors).map(key => ({
        value: t[key.toLowerCase()] || key,
        type: 'circle',
        color: drivetrainColors[key]
    }));

    const xAxisTickFormatter = (value) => {
        return value === 0 ? '0' : `${value} kWh`;
    };

    const yAxisTickFormatter = (value) => {
        return value === 0 ? '0' : `${value} Wh/km`;
    };

    return (
        <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">{t.scatterPlotTitle}</h2>
            <div className="mb-4">
                <label htmlFor="model-search" className="font-medium text-gray-700 block mb-2">{t.selectModels}:</label>
                
                {/* Wrap search input and results in a container with ref */}
                <div ref={searchContainerRef} className="relative">
                    <input
                        type="text"
                        id="model-search"
                        placeholder={t.searchModels}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        // Remove the onBlur handler completely
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out mb-2"
                    />
                    
                    {/* Display search results */}
                    {(isSearchFocused || searchTerm.length > 0) && searchResults.length > 0 && (
                        <div className="max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md bg-white mb-2 absolute z-10 w-full shadow-lg">
                            {searchResults.map(d => (
                                <div
                                    key={d.model}
                                    className={`flex items-center p-1 cursor-pointer hover:bg-gray-100 rounded-md ${selectedLineModels.includes(d.model) ? 'bg-blue-100 font-semibold' : ''}`}
                                    onClick={() => handleModelSelection(d.model)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedLineModels.includes(d.model)}
                                        readOnly
                                        className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        {d.brand} {d.model} <span className="text-gray-500 text-xs">({t.clickToAdd})</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Display "No models found" only if search term is not empty and no results */}
                {searchTerm.length > 0 && searchResults.length === 0 && (
                    <p className="text-sm text-gray-500 mb-2">{t.noModelsFound}</p>
                )}

                {selectedLineModels.length > 0 && (
                    <div className="mb-2">
                        <p className="font-medium text-gray-700 mb-1">{t.selectedModelsForComparison}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedLineModels.map(modelName => {
                                const modelData = evData.find(d => d.model === modelName);
                                return (
                                    <span key={modelName} className="flex items-center bg-blue-200 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {modelData ? `${modelData.brand} ${modelData.model}` : modelName}
                                        <button
                                            onClick={() => handleModelSelection(modelName)}
                                            className="ml-1 text-blue-800 hover:text-blue-900 focus:outline-none"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => handleModelSelection([])}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md shadow-sm transition duration-150 ease-in-out"
                        >
                            {t.clearSelection}
                        </button>
                    </div>
                )}
            </div>
            
            {scatterPlotData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            type="number"
                            dataKey="batteryCapacity"
                            name={t.batteryCapacity}
                            tick={{ fill: '#555' }}
                            tickFormatter={xAxisTickFormatter}
                        />
                        <YAxis
                            type="number"
                            dataKey="efficiency"
                            name={t.efficiencyWhPerKm}
                            label={<text
                                x={-150}
                                y={10}
                                transform="rotate(-90)"
                                textAnchor="middle"
                                fill="#555"
                                fontSize={14}
                                fontWeight="bold"
                                >
                                {t.efficiencyWhPerKm}
                            </text>}
                            tick={{ fill: '#555' }}
                            tickFormatter={yAxisTickFormatter}
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip unitSystem={unitSystem} t={t} convertValue={convertValue} />} />
                        <Legend payload={drivetrainLegendData} />
                        <Scatter name={t.batteryCapacityKWh} data={scatterPlotData} dot={renderDot} />
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

export default ScatterPlotSection;