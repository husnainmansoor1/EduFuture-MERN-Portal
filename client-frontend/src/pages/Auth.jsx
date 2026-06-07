import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// React Icons
import { FaEnvelope, FaLock, FaUser, FaUserGraduate } from "react-icons/fa";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { IoSchoolSharp } from "react-icons/io5";

export default function Auth({ initialMode = "login" }) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_URL;

  // Form States
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Sync state with URL prop if it changes
  useEffect(() => {
    setIsLogin(initialMode === "login");
    setError(""); // Clear error on mode switch
  }, [initialMode]);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setError("");
    if (isLogin) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, loginForm);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful", { theme: "dark", autoClose: 2000 });

      // Small delay to show success before redirect
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/dashboard/admin");
        } else if (res.data.user.role === "teacher") {
          navigate("/dashboard/teacher");
        } else if (res.data.user.role === "student") {
          navigate("/dashboard/student");
        }
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);

      const adminStatus = err.response?.data?.adminStatus;
      if (adminStatus === "pending" || adminStatus === "rejected") {
        setTimeout(() => {
          navigate("/admin/pending", { state: { status: adminStatus } });
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, registerForm);

      if (res.data.pendingApproval) {
        toast.success("Registration submitted! Pending approval.", {
          theme: "dark",
          position: "top-right",
          autoClose: 2000,
        });

        setTimeout(() => {
          navigate("/admin/pending", { state: { status: "pending" } });
          setRegisterForm({ name: "", email: "", password: "", role: "" }); // Reset form
        }, 1500);
      } else {
        toast.success("Registration successful! Please login.", {
          theme: "dark",
          position: "top-right",
          autoClose: 2000,
        });

        // Switch to login view after success
        setTimeout(() => {
          navigate("/login");
          setRegisterForm({ name: "", email: "", password: "", role: "" }); // Reset form
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative font-sans bg-[#0a0612]">
      
      {/* Subtle Background Effects - Minimal */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0612] via-[#0d0d12] to-[#0a0612]"></div>
      
      {/* Very subtle ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-[1000px] h-[650px] relative z-10" style={{ perspective: '2000px' }}>
        
        {/* 3D Flip Container */}
        <div 
          className="w-full h-full relative transition-transform duration-1000 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isLogin ? 'rotateY(0deg)' : 'rotateY(180deg)'
          }}
        >
          
          {/* LOGIN CARD - Front Side */}
          <div 
            className="absolute inset-0 w-full h-full bg-black/40 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <div className="flex h-full">
              {/* Image Section - Left Side */}
              <div className="hidden md:flex w-[45%] bg-gradient-to-br from-gray-900/60 to-black/60 p-12 border-r border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('../public/login_bg.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 flex flex-col justify-center items-center text-center w-full">
                  <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(124,58,237,0.3)] transform hover:scale-110 transition-transform duration-500">
                    <FaUnlockKeyhole size={40} className="text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Secure Access</h3>
                  <p className="text-gray-400 text-base font-light leading-relaxed">Your gateway to knowledge and growth.</p>
                </div>
              </div>

              {/* Form Section - Right Side */}
              <div className="w-full md:w-[55%] p-12 md:p-16 flex flex-col justify-center relative">
                <div className="mb-12">
                  <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Welcome Back</h2>
                  <p className="text-gray-500 text-base font-light">Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="space-y-5">
                    <div className="relative group transition-all duration-500" style={{ transitionDelay: isLogin ? '100ms' : '0ms' }}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-600 group-focus-within:text-purple-500 transition-colors duration-300" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/30 transition-all outline-none text-gray-200 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm"
                      />
                    </div>

                    <div className="relative group transition-all duration-500" style={{ transitionDelay: isLogin ? '200ms' : '0ms' }}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaLock className="text-gray-600 group-focus-within:text-purple-500 transition-colors duration-300" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        autoComplete="current-password"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/30 transition-all outline-none text-gray-200 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {error && isLogin && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 transition-all duration-500" style={{ transitionDelay: isLogin ? '300ms' : '0ms' }}>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <p className="text-red-300 text-xs">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold text-sm tracking-wide uppercase shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ transitionDelay: isLogin ? '400ms' : '0ms' }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : "Sign In"}
                  </button>

                  <div className="text-center pt-6">
                    <p className="text-gray-500 text-sm">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="text-purple-400 font-semibold hover:text-purple-300 transition-colors focus:outline-none"
                      >
                        Create Account
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* REGISTER CARD - Back Side */}
          <div 
            className="absolute inset-0 w-full h-full bg-black/40 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="flex h-full">
              {/* Form Section - Left Side */}
              <div className="w-full md:w-[55%] p-12 md:p-16 flex flex-col justify-center relative order-1">
                <div className="mb-10">
                  <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Join Us</h2>
                  <p className="text-gray-500 text-base font-light">Create your account and start learning</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div className="relative group transition-all duration-500" style={{ transitionDelay: !isLogin ? '100ms' : '0ms' }}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUser className="text-gray-600 group-focus-within:text-purple-500 transition-colors duration-300" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={registerForm.name}
                        onChange={handleRegisterChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/30 transition-all outline-none text-gray-200 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm"
                      />
                    </div>

                    <div className="relative group transition-all duration-500" style={{ transitionDelay: !isLogin ? '200ms' : '0ms' }}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-600 group-focus-within:text-purple-500 transition-colors duration-300" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/30 transition-all outline-none text-gray-200 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm"
                      />
                    </div>

                    <div className="relative group transition-all duration-500" style={{ transitionDelay: !isLogin ? '300ms' : '0ms' }}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaLock className="text-gray-600 group-focus-within:text-purple-500 transition-colors duration-300" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        autoComplete="new-password"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/30 transition-all outline-none text-gray-200 placeholder:text-gray-600 text-sm font-medium backdrop-blur-sm"
                      />
                    </div>

                    <div className="relative group transition-all duration-500" style={{ transitionDelay: !isLogin ? '400ms' : '0ms' }}>
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUserGraduate className="text-gray-600 group-focus-within:text-purple-500 transition-colors duration-300" />
                      </div>
                      <select
                        name="role"
                        value={registerForm.role}
                        onChange={handleRegisterChange}
                        required
                        className="w-full pl-12 pr-8 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/30 transition-all outline-none text-gray-200 text-sm font-medium cursor-pointer appearance-none backdrop-blur-sm"
                      >
                        <option value="" disabled className="bg-gray-900">Select your Role</option>
                        <option value="student" className="bg-gray-900">Student</option>
                        <option value="teacher" className="bg-gray-900">Teacher</option>
                        <option value="admin" className="bg-gray-900">Admin</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {error && !isLogin && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 transition-all duration-500" style={{ transitionDelay: !isLogin ? '500ms' : '0ms' }}>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <p className="text-red-300 text-xs">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold text-sm tracking-wide uppercase shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ transitionDelay: !isLogin ? '600ms' : '0ms' }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : "Create Account"}
                  </button>

                  <div className="text-center pt-6">
                    <p className="text-gray-500 text-sm">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="text-purple-400 font-semibold hover:text-purple-300 transition-colors focus:outline-none"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              </div>

              {/* Image Section - Right Side */}
              <div className="hidden md:flex w-[45%] bg-gradient-to-bl from-gray-900/60 to-black/60 p-12 border-l border-white/5 relative overflow-hidden order-2">
                <div className="absolute inset-0 bg-[url('../public/register_bg.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 flex flex-col justify-center items-center text-center w-full">
                  <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(99,102,241,0.3)] transform hover:scale-110 transition-transform duration-500">
                    <IoSchoolSharp size={40} className="text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Start Learning</h3>
                  <p className="text-gray-400 text-base font-light leading-relaxed">Begin your educational journey today.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
