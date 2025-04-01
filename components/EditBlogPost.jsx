import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import debounce from 'lodash/debounce'; // Install lodash: npm install lodash

const BACKEND_URL = 'http://localhost:5001';

const EditBlogPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postFromState = location.state?.post;

  const [formData, setFormData] = useState({
    title: postFromState?.title || '',
    excerpt: postFromState?.excerpt || '',
    content: postFromState?.content || '',
    category: postFromState?.category || '',
    coverImage: null,
    featured: postFromState?.featured || false,
    readTime: postFromState?.readTime || '',
    author: postFromState?.author || { name: localStorage.getItem('userName') || 'Anonymous', avatar: `${BACKEND_URL}/uploads/default-avatar.jpg` },
  });
  const [previewImage, setPreviewImage] = useState(postFromState?.coverImage ? `${BACKEND_URL}${postFromState.coverImage}` : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPost, setLoadingPost] = useState(!postFromState);

  const token = localStorage.getItem('token');
  const postId = location.pathname.split('/').pop(); // Extract ID from URL

  useEffect(() => {
    let mounted = true;

    const fetchPost = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      if (!postFromState) {
        setLoadingPost(true);
        try {
          const response = await axios.get(`${BACKEND_URL}/api/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (mounted) {
            const fetchedPost = response.data;
            setFormData({
              title: fetchedPost.title,
              excerpt: fetchedPost.excerpt,
              content: fetchedPost.content,
              category: fetchedPost.category,
              coverImage: null,
              featured: fetchedPost.featured,
              readTime: fetchedPost.readTime,
              author: fetchedPost.author,
            });
            setPreviewImage(fetchedPost.coverImage ? `${BACKEND_URL}${fetchedPost.coverImage}` : null);
            setLoadingPost(false);
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          if (mounted) {
            if (error.response?.status === 401 || error.response?.status === 403) {
              localStorage.removeItem('token');
              navigate('/login');
            } else {
              navigate('/admin');
            }
          }
        }
      }
    };

    fetchPost();

    return () => {
      mounted = false;
    };
  }, [postFromState, token, navigate, postId]);

  const handleChange = (e) => {
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

      try {
        const postFormData = new FormData();
        postFormData.append('title', data.title);
        postFormData.append('excerpt', data.excerpt);
        postFormData.append('content', data.content);
        postFormData.append('category', data.category);
        postFormData.append('featured', data.featured);
        postFormData.append('readTime', data.readTime || Math.ceil(data.content.split(' ').length / 200));
        postFormData.append('author', JSON.stringify(data.author));
        if (data.coverImage && data.coverImage instanceof File) {
          postFormData.append('coverImage', data.coverImage);
        }

        const response = await axios.put(`${BACKEND_URL}/api/posts/${postFromState?._id || postId}`, postFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Post updated successfully:', response.data);
        navigate('/admin');
      } catch (error) {
        console.error('Error updating blog post:', error);
        setError(error.response?.data?.error || 'Failed to update post. Please try again.');
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setIsSubmitting(false);
      }
    }, 500),
    [token, navigate, postFromState, postId]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    debouncedSubmit(formData);
  };

  if (loadingPost) {
    return (
      <div className="bg-gray-50 min-h-screen font-serif">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3329] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
            {error}
            <button onClick={() => setError(null)} className="text-red-900 hover:text-red-700">
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (minutes)</label>
              <input
                type="number"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
                placeholder="Estimated read time (optional)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows="3"
                disabled={isSubmitting}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="6"
                disabled={isSubmitting}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex items-center justify-center h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-gray-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-500">Click to upload new image (Max 5MB)</p>
                  </div>
                  <input
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
                        setPreviewImage(postFromState?.coverImage ? `${BACKEND_URL}${postFromState.coverImage}` : null);
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

            <div className="md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-[#1A3329] focus:ring-[#1A3329] border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                Featured Post
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 bg-[#1A3329] text-white rounded-md hover:bg-[#2F6844] transition-colors flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting && (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPost;