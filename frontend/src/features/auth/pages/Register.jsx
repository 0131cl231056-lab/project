import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';

const Register = () => {
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    contact: '',
    bio: '',
    age: '',
    gender: 'other',
    location: {
      city: '',
      state: ''
    },
    profilePicture: '',
    role: 'user'
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [name]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleToggle = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const submitData = new FormData();

    submitData.append("fullname", formData.fullname);
    submitData.append("email", formData.email);
    submitData.append("password", formData.password);
    submitData.append("contact", formData.contact);
    submitData.append("bio", formData.bio);
    submitData.append("age", formData.age);
    submitData.append("gender", formData.gender);
    submitData.append("role", formData.role);

    submitData.append("city", formData.location.city);
    submitData.append("state", formData.location.state);

    if(formData.profilePicture){
      submitData.append(
        "profilePicture",
        formData.profilePicture
      );
    }

    await handleRegister(submitData);
    navigate("/login")
    console.log("registered successfully");

  } catch(err) {
    console.log(err.message);
  }
};

  return (
    <div className="min-h-screen flex bg-[#F5F2E9] font-sans">
      
      {/* Left Image Section */}
      <div className="hidden lg:flex lg:w-5/12 relative">
        <img 
          className="absolute inset-0 w-full h-full object-cover" 
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" 
          alt="Cozy apartment living room" 
        />
        <div className="absolute inset-0 bg-[#4A3B32]/40 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Join RoomSync</h1>
          <p className="text-lg text-white/90 max-w-md">Tell us a bit about yourself so we can find your ideal roommate match.</p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col flex-1 px-4 py-12 sm:px-6 lg:px-12 xl:px-20 h-screen overflow-y-auto">
        <div className="mx-auto w-full max-w-xl">
          
          <div className="text-center mb-8 pt-4">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-[#FDFAF6] rounded-full flex items-center justify-center text-[#C27A62] shadow-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l5 3.75v9.75h-10v-9.75l5-3.75z" />
                  <path d="M10 14a2 2 0 100-4 2 2 0 000 4zm4 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#4A3B32] tracking-tight">RoomSync</h2>
            <p className="mt-2 text-sm text-[#8B7E74]">Welcome ! Sign up to continue.</p>
          </div>

          <div className="bg-[#FDFAF6] py-10 px-6 shadow-sm rounded-2xl sm:px-12 border border-[#8B7E74]/10 mb-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
              
              {/* Account Type / Role */}
              <div className="flex justify-center mb-8">
                <div className="bg-[#F5F2E9] p-1.5 rounded-full flex gap-1 w-full max-w-sm">
                  <button
                    type="button"
                    onClick={() => handleRoleToggle('user')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
                      formData.role === 'user'
                        ? 'bg-[#4A3B32] text-white shadow-sm'
                        : 'text-[#8B7E74] hover:text-[#4A3B32]'
                    }`}
                  >
                    Roommate Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleToggle('owner')}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
                      formData.role === 'owner'
                        ? 'bg-[#4A3B32] text-white shadow-sm'
                        : 'text-[#8B7E74] hover:text-[#4A3B32]'
                    }`}
                  >
                    Property Owner
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h4 className="text-xs font-semibold text-[#C27A62] uppercase tracking-widest mb-5">Basic Information</h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="fullname"
                      required
                      value={formData.fullname}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-sm focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] outline-none transition placeholder-[#8B7E74]/50 text-[#4A3B32]"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">Email address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-sm focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] outline-none transition placeholder-[#8B7E74]/50 text-[#4A3B32]"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        name="contact"
                        required
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-sm focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] outline-none transition placeholder-[#8B7E74]/50 text-[#4A3B32]"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-sm focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] outline-none transition placeholder-[#8B7E74]/50 text-[#4A3B32]"
                      placeholder="Min. 8 characters"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">Age</label>
                      <input
                        type="number"
                        name="age"
                        required
                        min="18"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-sm focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] outline-none transition placeholder-[#8B7E74]/50 text-[#4A3B32]"
                        placeholder="24"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-sm focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] outline-none transition text-[#4A3B32]"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">About You (Bio)</label>
                    <textarea
                      name="bio"
                      required
                      rows="3"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-sm focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] outline-none transition placeholder-[#8B7E74]/50 text-[#4A3B32]"
                      placeholder="I'm a working professional who loves morning runs..."
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-[#C27A62] uppercase tracking-widest mb-5">Location</h4>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-sm focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] outline-none transition placeholder-[#8B7E74]/50 text-[#4A3B32]"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A3B32] mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.location.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-sm focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] outline-none transition placeholder-[#8B7E74]/50 text-[#4A3B32]"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Photo */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-[#C27A62] uppercase tracking-widest mb-5">Profile Photo</h4>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition cursor-pointer relative overflow-hidden ${
                    isDragging 
                      ? 'border-[#C27A62] bg-[#C27A62]/10' 
                      : 'border-[#8B7E74]/20 bg-[#F5F2E9] hover:bg-[#8B7E74]/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {previewImage ? (
                    <div className="relative w-full flex flex-col items-center justify-center">
                      <img src={previewImage} alt="Profile Preview" className="h-32 w-32 object-cover rounded-full border-4 border-white shadow-md mb-4" />
                      <div className="flex text-sm text-[#8B7E74] justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#C27A62] hover:text-[#4A3B32] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#C27A62]">
                          <span>Change photo</span>
                          <input id="file-upload" name="profilePicture" type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files[0])} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-[#8B7E74]/50" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-[#8B7E74] justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#C27A62] hover:text-[#4A3B32] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#C27A62]">
                          <span>Upload a file</span>
                          <input id="file-upload" name="profilePicture" type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files[0])} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-[#8B7E74]/80">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-[#4A3B32] hover:bg-[#4A3B32]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3B32] transition-colors"
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#8B7E74]/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#FDFAF6] text-[#8B7E74]">or sign up with</span>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-[#8B7E74]/20 rounded-lg shadow-sm bg-white text-sm font-medium text-[#4A3B32] hover:bg-[#F5F2E9] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-[#8B7E74]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#C27A62] hover:text-[#4A3B32] transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
