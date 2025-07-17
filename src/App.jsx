import React, { useState, useEffect, useCallback } from 'react';

import LineChartSection from './components/LineChartSection';
import CustomTooltip from './components/CustomTooltip';
import LanguageAndUnitSelectors from './components/LanguageAndUnitSelectors';
import BarChartSection from './components/BarChartSection';

// --- Data and Constants (Could be in a separate 'data.js' or 'constants.js' file) ---

// Mock Data for Electric Vehicles
const initialEVData = [
    { brand: 'Tesla', model: 'Model 3', top_speed_kmh: 225, battery_capacity_kWh: 75, battery_type: 'Li-ion', number_of_cells: 4416, torque_nm: 527, efficiency_wh_per_km: 150, range_km: 560, acceleration_0_100_s: 3.3 },
    { brand: 'Tesla', model: 'Model S', top_speed_kmh: 250, battery_capacity_kWh: 100, battery_type: 'Li-ion', number_of_cells: 7920, torque_nm: 750, efficiency_wh_per_km: 165, range_km: 650, acceleration_0_100_s: 2.5 },
    { brand: 'Porsche', model: 'Taycan', top_speed_kmh: 260, battery_capacity_kWh: 93.4, battery_type: 'Li-ion', number_of_cells: 396, torque_nm: 850, efficiency_wh_per_km: 200, range_km: 450, acceleration_0_100_s: 2.8 },
    { brand: 'Hyundai', model: 'Kona Electric', top_speed_kmh: 167, battery_capacity_kWh: 64, battery_type: 'Li-ion', number_of_cells: 294, torque_nm: 395, efficiency_wh_per_km: 147, range_km: 484, acceleration_0_100_s: 7.6 },
    { brand: 'Nissan', model: 'Leaf', top_speed_kmh: 157, battery_capacity_kWh: 62, battery_type: 'Li-ion', number_of_cells: 288, torque_nm: 340, efficiency_wh_per_km: 170, range_km: 385, acceleration_0_100_s: 6.9 },
    { brand: 'BMW', model: 'i4', top_speed_kmh: 200, battery_capacity_kWh: 83.9, battery_type: 'Li-ion', number_of_cells: 360, torque_nm: 430, efficiency_wh_per_km: 175, range_km: 590, acceleration_0_100_s: 5.7 },
    { brand: 'Audi', model: 'e-tron GT', top_speed_kmh: 245, battery_capacity_kWh: 93.4, battery_type: 'Li-ion', number_of_cells: 396, torque_nm: 630, efficiency_wh_per_km: 205, range_km: 470, acceleration_0_100_s: 4.1 },
    { brand: 'Ford', model: 'Mustang Mach-E', top_speed_kmh: 180, battery_capacity_kWh: 91, battery_type: 'Li-ion', number_of_cells: 376, torque_nm: 580, efficiency_wh_per_km: 180, range_km: 490, acceleration_0_100_s: 4.8 },
    { brand: 'Chevrolet', model: 'Bolt EV', top_speed_kmh: 145, battery_capacity_kWh: 65, battery_type: 'Li-ion', number_of_cells: 288, torque_nm: 360, efficiency_wh_per_km: 160, range_km: 417, acceleration_0_100_s: 6.5 },
    { brand: 'Volkswagen', model: 'ID.4', top_speed_kmh: 160, battery_capacity_kWh: 77, battery_type: 'Li-ion', number_of_cells: 288, torque_nm: 310, efficiency_wh_per_km: 170, range_km: 450, acceleration_0_100_s: 8.5 },
    { brand: 'Kia', model: 'EV6', top_speed_kmh: 185, battery_capacity_kWh: 77.4, battery_type: 'Li-ion', number_of_cells: 384, torque_nm: 605, efficiency_wh_per_km: 168, range_km: 528, acceleration_0_100_s: 5.2 },
    { brand: 'Polestar', model: 'Polestar 2', top_speed_kmh: 205, battery_capacity_kWh: 78, battery_type: 'Li-ion', number_of_cells: 324, torque_nm: 660, efficiency_wh_per_km: 185, range_km: 480, acceleration_0_100_s: 4.7 },
];

// Translation content for English and French
const translations = {
    en: {
        dashboardTitle: "Electric Vehicle Performance Dashboard",
        dashboardDescription: "Explore key specifications of various electric vehicles, including range, acceleration, and battery capacity. Use the filters and language selector to customize your view.",
        language: "Language",
        english: "English",
        french: "French",
        selectMetric: "Select Metric",
        rangeKm: "Range (km)",
        rangeMiles: "Range (miles)",
        topSpeedKmH: "Top Speed (km/h)",
        topSpeedMph: "Top Speed (mph)",
        accelerationS: "Acceleration (0-100 km/h in s)",
        batteryCapacityKWh: "Battery Capacity (kWh)",
        efficiencyWhPerKm: "Efficiency (Wh/km)",
        torqueNm: "Torque (Nm)",
        selectUnit: "Select Unit System",
        metric: "Metric",
        imperial: "Imperial",
        barChartTitle: "Top EV Models by Metric",
        lineChartTitle: "Range vs. Battery Capacity for Selected Models",
        selectModels: "Select Models for Line Chart",
        model: "Model",
        batteryCapacity: "Battery Capacity",
        range: "Range",
        brand: "Brand",
        modelName: "Model Name",
        value: "Value",
        noDataSelected: "No data selected for the line chart. Please select models.",
        selectBrandFilter: "Filter by Brand",
        allBrands: "All Brands",
        selectedModels: "Selected Models"
    },
    fr: {
        dashboardTitle: "Tableau de bord des performances des véhicules électriques",
        dashboardDescription: "Explorez les spécifications clés de divers véhicules électriques, y compris l'autonomie, l'accélération et la capacité de la batterie. Utilisez les filtres et le sélecteur de langue pour personnaliser votre affichage.",
        language: "Langue",
        english: "Anglais",
        french: "Français",
        selectMetric: "Sélectionner la métrique",
        rangeKm: "Autonomie (km)",
        rangeMiles: "Autonomie (miles)",
        topSpeedKmH: "Vitesse Max (km/h)",
        topSpeedMph: "Vitesse Max (mph)",
        accelerationS: "Accélération (0-100 km/h en s)",
        batteryCapacityKWh: "Capacité Batterie (kWh)",
        efficiencyWhPerKm: "Efficacité (Wh/km)",
        torqueNm: "Couple (Nm)",
        selectUnit: "Sélectionner le système d'unités",
        metric: "Métrique",
        imperial: "Impérial",
        barChartTitle: "Meilleurs Modèles de VE par Métrique",
        lineChartTitle: "Autonomie vs. Capacité Batterie pour les Modèles Sélectionnés",
        selectModels: "Sélectionner des Modèles pour le Graphique Linéaire",
        model: "Modèle",
        batteryCapacity: "Capacité Batterie",
        range: "Autonomie",
        brand: "Marque",
        modelName: "Nom du Modèle",
        value: "Valeur",
        noDataSelected: "Aucune donnée sélectionnée pour le graphique linéaire. Veuillez sélectionner des modèles.",
        selectBrandFilter: "Filtrer par Marque",
        allBrands: "Toutes les Marques",
        selectedModels: "Modèles Sélectionnés"
    }
};

// Conversion factors
const KM_TO_MILES = 0.621371;
const KMH_TO_MPH = 0.621371;

const App = () => {
    // State for current language (default to English)
    const [language, setLanguage] = useState('en');
    // State for unit system (default to Metric)
    const [unitSystem, setUnitSystem] = useState('metric');
    // State for the selected metric in the Bar Chart
    const [selectedBarMetric, setSelectedBarMetric] = useState('range_km');
    // State for selected models in the Line Chart
    const [selectedLineModels, setSelectedLineModels] = useState([]);
    // State for brand filter in Bar Chart
    const [selectedBrandFilter, setSelectedBrandFilter] = useState('All');

    // Get translations based on current language
    const t = translations[language];

    // Function to convert values based on unit system
    const convertValue = useCallback((key, value) => {
        if (unitSystem === 'imperial') {
            switch (key) {
                case 'range_km':
                    return parseFloat((value * KM_TO_MILES).toFixed(1));
                case 'top_speed_kmh':
                    return parseFloat((value * KMH_TO_MPH).toFixed(1));
                default:
                    return value;
            }
        }
        return value;
    }, [unitSystem]);

    // Handle model selection for Line Chart
    const handleModelSelection = useCallback((model) => {
        setSelectedLineModels(prev =>
            prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
        );
    }, []); // Empty dependency array means this function is created once

    // Determine the label for the Y-axis of the Bar Chart based on selected metric and unit system
    const getBarYAxisLabel = useCallback(() => {
        switch (selectedBarMetric) {
            case 'range_km':
                return unitSystem === 'metric' ? t.rangeKm : t.rangeMiles;
            case 'top_speed_kmh':
                return unitSystem === 'metric' ? t.topSpeedKmH : t.topSpeedMph;
            case 'acceleration_0_100_s':
                return t.accelerationS;
            case 'battery_capacity_kWh':
                return t.batteryCapacityKWh;
            case 'efficiency_wh_per_km':
                return t.efficiencyWhPerKm;
            case 'torque_nm':
                return t.torqueNm;
            default:
                return '';
        }
    }, [selectedBarMetric, unitSystem, t]);

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
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart Component */}
                    <BarChartSection
                        initialEVData={initialEVData}
                        selectedBarMetric={selectedBarMetric}
                        setSelectedBarMetric={setSelectedBarMetric}
                        selectedBrandFilter={selectedBrandFilter}
                        setSelectedBrandFilter={setSelectedBrandFilter}
                        unitSystem={unitSystem}
                        convertValue={convertValue}
                        getBarYAxisLabel={getBarYAxisLabel}
                        t={t}
                        CustomTooltip={CustomTooltip} // Pass CustomTooltip as a prop
                    />

                    {/* Line Chart Component */}
                    <LineChartSection
                        initialEVData={initialEVData}
                        selectedLineModels={selectedLineModels}
                        handleModelSelection={handleModelSelection}
                        unitSystem={unitSystem}
                        convertValue={convertValue}
                        t={t}
                        CustomTooltip={CustomTooltip} // Pass CustomTooltip as a prop
                    />
                </section>
            </div>
        </div>
    );
};

export default App;
