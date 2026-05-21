import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ images, setImages, maxImages = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    const remainingSlots = maxImages - images.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    const newImages = filesToAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-rs-primary-text mb-2">
        Room Images ({images.length}/{maxImages})
      </label>
      
      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 ${
            isDragging
              ? 'border-rs-accent bg-rs-accent/10'
              : 'border-gray-300 bg-rs-secondary-bg hover:border-rs-accent/50 hover:bg-rs-accent/5'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
            multiple
          />
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-rs-accent">
            <UploadCloud size={32} />
          </div>
          <p className="text-lg font-medium text-rs-primary-text mb-1">
            Click or drag & drop to upload
          </p>
          <p className="text-sm text-rs-secondary-text text-center">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {images.map((img, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={img.preview || img.url}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors transform hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))}
          {/* Placeholder slots */}
          {Array.from({ length: Math.max(0, 3 - images.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300">
              <ImageIcon size={24} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
