import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PhotoIcon, VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState([]);
  const [children, setChildren] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile/children`);
      setChildren(response.data.children);
    } catch (error) {
      console.error('Failed to fetch children:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Only image and video files are allowed');
      return;
    }

    setFiles(validFiles);
    setError('');
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleTagToggle = (child) => {
    const existingTag = tags.find(tag => tag.childId === child._id);
    if (existingTag) {
      setTags(tags.filter(tag => tag.childId !== child._id));
    } else {
      setTags([...tags, { childId: child._id, childName: child.name }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('media', file);
      });

      formData.append('caption', caption);
      formData.append('tags', JSON.stringify(tags));
      formData.append('isPrivate', isPrivate);

      await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/gallery');
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload post');
    } finally {
      setLoading(false);
    }
  };

  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Share a Moment</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Photos or Videos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="flex space-x-2 mb-4">
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                  <VideoCameraIcon className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-600 text-center">
                  Click to select photos or videos
                  <br />
                  <span className="text-sm text-gray-400">
                    You can select multiple files
                  </span>
                </p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={getFilePreview(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <VideoCameraIcon className="h-12 w-12 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-600">{file.name}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share what makes this moment special..."
            />
          </div>

          {children.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tag Family Members
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {children.map((child) => (
                  <button
                    key={child._id}
                    type="button"
                    onClick={() => handleTagToggle(child)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                      tags.some(tag => tag.childId === child._id)
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {child.profilePicture ? (
                      <img
                        src={child.profilePicture}
                        alt={child.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          {child.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium">{child.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
              Make this post private (only visible to you)
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || files.length === 0}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Uploading...' : 'Share Moment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;