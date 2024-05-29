import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ImageDisplay = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log('Fetching files from the bucket...');
        const { data, error } = await supabase
          .storage
          .from('im') // Ensure this matches your bucket name exactly
          .list('', { limit: 100 }); // Adjust the limit as needed

        if (error) {
          console.error('Error listing files:', error);
          return;
        }

        if (!data || data.length === 0) {
          console.log('No files found in the bucket.');
          return;
        }

        console.log('Files found:', data);

        const baseUrl = 'https://krvevkxigsdnikvakxjt.supabase.co/storage/v1/object/public/im/';

        // Manually construct the public URLs
        const imageUrls = data.map((file) => {
          const publicURL = `${baseUrl}${file.name}`;
          console.log(`Public URL for ${file.name}: ${publicURL}`);
          return publicURL;
        });

        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const filePath = `${selectedFile.name}`;
    const { data, error } = await supabase
      .storage
      .from('im') // Ensure this matches your bucket name exactly
      .upload(filePath, selectedFile);

    if (error) {
      console.error('Error uploading file:', error);
      return;
    }

    console.log('File uploaded:', data);

    // Update the images list with the new image URL
    const newImageUrl = `https://krvevkxigsdnikvakxjt.supabase.co/storage/v1/object/public/im/${filePath}`;
    setImages((prevImages) => [...prevImages, newImageUrl]);
  };

  const handleImageSelect = (url) => {
    setSelectedImage(url);
  };

  const handleDelete = async () => {
    if (!selectedImage) {
      alert('Please select an image to delete');
      return;
    }

    // Extract the file name from the URL
    const fileName = selectedImage.split('/').pop();

    const { error } = await supabase
      .storage
      .from('im') // Ensure this matches your bucket name exactly
      .remove([fileName]);

    if (error) {
      console.error('Error deleting file:', error);
      return;
    }

    console.log('File deleted:', selectedImage);

    // Update the images list to remove the deleted image
    setImages((prevImages) => prevImages.filter((url) => url !== selectedImage));
    setSelectedImage(null); // Clear the selected image
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Display PNG Images</h1>
      <div className="mb-6 flex space-x-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Upload
        </button>
      </div>
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
      </div>
      {selectedImage && (
        <div className="mt-6">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
