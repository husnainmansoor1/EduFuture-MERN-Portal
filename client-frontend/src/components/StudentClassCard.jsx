import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical, FiBook, FiUsers, FiLogOut } from "react-icons/fi";
import { IoSparkles, IoTrendingUp } from "react-icons/io5";
import { MdClass, MdArrowForward } from "react-icons/md";
import { HiAcademicCap } from "react-icons/hi";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

import "../styles/ClassCard.css"; // Reuse ClassCard styles for consistency
import { useBackgrounds } from "../context/BackgroundContext";

export default function StudentClassCard({ classData, onLeave }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { getBackground } = useBackgrounds();
  const background = getBackground(classData._id);

  const handleViewClass = () => {
    navigate(`/student/class/${classData._id}`, { state: { classData } });
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleLeave = (e) => {
    e.stopPropagation();
    onLeave(classData._id);
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="group relative w-full max-w-sm mx-auto">
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-75 blur-lg transition-all duration-700 group-hover:duration-200 animate-gradient"></div>
      
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]">
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-transparent to-cyan-500 animate-pulse-slow"></div>
        </div>

        {/* Banner Section */}
        <div className="relative h-48 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transform group-hover:scale-125 transition-transform duration-1000 ease-out"
            style={{ backgroundImage: `url(${background})` }}
          ></div>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Floating Particles Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-float opacity-60"></div>
            <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float animation-delay-1000 opacity-60"></div>
            <div className="absolute bottom-8 left-8 w-1 h-1 bg-pink-400 rounded-full animate-float animation-delay-2000 opacity-60"></div>
          </div>

          {/* Active Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm animate-pulse-slow">
              <IoSparkles className="text-sm animate-spin-slow" />
              <span className="tracking-wider">ENROLLED</span>
            </div>
          </div>

          {/* Menu Button */}
          <div className="absolute top-4 right-4 z-10" ref={menuRef}>
            <button
              onClick={handleMenuClick}
              className="w-10 h-10 bg-black/40 backdrop-blur-xl hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:rotate-90 border border-white/10"
            >
              <FiMoreVertical className="text-lg" />
            </button>

            {showMenu && (
              <div className="absolute top-12 right-0 bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 min-w-[160px] overflow-hidden backdrop-blur-xl animate-fade-in z-50">
                <div
                  className="px-5 py-3.5 text-sm cursor-pointer hover:bg-red-600/20 transition-all flex items-center gap-3 text-red-400 group/item"
                  onClick={handleLeave}
                >
                  <FiLogOut className="group-hover/item:scale-110 transition-transform" />
                  <span className="font-medium">Leave Class</span>
                </div>
              </div>
            )}
          </div>

          {/* Class Title - Bottom of Banner */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <HiAcademicCap className="text-white text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-2xl mb-1 drop-shadow-2xl line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {classData.subject}
                </h3>
                <p className="text-cyan-300 text-sm font-semibold drop-shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  {classData.program}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Room Info */}
            <div className="group/stat bg-gradient-to-br from-purple-600/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg group-hover/stat:scale-110 transition-transform">
                  <FiBook className="text-white text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Room</p>
                  <p className="font-bold text-white text-lg truncate">{classData.room}</p>
                </div>
              </div>
            </div>

            {/* Teacher Info */}
            <div className="group/stat bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center shadow-lg group-hover/stat:scale-110 transition-transform">
                  <FiUsers className="text-white text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Teacher</p>
                  <p className="font-bold text-white text-sm truncate">{classData.teacher?.name || "Unknown"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6"></div>

          {/* Action Button */}
          <button
            className="group/btn relative w-full bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:from-purple-500 hover:via-cyan-500 hover:to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-base transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center gap-3 overflow-hidden"
            onClick={handleViewClass}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
            
            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-3">
              <MdClass className="text-xl group-hover/btn:rotate-12 transition-transform duration-300" />
              <span className="tracking-wide">View Class</span>
              <MdArrowForward className="text-xl group-hover/btn:translate-x-2 transition-transform duration-300" />
            </span>

            {/* Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
          </button>

          {/* Engagement Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <IoTrendingUp className="text-green-400" />
            <span>Active Learning</span>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="h-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 animate-gradient"></div>
      </div>
    </div>
  );
}
