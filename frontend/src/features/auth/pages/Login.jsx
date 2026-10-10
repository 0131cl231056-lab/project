import React, { useState } from 'react';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import { useAuth } from '../hook/useAuth';

const Login = () => {
  const navigate = useNavigate()
  const {handleLogin} = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
        const user = await handleLogin(formData)
        console.log("logged in successfully", user)
        if (user?.role === 'owner') {
            navigate("/owner/dashboard")
        } else {
            navigate("/")
        }
    }catch(err){
        console.log(err.message)
    }
}

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
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-[#FDFAF6] rounded-full flex items-center justify-center text-[#C27A62] shadow-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l5 3.75v9.75h-10v-9.75l5-3.75z" />
                  <path d="M10 14a2 2 0 100-4 2 2 0 000 4zm4 0a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#4A3B32] tracking-tight">RoomSync</h2>
            <p className="mt-2 text-sm text-[#8B7E74]">Welcome back! Sign in to continue.</p>
          </div>
          <div className="bg-[#FDFAF6] py-10 px-6 shadow-sm rounded-2xl sm:px-10 border border-[#8B7E74]/10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-[#4A3B32] mb-2">Email address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-[#4A3B32] text-sm focus:outline-none focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] transition-colors placeholder-[#8B7E74]/50"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-[#4A3B32]">Password</label>
                  <Link to="/forgot-password" className="text-xs font-medium text-[#C27A62] hover:text-[#4A3B32] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#8B7E74]/20 bg-white text-[#4A3B32] text-sm focus:outline-none focus:border-[#C27A62] focus:ring-1 focus:ring-[#C27A62] transition-colors placeholder-[#8B7E74]/50"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-[#4A3B32] hover:bg-[#4A3B32]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3B32] transition-colors"
                >
                  Sign In
                </button>
              </div>
            </form>
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#8B7E74]/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#FDFAF6] text-[#8B7E74]">or continue with</span>
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
          </div>
          <div className="mt-8 text-center text-sm text-[#8B7E74]">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-[#C27A62] hover:text-[#4A3B32] transition-colors">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login