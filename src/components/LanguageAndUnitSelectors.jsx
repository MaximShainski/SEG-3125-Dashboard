const LanguageAndUnitSelectors = ({ language, setLanguage, unitSystem, setUnitSystem, t }) => (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <div className="flex items-center space-x-2">
            <label htmlFor="language-select" className="font-medium text-gray-700">{t.language}:</label>
            <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
                <option value="en">{t.english}</option>
                <option value="fr">{t.french}</option>
            </select>
        </div>
        <div className="flex items-center space-x-2">
            <label htmlFor="unit-select" className="font-medium text-gray-700">{t.selectUnit}:</label>
            <select
                id="unit-select"
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
                <option value="metric">{t.metric}</option>
                <option value="imperial">{t.imperial}</option>
            </select>
        </div>
    </div>
);

export default LanguageAndUnitSelectors