import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';

const RoomFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-rs-primary-text border-b border-gray-100 pb-4">
        <SlidersHorizontal size={20} className="text-rs-accent" />
        <h2 className="text-lg font-bold">Filters</h2>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-rs-primary-text mb-2">Location</label>
          <input
            type="text"
            name="city"
            value={filters.city || ''}
            onChange={handleChange}
            placeholder="City or Neighborhood"
            className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all text-sm"
          />
        </div>

        {/* Rent Range */}
        <div>
          <label className="block text-sm font-semibold text-rs-primary-text mb-2">Max Rent (₹/mo)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              name="maxRent"
              min="1000"
              max="30000"
              step="500"
              value={filters.maxRent || 30000}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rs-accent"
            />
            <span className="text-sm font-bold text-rs-primary-text w-16 text-right">
              ₹{filters.maxRent || '30000'}
            </span>
          </div>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm font-semibold text-rs-primary-text mb-2">Room Type</label>
          <select
            name="roomType"
            value={filters.roomType || ''}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all text-sm appearance-none"
          >
            <option value="">All Types</option>
            <option value="Single">Single / Private Room</option>
            <option value="Shared">Shared Room</option>
            <option value="Double">Double Room</option>
          </select>
        </div>

        {/* Preferences Toggle group */}
        <div>
          <label className="block text-sm font-semibold text-rs-primary-text mb-3">Preferences</label>
          <div className="flex flex-col gap-3">
            {[
              { id: 'smoking', label: 'Smoking Allowed' },
              { id: 'pets', label: 'Pets Allowed' },
              { id: 'furnished', label: 'Furnished' }
            ].map(pref => (
              <label key={pref.id} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    name={pref.id}
                    checked={filters[pref.id] || false}
                    onChange={(e) => setFilters(prev => ({ ...prev, [pref.id]: e.target.checked }))}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-rs-accent peer-checked:border-rs-accent transition-all"></div>
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm text-rs-secondary-text group-hover:text-rs-primary-text transition-colors">
                  {pref.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        className="w-full mt-8 bg-rs-secondary-bg text-rs-primary-text font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
        onClick={() => setFilters({})}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default RoomFilters;
