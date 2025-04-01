import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import debounce from 'lodash/debounce'; // Install lodash: npm install lodash

const BACKEND_URL = 'http://localhost:5001';

const CreateBlogPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    coverImage: null,
    featured: false,
    readTime: '',
    author: { name: localStorage.getItem('userName') || 'Anonymous', avatar: `${BACKEND_URL}/uploads/default-avatar.jpg` },
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const categories = ['Zero Waste', 'Bamboo', 'Menstrual', 'Bathroom', 'Materials', 'Lifestyle'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else if (file) {
      setError('Image size must be less than 5MB');
    }
  };

  const debouncedSubmit = useCallback(
    debounce(async (data) => {
      setIsSubmitting(true);
      setError(null);

      if (!token) {
        setError('You must be logged in to create a post.');
        setIsSubmitting(false);
        return;
      }

      try {
        const postFormData = new FormData();
        postFormData.append('title', data.title);
        postFormData.append('excerpt', data.excerpt);
        postFormData.append('content', data.content);
        postFormData.append('category', data.category);
        postFormData.append('featured', data.featured);
        postFormData.append('readTime', data.readTime || Math.ceil(data.content.split(' ').length / 200));
        postFormData.append('author', JSON.stringify(data.author));
        if (data.coverImage) {
          postFormData.append('coverImage', data.coverImage);
        }

        const response = await axios.post(`${BACKEND_URL}/api/posts`, postFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Post created successfully:', response.data);
        navigate('/admin');
      } catch (error) {
        console.error('Error submitting blog post:', error);
        setError(error.response?.data?.error || 'Failed to publish post. Please try again.');
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsSubmitting(false);
      }
    }, 500),
    [token, navigate]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    debouncedSubmit(formData);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Blog Post</h1>
          <p className="text-gray-600">Share your sustainable living insights.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
            {error}
            <button onClick={() => setError(null)} className="text-red-900 hover:text-red-700">
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="grid gap-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                placeholder="Enter a descriptive title"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-gray-700 font-medium mb-2">
                Excerpt <span className="text-gray-500 text-sm">(1-2 sentences)</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                rows="3"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                placeholder="Write a compelling summary"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="readTime" className="block text-gray-700 font-medium mb-2">Read Time (minutes)</label>
              <input
                type="number"
                id="readTime"
                name="readTime"
                value={formData.readTime}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                placeholder="Estimated read time (optional)"
              />
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-gray-700 font-medium mb-2">Cover Image</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-gray-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-500">Click to upload (Max 5MB)</p>
                  </div>
                  <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
                {previewImage && (
                  <div className="relative">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = `${BACKEND_URL}/uploads/placeholder.jpg`;
                        e.target.onError = null;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData((prev) => ({ ...prev, coverImage: null }));
                      }}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                      disabled={isSubmitting}
                    >
                      <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows="12"
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                placeholder="Write your blog post content..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-4 h-4 text-[#1A3329] focus:ring-[#1A3329] border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-gray-700">Mark as featured post</label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-[#1A3329] text-white rounded-md hover:bg-[#2F6844] transition-colors flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPost;