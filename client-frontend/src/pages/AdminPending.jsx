import { useLocation, useNavigate } from "react-router-dom";
import { FaClock, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import { IoShieldHalfSharp } from "react-icons/io5";

export default function AdminPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const status = location.state?.status || "pending";

  const handleBackToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative font-sans bg-[#0a0612]">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0612] via-[#0d0d12] to-[#0a0612]"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-[550px] relative z-10">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-10 md:p-12 shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/5 text-center flex flex-col items-center">
          
          {/* Header Icon */}
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(124,58,237,0.15)] animate-pulse">
            {status === "rejected" ? (
              <FaExclamationTriangle size={42} className="text-red-500" />
            ) : (
              <FaClock size={42} className="text-purple-400" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            {status === "rejected" ? "Access Denied" : "Approval Pending"}
          </h2>

          <p className="text-gray-400 text-base font-light leading-relaxed mb-8 max-w-sm">
            {status === "rejected" ? (
              "Your administrator registration request has been rejected by the Super Admin. If you think this is a mistake, please reach out to the administration department."
            ) : (
              "Your admin account registration was submitted successfully. A system administrator must approve your account before you can access the admin dashboard. You will receive access once approved."
            )}
          </p>

          <div className="w-full space-y-4">
            <button
              onClick={handleBackToLogin}
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white py-4 rounded-xl font-bold text-sm tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-gray-600">
            <IoShieldHalfSharp />
            <span>EduFuture Secure Verification System</span>
          </div>

        </div>
      </div>
    </div>
  );
}
