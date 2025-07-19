export const translations = {
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
        accelerationMph: "Acceleration (0-60 mph in s)",
        batteryCapacityKWh: "Battery Capacity (kWh)",
        efficiencyWhPerKm: "Efficiency (Wh/km)",
        efficiencyWhPerMile: "Efficiency (Wh/mile)",
        torqueNm: "Torque (Nm)",
        torqueLbFt: "Torque (lb-ft)",
        fastChargingPowerKwDc: "Fast Charging Power (kW DC)",
        towingCapacityKg: "Towing Capacity (kg)",
        cargoVolumeL: "Cargo Volume (L)",
        seats: "Seats",
        lengthMm: "Length (mm)",
        widthMm: "Width (mm)",
        heightMm: "Height (mm)",
        lengthInches: "Length (inches)",
        widthInches: "Width (inches)",
        heightInches: "Height (inches)",
        selectUnit: "Select Unit System",
        metric: "Metric",
        imperial: "Imperial",
        barChartTitle: "Average Performance by Brand",
        scatterPlotTitle: "Battery Capacity vs. Efficiency (Top-right = Longest Range)",
        selectModels: "Select Models for Scatter Plot",
        model: "Model",
        batteryCapacity: "Battery Capacity",
        efficiency: "Efficiency",
        range: "Range",
        brand: "Brand",
        modelName: "Model Name",
        value: "Value",
        noDataSelected: "No data selected for the scatter plot. Please select models.",
        selectedModels: "Selected Models",
        drivetrain: "Drivetrain",
        awd: "All-Wheel Drive",
        fwd: "Front-Wheel Drive",
        rwd: "Rear-Wheel Drive",
        loadingData: "Loading EV data...",
        errorLoadingData: "Error loading EV data.",
        searchModels: "Search Models...",
        addSelected: "Add Selected",
        clearSelection: "Clear Selection",
        noModelsFound: "No models found matching your search.",
        selectedModelsForComparison: "Selected Models for Comparison:",
        clickToAdd: "Click to add to comparison"
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
        accelerationMph: "Accélération (0-60 mph en s)",
        batteryCapacityKWh: "Capacité Batterie (kWh)",
        efficiencyWhPerKm: "Efficacité (Wh/km)",
        efficiencyWhPerMile: "Efficacité (Wh/mile)",
        torqueNm: "Couple (Nm)",
        torqueLbFt: "Couple (lb-ft)",
        fastChargingPowerKwDc: "Puissance Charge Rapide (kW CC)",
        towingCapacityKg: "Capacité Remorquage (kg)",
        cargoVolumeL: "Volume Coffre (L)",
        seats: "Places",
        lengthMm: "Longueur (mm)",
        widthMm: "Largeur (mm)",
        heightMm: "Hauteur (mm)",
        lengthInches: "Longueur (pouces)",
        widthInches: "Largeur (pouces)",
        heightInches: "Hauteur (pouces)",
        selectUnit: "Sélectionner le système d'unités",
        metric: "Métrique",
        imperial: "Impérial",
        barChartTitle: "Performance Moyenne par Marque",
        scatterPlotTitle: "Capacité vs. Efficacité (En haut à droite = Plus longue autonomie)",
        selectModels: "Sélectionner des Modèles pour le Nuage de Points",
        model: "Modèle",
        batteryCapacity: "Capacité Batterie",
        efficiency: "Efficacité",
        range: "Autonomie",
        brand: "Marque",
        modelName: "Nom du Modèle",
        value: "Valeur",
        noDataSelected: "Aucune donnée sélectionnée pour le nuage de points. Veuillez sélectionner des modèles.",
        selectedModels: "Modèles Sélectionnés",
        drivetrain: "Transmission",
        awd: "Transmission Intégrale",
        fwd: "Traction Avant",
        rwd: "Propulsion",
        loadingData: "Chargement des données VE...",
        errorLoadingData: "Erreur lors du chargement des données VE."
    }
};

// Conversion factors
export const KM_TO_MILES = 0.621371;
export const KMH_TO_MPH = 0.621371;
export const KG_TO_LBS = 2.20462;
export const L_TO_CU_FT = 0.0353147;
export const MM_TO_INCH = 0.0393701;
export const NM_TO_LB_FT = 0.737562;
export const WH_PER_KM_TO_WH_PER_MILE = 1 / KM_TO_MILES;
export const ACCEL_100KMH_TO_60MPH_FACTOR = 0.9656;

export const drivetrainColors = {
        'AWD': '#8884d8', // Purple
        'FWD': '#82ca9d', // Green
        'RWD': '#ffc658', // Yellow
        'Other': '#cccccc' // Grey for undefined or other
    };

export const ALL_NUMERIC_METRICS = [
    'range_km', 'top_speed_kmh', 'acceleration_0_100_s', 'battery_capacity_kWh',
    'efficiency_wh_per_km', 'torque_nm', 'fast_charging_power_kw_dc',
    'towing_capacity_kg', 'cargo_volume_l', 'seats', 'length_mm', 'width_mm', 'height_mm'
];