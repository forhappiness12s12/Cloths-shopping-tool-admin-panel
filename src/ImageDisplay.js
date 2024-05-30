import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

const ImageDisplay = ({ onLogout }) => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fabricname, setFabricname] = useState('Trouser%20Fabric');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState('Trouser Fabric');

  const fabricTypes = [
    "Trouser Fabric", "Polo Fabric", "Jogger Fabric", "Tshirt Fabric", 
    "Short Fabric", "Polo Collar Fabric", "Polo Neckband Fabric", "Polo Cuff Fabric"
  ];

  const dropdownRef = useRef();

  useEffect(() => {
    const fetchImages = async () => {
      if (!fabricname) return;

      const { data, error } = await supabase.storage.from(fabricname).list('', { limit: 100 });
      if (error) {
        console.error('Error listing files:', error);
        return;
      }

      if (!data || data.length === 0) {
        setImages([]);
        return;
      }

      const baseUrl = `https://krvevkxigsdnikvakxjt.supabase.co/storage/v1/object/public/${fabricname}/`;
      const imageUrls = data.map((file) => `${baseUrl}${file.name}`);
      setImages(imageUrls);
    };

    fetchImages();
  }, [fabricname]);

  const handleFileChangeAndUpload = async (event) => {
    const file = event.target.files[0];
    setUploading(true);

    const filePath = `${file.name}`;
    const { data, error } = await supabase.storage.from(fabricname).upload(filePath, file);

    setUploading(false);

    if (error) {
      console.error('Error uploading file:', error);
      return;
    }

    const newImageUrl = `https://krvevkxigsdnikvakxjt.supabase.co/storage/v1/object/public/${fabricname}/${filePath}`;
    setImages((prevImages) => [...prevImages, newImageUrl]);
  };

  const handleImageSelect = (url) => {
    setSelectedImage(url);
  };

  const handleDelete = async () => {
    const fileName = selectedImage.split('/').pop();
    const { error } = await supabase.storage.from(fabricname).remove([fileName]);

    if (error) {
      console.error('Error deleting file:', error);
      return;
    }

    setImages((prevImages) => prevImages.filter((url) => url !== selectedImage));
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleFabricSelect = (type) => {
    setFabricname(type.replace(/ /g, "%20"));
    setSelectedFabric(type);
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#707070]">
      <div className="flex justify-center mb-6">
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <button
            className="mt-3 inline-flex text-[24px] justify-between items-center w-64 rounded-md shadow-lg px-4 py-2 bg-gradient-to-r from-[#2b2a2a] to-[#616060] text-white font-medium hover:from-[#616060] hover:via-[#616060] hover:to-[#070606] transition-all duration-300"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedFabric}
            <svg
              className="ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707 1.707l-5.5 5.5a1 1 0 01-1.414 0l-5.5-5.5A1 1 0 011.707 3.293L10 3zm0 12a1 1 0 01-.707-1.707l5.5-5.5a1 1 0 011.414 0l5.5 5.5A1 1 0 0118.293 15.707L10 15z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {fabricTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFabricSelect(type)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.length > 0 ? (
          images.map((url, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg overflow-hidden cursor-pointer ${selectedImage === url ? 'border-red-500' : 'border-transparent'}`}
              onClick={() => handleImageSelect(url)}
            >
              <img src={url} alt={`Image ${index}`} className="w-full h-48 object-cover" />
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
        <div className="mb-6 flex space-x-4">
  <input
    type="file"
    id="fileInput"
    onChange={handleFileChangeAndUpload}
    className="hidden"
  />
  
  <label
    htmlFor="fileInput"
    className="w-48 h-48 bg-cover bg-center flex items-center justify-center cursor-pointer border-2 border-[#494949] rounded-md p-4"
    style={{ backgroundImage: 'url("https://krvevkxigsdnikvakxjt.supabase.co/storage/v1/object/public/im/plus30.png")', backgroundSize: '60%', backgroundRepeat: 'no-repeat' }}
  >
  </label>
</div>


        
      </div>
      
      {selectedImage && (
        <button
          onClick={handleDelete}
          className="mt-8 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ImageDisplay;
