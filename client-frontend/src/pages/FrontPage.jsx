import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FrontPageNavbar from "../components/FrontPageNavbar";
import "../styles/FrontPage.css";

// React Icons
import { FaUsers, FaLock, FaStar, FaRocket, FaGraduationCap } from "react-icons/fa";
import { MdMenuBook, MdSchool, MdDashboard } from "react-icons/md";
import { GiTeacher, GiBrain, GiSpaceship } from "react-icons/gi";
import { IoStatsChart, IoSparkles } from "react-icons/io5";

export default function FrontPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      title: "Smart Classroom",
      desc: "AI-powered classroom management with real-time analytics and automated workflows",
      icon: <GiTeacher className="text-cyan-400" size={32} />,
      gradient: "from-cyan-400 to-blue-500",
      bg: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10"
    },
    {
      title: "Interactive Learning",
      desc: "Engage students with immersive content, quizzes, and collaborative tools",
      icon: <GiBrain className="text-purple-400" size={32} />,
      gradient: "from-purple-400 to-pink-500",
      bg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10"
    },
    {
      title: "Progress Analytics",
      desc: "Track student performance with detailed insights and predictive analytics",
      icon: <IoStatsChart className="text-green-400" size={32} />,
      gradient: "from-green-400 to-emerald-500",
      bg: "bg-gradient-to-br from-green-500/10 to-emerald-500/10"
    },
    {
      title: "Secure Platform",
      desc: "Enterprise-grade security with role-based access and data encryption",
      icon: <FaLock className="text-orange-400" size={32} />,
      gradient: "from-orange-400 to-red-500",
      bg: "bg-gradient-to-br from-orange-500/10 to-red-500/10"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students", icon: <FaGraduationCap /> },
    { number: "5K+", label: "Educators", icon: <GiTeacher /> },
    { number: "98%", label: "Satisfaction Rate", icon: <FaStar /> },
    { number: "24/7", label: "Support", icon: <MdDashboard /> }
  ];

  return (
    <div className="min-h-screen bg-black font-inter overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.15), transparent 50%)`
          }}
        />
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Animated Badge */}
          <div className="inline-flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8 group hover:border-cyan-400/50 transition-all duration-500">
            <IoSparkles className="text-cyan-400 mr-2 animate-pulse" />
            <span className="text-cyan-400 text-sm font-semibold tracking-wide">
              NEXT-GEN LEARNING PLATFORM
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            Learn Without
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Boundaries
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of education with our AI-powered platform that adapts to 
            every learning style and empowers both students and educators.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <button
              onClick={() => navigate("/login")}
              className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-12 py-4 rounded-2xl text-lg font-bold cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25"
            >
              <span className="relative z-10 flex items-center gap-3">
                Launch Platform
                <FaRocket className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            
            <button 
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="group border-2 border-white/20 text-white px-10 py-4 rounded-2xl text-lg font-semibold cursor-pointer transition-all duration-500 hover:border-cyan-400/50 hover:bg-white/5 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                Explore Features
                <MdSchool className="group-hover:scale-110 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-6 h-6 bg-cyan-400 rounded-full opacity-60 animate-pulse" />
        <div className="absolute bottom-40 right-20 w-8 h-8 bg-purple-500 rounded-full opacity-40 animate-bounce delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-green-400 rounded-full opacity-50 animate-ping" />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Revolutionary{" "}
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Powered by cutting-edge technology to transform your educational experience
            </p>
          </div>

          {/* Interactive Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative rounded-3xl p-8 cursor-pointer transition-all duration-700 hover:scale-105 ${
                  activeFeature === index ? 'scale-105' : 'scale-100'
                } ${feature.bg} border border-white/10 backdrop-blur-lg`}
                onMouseEnter={() => setActiveFeature(index)}
                onClick={() => navigate("/login")}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {feature.desc}
                  </p>
                  <div className="flex items-center text-cyan-400 font-semibold opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                    Discover More <GiSpaceship className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Showcase */}
          <div className="text-center">
            <div className="inline-flex items-center gap-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-8 py-6">
              {["AI-Powered", "Real-Time", "Secure", "Scalable"].map((tech, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="font-semibold">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Orb */}
          <div className="w-32 h-32 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mx-auto mb-12 animate-pulse-slow shadow-2xl shadow-cyan-500/25" />
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
            Ready to Transform{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Education?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the revolution and experience the future of learning today
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group relative bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-16 py-5 rounded-2xl text-xl font-bold cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Your Journey
              <FaRocket className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <GiSpaceship className="text-white text-xl" />
              </div>
              <span className="text-2xl font-black text-white">EDU<span className="text-cyan-400">FUTURE</span></span>
            </div>
            
            {/* Tagline */}
            <p className="text-gray-400 text-lg">
              Shaping the future of education, one student at a time
            </p>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <p className="text-gray-500 text-sm">
              &copy; 2024 EduFuture. Revolutionizing learning experiences worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}