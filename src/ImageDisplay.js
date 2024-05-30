import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ImageDisplay = ({ onLogout }) => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fabricname, setFabricname] = useState('Trouser%20Fabric');

  const fabricTypes = [
    "Trouser Fabric", "Polo Fabric", "Jogger Fabric", "Tshirt Fabric", 
    "Short Fabric", "Polo Collar Fabric", "Polo Neckband Fabric", "Polo Cuff Fabric"
  ];

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

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="flex flex-wrap justify-center mb-6">
        {fabricTypes.map(type => (
          <button
            key={type}
            onClick={() => setFabricname(type.replace(/ /g, "%20"))}
            className={`px-3 py-2 text-sm sm:text-base rounded-md transition ${fabricname === type.replace(/ /g, "%20") ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          >
            {type}
          </button>
        ))}
      </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.length > 0 ? images.map((url, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg overflow-hidden cursor-pointer ${selectedImage === url ? 'border-red-500' : 'border-transparent'}`}
            onClick={() => handleImageSelect(url)}
          >
            <img src={url} alt={`Image ${index}`} className="w-full h-48 object-cover" />
          </div>
        )) : (
          <p className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center">No images found.</p>
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
            className="w-48 h-48 bg-cover bg-center flex items-center justify-center cursor-pointer"
            style={{ backgroundImage: 'url("/Plus.png")' }}
          >
          </label>
        </div>
      </div>
      {selectedImage && (
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default ImageDisplay;
