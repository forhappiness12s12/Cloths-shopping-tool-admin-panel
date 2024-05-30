import React from 'react';

const Prac = () => {
  return (
    <div className="dropdown z-10 ">
                <label htmlFor="dropdown" className="dropdown-btn  opacity-80">
                    {/* <span className="flex justify-center">{sharedState.Productype}</span> */}
                    <span className="arrow"></span>
                </label>
                <ul className="dropdown-content opacity-90" role="menu">
                    <li><button className="w-[100%] h-15  text-white">Trousers</button></li>
                    <li><button  className="w-[100%] h-15 text-white">Jogger</button></li>
                    <li><button  className="w-[100%] h-15  text-white">Tshirt</button></li>
                    <li><button  className="w-[100%] h-15 text-white">Polo</button></li>
                    <li><button  className="w-[100%] h-15 text-white">Shorts</button></li>
                </ul>
            </div>
  );
};

export default Prac;
