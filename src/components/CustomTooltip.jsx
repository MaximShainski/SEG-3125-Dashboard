const CustomTooltip = ({ active, payload, label, selectedBarMetric, unitSystem, t }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload; // Access the original data point
        let displayedValue = payload[0].value;
        let unit = '';

        // Determine unit based on the selected metric for the bar chart
        if (selectedBarMetric === 'range_km') {
            unit = unitSystem === 'metric' ? ' km' : ' miles';
        } else if (selectedBarMetric === 'top_speed_kmh') {
            unit = unitSystem === 'metric' ? ' km/h' : ' mph';
        } else if (selectedBarMetric === 'acceleration_0_100_s') {
            unit = ' s';
        } else if (selectedBarMetric === 'battery_capacity_kWh') {
            unit = ' kWh';
        } else if (selectedBarMetric === 'efficiency_wh_per_km') {
            unit = ' Wh/km';
        } else if (selectedBarMetric === 'torque_nm') {
            unit = ' Nm';
        } else if (payload[0].dataKey === 'range') { // For line chart range
            unit = unitSystem === 'metric' ? ' km' : ' miles';
        } else if (payload[0].dataKey === 'batteryCapacity') { // For line chart battery capacity
            unit = ' kWh';
        }

        return (
            <div className="p-2 bg-white border border-gray-300 rounded-md shadow-lg text-sm">
                <p className="font-bold">{data.model || label}</p>
                {data.brand && <p>{t.brand}: {data.brand}</p>}
                <p>{payload[0].name}: {displayedValue}{unit}</p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip