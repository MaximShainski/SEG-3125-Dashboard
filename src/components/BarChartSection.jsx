import  { useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ALL_NUMERIC_METRICS} from '../constants';
const BarChartSection = ({
    evData, selectedBarMetric, setSelectedBarMetric,
    unitSystem, convertValue, getBarYAxisLabel, t, CustomTooltip
}) => {
    // Group data by brand and calculate average
    const aggregateDataByBrand = useCallback((data, currentMetric) => {
        const aggregated = {};
        data.forEach(item => {
            const brandKey = item.brand;
            if (!aggregated[brandKey]) {
                aggregated[brandKey] = {
                    sum: {}, // Stores sums for all metrics
                    count: {}, // Stores counts for all metrics
                    name: brandKey
                };
                // Initialize sums and counts for all numeric metrics
                ALL_NUMERIC_METRICS.forEach(m => {
                    aggregated[brandKey].sum[m] = 0;
                    aggregated[brandKey].count[m] = 0;
                });
            }

            // Accumulate sums and counts for all numeric metrics
            ALL_NUMERIC_METRICS.forEach(m => {
                if (item[m] !== null && item[m] !== undefined) {
                    aggregated[brandKey].sum[m] += item[m];
                    aggregated[brandKey].count[m]++;
                }
            });
        });

        return Object.values(aggregated)
            .map(group => {
                const result = { name: group.name };
                // Calculate average for each metric and add to the result object
                ALL_NUMERIC_METRICS.forEach(m => {
                    result[m] = group.count[m] > 0 ? parseFloat((group.sum[m] / group.count[m]).toFixed(1)) : null;
                });
                // Set the 'value' property for the currently selected bar metric (for chart rendering)
                result.value = result[currentMetric];
                return result;
            })
            .sort((a, b) => {
                // Sort based on the currently selected metric for the bar chart
                if (currentMetric === 'acceleration_0_100_s') {
                    return a.value - b.value;
                }
                return b.value - a.value;
            });
    }, [convertValue]); // Dependency on convertValue for consistency

    // Bar chart data now always aggregates by brand
    const barChartData = aggregateDataByBrand(evData, selectedBarMetric);


    return (
        <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">{t.barChartTitle}</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center space-x-2">
                    <label htmlFor="metric-select" className="font-medium text-gray-700">{t.selectMetric}:</label>
                    <select
                        id="metric-select"
                        value={selectedBarMetric}
                        onChange={(e) => setSelectedBarMetric(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    >
                        <option value="fast_charging_power_kw_dc">{t.fastChargingPowerKwDc}</option>
                        <option value="range_km">{unitSystem === 'metric' ? t.rangeKm : t.rangeMiles}</option>
                        <option value="top_speed_kmh">{unitSystem === 'metric' ? t.topSpeedKmH : t.topSpeedMph}</option>
                        <option value="acceleration_0_100_s">{unitSystem === 'metric' ? t.accelerationS : t.accelerationMph}</option>
                        <option value="battery_capacity_kWh">{t.batteryCapacityKWh}</option>
                        <option value="efficiency_wh_per_km">{unitSystem === 'metric' ? t.efficiencyWhPerKm : t.efficiencyWhPerMile}</option>
                        <option value="torque_nm">{unitSystem === 'metric' ? t.torqueNm : t.torqueLbFt}</option>
                        <option value="towing_capacity_kg">{unitSystem === 'metric' ? t.towingCapacityKg : `${t.towingCapacityKg.replace('(kg)', '(lbs)')}`}</option>
                        <option value="cargo_volume_l">{unitSystem === 'metric' ? t.cargoVolumeL : `${t.cargoVolumeL.replace('(L)', '(cu ft)')}`}</option>
                        <option value="seats">{t.seats}</option>
                        <option value="length_mm">{unitSystem === 'metric' ? t.lengthMm : t.lengthInches}</option>
                        <option value="width_mm">{unitSystem === 'metric' ? t.widthMm : t.widthInches}</option>
                        <option value="height_mm">{unitSystem === 'metric' ? t.heightMm : t.heightInches}</option>
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
                        tick={{ fontSize: 15, fill: '#555' }}
                    />
                    <YAxis
                        label={<text
                            x={-150}
                            y={30} // depends on your chart height
                            transform="rotate(-90)"
                            textAnchor="middle"
                            fill="#3b82f6"
                            fontSize={14}
                            fontWeight="bold"
                            >
                            {getBarYAxisLabel()}
                            </text>}
                        tick={{ fill: '#555' }}
                    />
                    {/* Pass selectedBarMetric and convertValue to CustomTooltip */}
                    <Tooltip content={<CustomTooltip unitSystem={unitSystem} t={t} convertValue={convertValue} selectedBarMetric={selectedBarMetric} />} />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name={t.brand} radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartSection