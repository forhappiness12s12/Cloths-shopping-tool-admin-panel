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
      <div className="flex justify-center mb-6">
        <div className="dropdown relative">
          <button className="dropdown-btn bg-gray-800 text-white px-4 py-2 rounded-md">
            Select Fabric Type
            <span className="ml-2">&#x25BC;</span>
          </button>
          <ul className="dropdown-content absolute bg-white shadow-lg rounded-md mt-2 w-full z-10">
            {fabricTypes.map((type) => (
              <li key={type}>
                <button
                  onClick={() => setFabricname(type.replace(/ /g, "%20"))}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  {type}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Images Display</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
