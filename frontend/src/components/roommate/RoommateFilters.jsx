import { useState } from 'react';
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp, X } from 'lucide-react';

const RoommateFilters = ({ filters, setFilters, onClear, isMobile, onCloseMobile }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name, val) => {
    setFilters((prev) => ({
      ...prev,
      [name]: prev[name] === val ? '' : val,
    }));
  };

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => v !== undefined && v !== '' && v !== 'any' && k !== 'city' && k !== 'search' && k !== 'sort'
  ).length;

  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 ${isMobile ? 'h-full flex flex-col justify-between' : 'sticky top-24'}`}>
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-center gap-2 text-rs-primary-text">
            <SlidersHorizontal size={20} className="text-rs-accent" />
            <h2 className="text-lg font-bold">Filters</h2>
            {activeCount > 0 && (
              <span className="bg-rs-accent text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-semibold text-rs-accent hover:underline flex items-center gap-1"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
            {isMobile && onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* 1. Location (City) */}
          <div>
            <label className="block text-xs font-bold text-rs-primary-text uppercase tracking-wider mb-2">
              City / Location
            </label>
            <input
              type="text"
              name="city"
              value={filters.city || ''}
              onChange={handleChange}
              placeholder="e.g. Bhopal, Indore, Pune"
              className="w-full px-4 py-2.5 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all text-sm"
            />
          </div>

          {/* 2. Gender */}
          <div>
            <label className="block text-xs font-bold text-rs-primary-text uppercase tracking-wider mb-2">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'any', label: 'Any' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      gender: prev.gender === item.value ? 'any' : item.value,
                    }))
                  }
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    (filters.gender || 'any') === item.value
                      ? 'bg-rs-accent text-white border-rs-accent shadow-xs'
                      : 'bg-rs-secondary-bg text-rs-primary-text border-transparent hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Age Range */}
          <div>
            <label className="block text-xs font-bold text-rs-primary-text uppercase tracking-wider mb-2">
              Age Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="minAge"
                min="18"
                max="80"
                value={filters.minAge || ''}
                onChange={handleChange}
                placeholder="Min (18)"
                className="w-1/2 px-3 py-2 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all text-xs"
              />
              <span className="text-rs-secondary-text text-xs font-bold">to</span>
              <input
                type="number"
                name="maxAge"
                min="18"
                max="80"
                value={filters.maxAge || ''}
                onChange={handleChange}
                placeholder="Max (35)"
                className="w-1/2 px-3 py-2 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all text-xs"
              />
            </div>
          </div>

          {/* 4. Sleep Schedule */}
          <div>
            <label className="block text-xs font-bold text-rs-primary-text uppercase tracking-wider mb-2">
              Sleep Schedule
            </label>
            <select
              name="sleepSchedule"
              value={filters.sleepSchedule || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all text-sm appearance-none"
            >
              <option value="">Any Schedule</option>
              <option value="earlyBird">🌅 Early Bird</option>
              <option value="nightOwl">🌙 Night Owl</option>
            </select>
          </div>

          {/* 5. Diet */}
          <div>
            <label className="block text-xs font-bold text-rs-primary-text uppercase tracking-wider mb-2">
              Dietary Preference
            </label>
            <select
              name="diet"
              value={filters.diet || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all text-sm appearance-none"
            >
              <option value="">Any Diet</option>
              <option value="vegetarian">🥗 Vegetarian</option>
              <option value="non-vegetarian">🥩 Non-Vegetarian</option>
              <option value="vegan">🌱 Vegan</option>
            </select>
          </div>

          {/* 6. Cleanliness */}
          <div>
            <label className="block text-xs font-bold text-rs-primary-text uppercase tracking-wider mb-2">
              Cleanliness Level
            </label>
            <select
              name="cleanliness"
              value={filters.cleanliness || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all text-sm appearance-none"
            >
              <option value="">Any Cleanliness</option>
              <option value="high">🧹 High (Very Neat)</option>
              <option value="medium">✨ Moderate (Standard)</option>
              <option value="low">🛋️ Relaxed</option>
            </select>
          </div>

          {/* Quick Habits: Smoking / Drinking / Pets */}
          <div>
            <label className="block text-xs font-bold text-rs-primary-text uppercase tracking-wider mb-2">
              Habits & Pets
            </label>
            <div className="space-y-2">
              {[
                { name: 'smoking', label: 'Non-Smoker Only', value: 'false' },
                { name: 'drinking', label: 'Non-Drinker Only', value: 'false' },
                { name: 'pets', label: 'Pet Friendly / Has Pets', value: 'true' },
              ].map((item) => {
                const isSelected = filters[item.name] === item.value;
                return (
                  <label
                    key={item.name}
                    className="flex items-center gap-2.5 text-xs text-rs-primary-text cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(item.name, item.value)}
                      className="w-4 h-4 rounded text-rs-accent accent-rs-accent cursor-pointer"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Collapsible Advanced Living Preferences */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-xs font-bold text-rs-accent py-2 focus:outline-none"
            >
              <span>{showAdvanced ? 'Hide Extra Preferences' : 'More Living Preferences'}</span>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvanced && (
              <div className="space-y-4 pt-3 animate-fadeIn">
                {/* Work Schedule */}
                <div>
                  <label className="block text-xs font-semibold text-rs-secondary-text mb-1.5">
                    Work Schedule
                  </label>
                  <select
                    name="workSchedule"
                    value={filters.workSchedule || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none text-xs"
                  >
                    <option value="">Any Work Schedule</option>
                    <option value="workFromHome">🏠 Remote (WFH)</option>
                    <option value="office">🏢 In-Office</option>
                    <option value="hybrid">💻 Hybrid</option>
                    <option value="student">🎓 Student</option>
                  </select>
                </div>

                {/* Study Environment */}
                <div>
                  <label className="block text-xs font-semibold text-rs-secondary-text mb-1.5">
                    Study / Focus Vibe
                  </label>
                  <select
                    name="studyEnvironment"
                    value={filters.studyEnvironment || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none text-xs"
                  >
                    <option value="">Any Environment</option>
                    <option value="quiet">🔇 Quiet</option>
                    <option value="moderate">📖 Moderate</option>
                    <option value="social">👥 Social</option>
                  </select>
                </div>

                {/* Noise Tolerance */}
                <div>
                  <label className="block text-xs font-semibold text-rs-secondary-text mb-1.5">
                    Noise Tolerance
                  </label>
                  <select
                    name="noiseTolerance"
                    value={filters.noiseTolerance || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none text-xs"
                  >
                    <option value="">Any Noise Level</option>
                    <option value="low">🤫 Low (Prefers Silence)</option>
                    <option value="medium">✨ Moderate</option>
                    <option value="high">🔊 High Tolerance</option>
                  </select>
                </div>

                {/* Guest Frequency */}
                <div>
                  <label className="block text-xs font-semibold text-rs-secondary-text mb-1.5">
                    Guest Frequency
                  </label>
                  <select
                    name="guestFrequency"
                    value={filters.guestFrequency || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none text-xs"
                  >
                    <option value="">Any Frequency</option>
                    <option value="rarely">Rarely</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="often">Often</option>
                  </select>
                </div>

                {/* Sharing Preference */}
                <div>
                  <label className="block text-xs font-semibold text-rs-secondary-text mb-1.5">
                    Room Sharing
                  </label>
                  <select
                    name="sharingPreference"
                    value={filters.sharingPreference || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none text-xs"
                  >
                    <option value="">Any Preference</option>
                    <option value="privateRoom">🚪 Private Room</option>
                    <option value="shareRoom">👥 Shared Room</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="pt-5 border-t border-gray-100 flex flex-col gap-2 mt-4 shrink-0">
        {isMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full bg-rs-accent text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm"
          >
            Apply Filters
          </button>
        )}
        <button
          type="button"
          onClick={onClear}
          className="w-full bg-rs-secondary-bg text-rs-primary-text font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-xs flex items-center justify-center gap-1.5"
        >
          <RotateCcw size={14} />
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default RoommateFilters;
