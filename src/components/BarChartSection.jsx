import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const BarChartSection = ({
    initialEVData, selectedBarMetric, setSelectedBarMetric, selectedBrandFilter,
    setSelectedBrandFilter, unitSystem, convertValue, getBarYAxisLabel, t, CustomTooltip
}) => {
    const uniqueBrands = ['All', ...new Set(initialEVData.map(d => d.brand))].sort();

    const barChartData = initialEVData
        .filter(d => selectedBrandFilter === 'All' || d.brand === selectedBrandFilter)
        .map(d => ({
            name: `${d.brand} ${d.model}`,
            value: convertValue(selectedBarMetric, d[selectedBarMetric]),
            originalModel: d.model
        }))
        .sort((a, b) => b.value - a.value);

    return (
        <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">{t.barChartTitle}</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                <div className="flex items-center space-x-2">
                    <label htmlFor="metric-select" className="font-medium text-gray-700">{t.selectMetric}:</label>
                    <select
                        id="metric-select"
                        value={selectedBarMetric}
                        onChange={(e) => setSelectedBarMetric(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    >
                        <option value="range_km">{unitSystem === 'metric' ? t.rangeKm : t.rangeMiles}</option>
                        <option value="top_speed_kmh">{unitSystem === 'metric' ? t.topSpeedKmH : t.topSpeedMph}</option>
                        <option value="acceleration_0_100_s">{t.accelerationS}</option>
                        <option value="battery_capacity_kWh">{t.batteryCapacityKWh}</option>
                        <option value="efficiency_wh_per_km">{t.efficiencyWhPerKm}</option>
                        <option value="torque_nm">{t.torqueNm}</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="brand-filter" className="font-medium text-gray-700">{t.selectBrandFilter}:</label>
                    <select
                        id="brand-filter"
                        value={selectedBrandFilter}
                        onChange={(e) => setSelectedBrandFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    >
                        {uniqueBrands.map(brand => (
                            <option key={brand} value={brand}>
                                {brand === 'All' ? t.allBrands : brand}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={barChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                        tick={{ fontSize: 10, fill: '#555' }}
                    />
                    <YAxis
                        label={{ value: getBarYAxisLabel(), angle: -90, position: 'insideLeft', fill: '#555' }}
                        tick={{ fill: '#555' }}
                    />
                    <Tooltip content={<CustomTooltip selectedBarMetric={selectedBarMetric} unitSystem={unitSystem} t={t} />} />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name={getBarYAxisLabel()} radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartSection