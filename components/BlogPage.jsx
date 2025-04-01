import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import debounce from 'lodash/debounce';

const BACKEND_URL = ''; // Proxy handles routing

const fetchPosts = async (setPosts, setLoading, setError) => {
  try {
    setLoading(true);
    const response = await axios.get(`/api/posts`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    console.log('Fetched Posts:', response.data);
    setPosts(response.data);
    setError(null);
  } catch (err) {
    console.error('Error fetching posts:', err);
    setError('Failed to load posts. Please try again later.');
  } finally {
    setLoading(false);
  }
};

const BlogPostCard = ({ post, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ transform: isHovered ? 'translateY(-5px)' : 'none' }}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={post.coverImage || '/uploads/placeholder.jpg'}
          alt={post.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          onError={(e) => (e.target.src = '/uploads/placeholder.jpg')}
        />
        {post.category && (
          <span className="absolute top-4 left-4 bg-[#1A3329] text-white text-xs font-bold px-3 py-1 rounded-full">
            {post.category}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <span>{formatDate(post.date)}</span>
          <span className="mx-2">•</span>
          <span>{post.readTime} min read</span>
        </div>
        <h3 className="text-gray-900 font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center mt-auto">
          <img
            src={post.author.avatar || '/uploads/default-avatar.jpg'}
            alt={post.author.name}
            className="w-8 h-8 rounded-full mr-2 object-cover"
            onError={(e) => (e.target.src = '/uploads/default-avatar.jpg')}
          />
          <span className="text-gray-700 text-sm font-medium">{post.author.name}</span>
        </div>
      </div>
    </div>
  );
};

const FeaturedPost = ({ post, onClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <img
            src={post.coverImage || '/uploads/placeholder.jpg'}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = '/uploads/placeholder.jpg')}
          />
          {post.category && (
            <span className="absolute top-4 left-4 bg-[#1A3329] text-white text-xs font-bold px-3 py-1 rounded-full">
              {post.category}
            </span>
          )}
        </div>
        <div className="md:w-1/2 p-6 flex flex-col">
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <span>{formatDate(post.date)}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime} min read</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
          <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
          <div className="flex items-center mb-4">
            <img
              src={post.author.avatar || '/uploads/default-avatar.jpg'}
              alt={post.author.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
              onError={(e) => (e.target.src = '/uploads/default-avatar.jpg')}
            />
            <span className="text-gray-700 font-medium">{post.author.name}</span>
          </div>
          <button
            onClick={onClick}
            className="bg-[#1A3329] hover:bg-[#2F6844] text-white px-5 py-2 rounded-md transition-colors duration-300 inline-flex items-center w-fit"
          >
            Read Article
            <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => (
  <div className="mb-6 overflow-x-auto pb-2">
    <div className="flex space-x-2 min-w-max">
      {categories.map(category => (
        <button
          key={category}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
            activeCategory === category ? 'bg-[#1A3329] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  </div>
);

const SearchBar = ({ onSearch, posts }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim().length > 1) {
        const filteredSuggestions = posts
          .filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      onSearch(searchQuery);
    }, 300),
    [posts, onSearch]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedSearch.flush();
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    onSearch(suggestion.title);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full md:w-1/3">
      <form onSubmit={handleSubmit} className="mb-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={handleChange}
            onFocus={() => query.trim().length > 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3329]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#1A3329]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          {suggestions.map(suggestion => (
            <div
              key={suggestion._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium text-sm">{suggestion.title}</div>
              <div className="text-xs text-gray-500">{suggestion.category}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSidebar = ({ categories, activeCategory, setActiveCategory, onResetFilters }) => (
  <div className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 mb-6 lg:mb-0 sticky top-24">
    <h3 className="font-bold text-lg mb-4 text-gray-900">Filters</h3>
    <div className="mb-6">
      <h4 className="font-medium text-sm mb-2 text-gray-700">Categories</h4>
      <div className="space-y-2">
        {categories.map(category => (
          <div
            key={category}
            className={`px-3 py-2 rounded cursor-pointer transition-colors ${
              activeCategory === category ? 'bg-[#1A3329] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
    <button
      onClick={onResetFilters}
      className="w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
    >
      Reset Filters
    </button>
  </div>
);

const NewPostButton = ({ onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get(`/api/auth/check-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error('Failed to check admin status:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
      }
    };
    checkAdminStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    navigate('/');
  };

  if (!isAdmin) return null; // Only admins see this button

  return (
    <div className="fixed bottom-6 right-6 z-10 flex flex-col items-end space-y-2">
      <div className="relative">
        <button
          onClick={onClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="bg-[#1A3329] text-white p-4 rounded-full shadow-lg hover:bg-[#2F6844] transition-colors duration-300"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        {showTooltip && (
          <div className="fixed bottom-20 right-6 bg-gray-800 text-white px-3 py-1 rounded text-sm whitespace-nowrap">
            Create New Post
          </div>
        )}
      </div>
    
    </div>
  );
};

const EmptyState = ({ message, subMessage }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0h4"
      />
    </svg>
    <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
    <p className="text-gray-600 max-w-md">{subMessage}</p>
  </div>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded text-sm ${
            currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Previous
        </button>
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === page ? 'bg-[#1A3329] text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded text-sm ${
            currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

const BlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);
  const postsPerPage = 6;

  const debouncedFetchPosts = useCallback(
    debounce(() => fetchPosts(setPosts, setLoading, setError), 1000),
    []
  );

  useEffect(() => {
    debouncedFetchPosts();
    return () => debouncedFetchPosts.cancel();
  }, [activeCategory, searchQuery, debouncedFetchPosts]);

  const categories = ['All', ...Array.from(new Set(posts.map(post => post.category)))];

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query.trim());
    setCurrentPage(1);
  };

  const handleNewPost = () => navigate('/create-blog-post');
  const handleViewPost = (postId) => navigate(`/blog/${postId}`); // Accessible to all, no admin check

  const filteredPosts = posts
    .filter(post => activeCategory === 'All' || post.category === activeCategory)
    .filter(post =>
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const featuredPost = posts.find(post => post.featured);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts
    .filter(post => !(activeCategory === 'All' && currentPage === 1 && post.featured))
    .slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(
    (filteredPosts.length - (activeCategory === 'All' && currentPage === 1 && featuredPost ? 1 : 0)) / postsPerPage
  );

  return (
    <div className="bg-gray-50 min-h-screen font-serif">
      <Navbar />

      <button
        className="lg:hidden fixed z-20 left-6 bottom-6 bg-white shadow-lg rounded-full p-3 border border-gray-200"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      {showSidebar && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setShowSidebar(false)} />}

      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900">Filters</h3>
            <button onClick={() => setShowSidebar(false)}>
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <FilterSidebar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Our Blog</h1>
          <SearchBar onSearch={handleSearch} posts={posts} />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => debouncedFetchPosts()} className="text-red-900 font-medium hover:underline">
              Retry
            </button>
          </div>
        )}

        {searchQuery && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                <span className="font-medium">{filteredPosts.length}</span> result{filteredPosts.length !== 1 ? 's' : ''} found
              </p>
              <button onClick={handleResetFilters} className="text-[#1A3329] font-medium hover:underline flex items-center">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear search
              </button>
            </div>
          </div>
        )}

        {!searchQuery && (
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-xl font-medium text-gray-900">{activeCategory === 'All' ? 'All Posts' : activeCategory}</h2>
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block">
            <FilterSidebar
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onResetFilters={handleResetFilters}
            />
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <div className="md:flex">
                    <div className="md:w-1/2 bg-gray-300 h-64 md:h-80"></div>
                    <div className="md:w-1/2 p-6 space-y-4">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(item => (
                    <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden h-96">
                      <div className="bg-gray-300 h-48"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 rounded w-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {activeCategory === 'All' && currentPage === 1 && featuredPost && !searchQuery && (
                  <FeaturedPost post={featuredPost} onClick={() => handleViewPost(featuredPost._id)} />
                )}

                {currentPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentPosts.map(post => (
                      <BlogPostCard key={post._id} post={post} onClick={() => handleViewPost(post._id)} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    message={searchQuery ? 'No search results found' : 'No posts found'}
                    subMessage={
                      searchQuery ? 'Try different keywords or browse categories instead' : 'Check back later for new posts!'
                    }
                  />
                )}

                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <NewPostButton onClick={handleNewPost} />
    </div>
  );
};

export default BlogPage;