import React from 'react';

const Prac = ({ onButtonClick }) => {
  return (
    <div className="lg:min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-[#181818] to-[#616060] p-4">
      <div className="w-full space-y-4">
        <button 
          onClick={() => onButtonClick('imageDisplay')} 
          className="w-full bg-[#616060] text-white py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          FABRIC SETTING
        </button>
        <button 
          onClick={() => onButtonClick('component2')} 
          className="w-full bg-[#616060] text-white py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          3D MODEL SETTING 
        </button>
        <button 
          onClick={() => onButtonClick('component3')} 
          className="w-full bg-[#616060] text-white py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          OPTION
        </button>
        <button 
          onClick={() => onButtonClick('component4')} 
          className="w-full bg-[#616060] text-white py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          PREFERENCE
        </button>
      </div>
    </div>
  );
};

export default Prac;
