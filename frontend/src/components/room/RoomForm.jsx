import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const RoomForm = ({ initialData, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    rent: '',
    city: '',
    state: '',
    address: '',
    roomType: 'Single',
    available: true,
    smoking: false,
    drinking: false,
    diet: 'any',
    gender: 'any',
    cleanliness: 'medium',
    sleepSchedule: 'flexible'
  });
  const [images, setImages] = useState([]); // This would be populated if editing

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, images });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-rs-primary-text border-b border-gray-100 pb-4">Basic Information</h2>
        
        <div>
          <label className="block text-sm font-semibold text-rs-primary-text mb-2">Room Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Spacious Sunny Room in Downtown"
            className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-rs-primary-text mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the room, building, and neighborhood..."
            className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-rs-primary-text mb-2">Monthly Rent ($)</label>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-rs-primary-text mb-2">Room Type</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all appearance-none"
            >
              <option value="Single">Single Room</option>
              <option value="Shared">Shared Room</option>
              <option value="Double">Double Place</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-rs-primary-text border-b border-gray-100 pb-4">Location</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-rs-primary-text mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-rs-primary-text mb-2">State / Province</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-rs-primary-text mb-2">Full Address (Optional)</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Main St, Apt 4B"
            className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <ImageUpload images={images} setImages={setImages} />
      </div>

      {/* Preferences */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <h2 className="text-xl font-bold text-rs-primary-text border-b border-gray-100 pb-4">Preferred Tenant</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-rs-primary-text mb-2">Gender Preference</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all appearance-none text-sm"
            >
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-rs-primary-text mb-2">Diet</label>
            <select
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all appearance-none text-sm"
            >
              <option value="any">Any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="nonveg">Non-Vegetarian</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-rs-primary-text mb-2">Cleanliness</label>
            <select
              name="cleanliness"
              value={formData.cleanliness}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-rs-secondary-bg border border-transparent focus:border-rs-accent focus:bg-white outline-none transition-all appearance-none text-sm"
            >
              <option value="low">Relaxed</option>
              <option value="medium">Medium</option>
              <option value="high">Very Clean</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name="smoking"
                checked={formData.smoking}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-rs-accent peer-checked:border-rs-accent transition-all"></div>
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-rs-secondary-text group-hover:text-rs-primary-text transition-colors">
              Smoking OK
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name="drinking"
                checked={formData.drinking}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-rs-accent peer-checked:border-rs-accent transition-all"></div>
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-rs-secondary-text group-hover:text-rs-primary-text transition-colors">
              Drinking OK
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-rs-accent peer-checked:border-rs-accent transition-all"></div>
              <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-rs-secondary-text group-hover:text-rs-primary-text transition-colors">
              Available Now
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          className="flex-1 py-4 bg-rs-secondary-bg hover:bg-gray-200 text-rs-primary-text font-bold rounded-xl transition-colors"
        >
          Save Draft
        </button>
        <button 
          type="submit"
          className="flex-1 py-4 bg-rs-accent hover:bg-[#a0634f] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          {isEditing ? 'Update Room' : 'Publish Room'}
        </button>
      </div>
    </form>
  );
};

export default RoomForm;
