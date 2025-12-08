import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(120, 119, 198, 0.3), transparent 50%)`
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
        {/* Animated 404 text */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-10xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse-slow">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-10xl font-black text-white opacity-10 blur-sm">
            404
          </div>
        </div>

        {/* Astronaut illustration */}
        <div className="relative mb-8 w-48 h-48">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce-slow" />
          <div className="absolute top-4 left-4 right-4 bottom-4 bg-slate-800 rounded-full" />
          <div className="absolute top-6 left-6 right-6 bottom-6 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full animate-spin-slow" />
          </div>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full opacity-60 animate-ping" />
        </div>

        {/* Message */}
        <div className="text-center mb-8 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Lost in Space?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            The page you're looking for has drifted into the cosmic void. 
            Don't worry, even astronauts get lost sometimes!
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link 
            to="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <span className="relative z-10">🚀 Launch Back Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="px-8 py-4 border-2 border-purple-500 text-purple-300 rounded-full font-semibold transition-all duration-300 hover:bg-purple-500 hover:text-white hover:scale-105"
          >
            ↶ Previous Orbit
          </button>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-10 left-10 w-8 h-8 bg-cyan-400 rounded-full opacity-40 animate-bounce" />
        <div className="absolute top-20 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-30 animate-bounce delay-75" />
        <div className="absolute bottom-32 right-32 w-4 h-4 bg-yellow-400 rounded-full opacity-50 animate-bounce delay-150" />
      </div>

      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}