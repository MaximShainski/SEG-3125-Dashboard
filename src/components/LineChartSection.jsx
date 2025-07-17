import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';

// Line Chart Section Component (Could be in 'components/LineChartSection.jsx')
const LineChartSection = ({
    initialEVData, selectedLineModels, handleModelSelection, unitSystem,
    convertValue, t, CustomTooltip
}) => {
    const lineChartData = initialEVData
        .filter(d => selectedLineModels.includes(d.model))
        .map(d => ({
            model: d.model,
            batteryCapacity: d.battery_capacity_kWh,
            range: convertValue('range_km', d.range_km)
        }))
        .sort((a, b) => a.batteryCapacity - b.batteryCapacity);

    return (
        <div className="bg-green-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 text-center">{t.lineChartTitle}</h2>
            <div className="mb-4">
                <label htmlFor="model-select-line" className="font-medium text-gray-700 block mb-2">{t.selectModels}:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-md bg-white">
                    {initialEVData.map(d => (
                        <div key={d.model} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`model-${d.model}`}
                                checked={selectedLineModels.includes(d.model)}
                                onChange={() => handleModelSelection(d.model)}
                                className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                            />
                            <label htmlFor={`model-${d.model}`} className="ml-2 text-sm text-gray-700">
                                {d.brand} {d.model}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {lineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                        data={lineChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="batteryCapacity"
                            label={{ value: t.batteryCapacityKWh, position: 'bottom', offset: 0, fill: '#555' }}
                            tick={{ fill: '#555' }}
                        />
                        <YAxis
                            label={{ value: (unitSystem === 'metric' ? t.rangeKm : t.rangeMiles), angle: -90, position: 'insideLeft', fill: '#555' }}
                            tick={{ fill: '#555' }}
                        />
                        <Tooltip content={<CustomTooltip selectedBarMetric="range_km" unitSystem={unitSystem} t={t} />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="range"
                            stroke="#22c55e"
                            activeDot={{ r: 8 }}
                            name={unitSystem === 'metric' ? t.rangeKm : t.rangeMiles}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-40 bg-gray-100 rounded-md text-gray-500 text-center">
                    {t.noDataSelected}
                </div>
            )}
        </div>
    );
};

export default LineChartSection