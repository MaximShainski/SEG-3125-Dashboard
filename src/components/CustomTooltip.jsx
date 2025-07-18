import React from 'react';

const CustomTooltip = ({ active, payload, label, selectedBarMetric, unitSystem, t, convertValue }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        let displayedValue = payload[0].value; // This is the value from the BarChart data
        let unit = '';
        let metricKey = selectedBarMetric;

        // Determine if it's a scatter plot tooltip based on dataKey
        const isScatterPlotTooltip = payload[0].dataKey === 'range' || payload[0].dataKey === 'batteryCapacity' || payload[0].dataKey === 'efficiency';

        // If it's a scatter plot tooltip, use its specific data keys
        if (payload[0].dataKey === 'range') {
            metricKey = 'range_km'; // Treat as range for unit determination
        } else if (payload[0].dataKey === 'batteryCapacity') {
            metricKey = 'battery_capacity_kWh';
        } else if (payload[0].dataKey === 'efficiency') {
            metricKey = 'efficiency_wh_per_km';
        }

        // Apply conversion to displayedValue for the bar chart
        // This is crucial for the bar chart tooltip to show converted values
        if (!isScatterPlotTooltip && typeof convertValue === 'function') { // Defensive check: ensure convertValue is a function
            displayedValue = convertValue(metricKey, displayedValue);
        }

        // Determine the unit based on the metricKey
        switch (metricKey) {
            case 'range_km':
                unit = unitSystem === 'metric' ? ' km' : ' miles';
                break;
            case 'top_speed_kmh':
                unit = unitSystem === 'metric' ? ' km/h' : ' mph';
                break;
            case 'acceleration_0_100_s':
                unit = unitSystem === 'metric' ? ' s' : ' s (0-60 mph)'; // Updated unit for acceleration
                break;
            case 'battery_capacity_kWh':
                unit = ' kWh';
                break;
            case 'efficiency_wh_per_km':
                unit = unitSystem === 'metric' ? ' Wh/km' : ' Wh/mile'; // Updated unit for efficiency
                break;
            case 'torque_nm':
                unit = unitSystem === 'metric' ? ' Nm' : ' lb-ft'; // Updated unit for torque
                break;
            case 'fast_charging_power_kw_dc':
                unit = ' kW DC';
                break;
            case 'towing_capacity_kg':
                unit = unitSystem === 'metric' ? ' kg' : ' lbs';
                break;
            case 'cargo_volume_l':
                unit = unitSystem === 'metric' ? ' L' : ' cu ft';
                break;
            case 'seats':
                unit = ''; // No unit for seats
                break;
            case 'length_mm':
            case 'width_mm':
            case 'height_mm':
                unit = unitSystem === 'metric' ? ' mm' : ' inches';
                break;
            default:
                unit = '';
        }

        // Determine the translated metric name for the bar chart tooltip
        let translatedMetricNameForBarChart = '';
        switch (selectedBarMetric) {
            case 'range_km':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.rangeKm : t.rangeMiles;
                break;
            case 'top_speed_kmh':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.topSpeedKmH : t.topSpeedMph;
                break;
            case 'acceleration_0_100_s':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.accelerationS : t.accelerationMph; // Updated label
                break;
            case 'battery_capacity_kWh':
                translatedMetricNameForBarChart = t.batteryCapacityKWh;
                break;
            case 'efficiency_wh_per_km':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.efficiencyWhPerKm : t.efficiencyWhPerMile; // Updated label
                break;
            case 'torque_nm':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.torqueNm : t.torqueLbFt; // Updated label
                break;
            case 'fast_charging_power_kw_dc':
                translatedMetricNameForBarChart = t.fastChargingPowerKwDc;
                break;
            case 'towing_capacity_kg':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.towingCapacityKg : `${t.towingCapacityKg.replace('(kg)', '(lbs)')}`;
                break;
            case 'cargo_volume_l':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.cargoVolumeL : `${t.cargoVolumeL.replace('(L)', '(cu ft)')}`;
                break;
            case 'seats':
                translatedMetricNameForBarChart = t.seats;
                break;
            case 'length_mm':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.lengthMm : `${t.lengthMm.replace('(mm)', '(inches)')}`;
                break;
            case 'width_mm':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.widthMm : `${t.widthMm.replace('(mm)', '(inches)')}`;
                break;
            case 'height_mm':
                translatedMetricNameForBarChart = unitSystem === 'metric' ? t.heightMm : `${t.heightMm.replace('(mm)', '(inches)')}`;
                break;
            default:
                translatedMetricNameForBarChart = '';
        }


        return (
            <div className="p-2 bg-white border border-gray-300 rounded-md shadow-lg text-sm">
                {/* For Bar Chart Tooltip */}
                {payload[0].dataKey === 'value' && ( // Check if it's the bar chart's data (dataKey 'value' is used for the bar height)
                    <>
                        <p className="font-bold">{data.name}</p> {/* Brand name from bar chart data */}
                        {/* Display the selected bar metric's average, using the correctly translated metric name */}
                        <p>{translatedMetricNameForBarChart}: {displayedValue !== null && displayedValue !== undefined ? displayedValue : 'N/A'}{unit}</p>
                    </>
                )}

                {/* For Scatter Plot Tooltip */}
                {isScatterPlotTooltip && (
                    <>
                        <p className="font-bold">{data.brand} {data.model || label}</p>
                        {data.drivetrain && <p>{t.drivetrain}: {t[data.drivetrain.toLowerCase()] || data.drivetrain}</p>}
                        {/* Battery Capacity and Efficiency are always in metric units */}
                        {data.batteryCapacity !== undefined && <p>{t.batteryCapacity}: {data.batteryCapacity} kWh</p>}
                        {data.efficiency !== undefined && <p>{t.efficiency}: {data.efficiency} Wh/km</p>}
                        {/* Range for scatter plot, converted if unitSystem is imperial */}
                        {data.range !== undefined && <p>{t.range}: {typeof convertValue === 'function' ? convertValue('range_km', data.range) : data.range}{unitSystem === 'metric' ? ' km' : ' miles'}</p>}
                    </>
                )}
            </div>
        );
    }
    return null;
};

export default CustomTooltip