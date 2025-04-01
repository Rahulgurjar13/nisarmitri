import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';

const BACKEND_URL = ''; // Proxy handles routing

// Reusable Components
const Button = ({ children, variant = 'primary', onClick, disabled, className = '' }) => {
  const baseClasses = 'px-5 py-2 rounded-md font-medium transition-all duration-300 font-serif flex items-center gap-2';
  const variants = {
    primary: 'bg-[#1A3329] text-white hover:bg-[#2F6844] hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm border border-gray-300',
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Avatar = ({ name, image, size = 'md' }) => {
  const sizes = {
    md: 'w-12 h-12 text-lg',
  };
  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden shadow-md border-2 border-white`}>
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#1A3329] to-[#2F6844] flex items-center justify-center">
          <span className="font-semibold text-white">{name ? name[0].toUpperCase() : '?'}</span>
        </div>
      )}
    </div>
  );
};

const ShareButtons = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: 'Twitter',
      icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: 'Facebook',
      icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      icon: 'M16 8a6 6 0 00-6 6v7h-4v-7a10 10 0 00-10-10h-4v18h4v-7a2 2 0 014 0v7h4v-7a6 6 0 016-6zM2 2h12v4H2z',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="font-serif bg-gray-50 p-4 rounded-lg shadow-sm mt-10 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="text-gray-700 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
          Share this post
        </span>
        <div className="flex gap-3">
          {shareOptions.map(option => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg text-gray-600 transition-all duration-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d={option.icon} />
              </svg>
            </a>
          ))}
          <button
            onClick={copyToClipboard}
            className="p-2.5 rounded-full bg-white shadow-md hover:shadow-lg text-gray-600 transition-all duration-300 relative"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            {copied && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const useThrottledApi = (endpoint, options) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async () => {
      if (!endpoint) return;
      setLoading(true);
      try {
        const response = await axios.get(endpoint, options);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err.response?.status, err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [endpoint, JSON.stringify(options)]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
};

const BlogPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const stableNavigate = useCallback((path) => navigate(path), [navigate]);
  const [readingProgress, setReadingProgress] = useState(0);

  // Get the blog post
  const { 
    data: post, 
    loading: postLoading, 
    error: postError 
  } = useThrottledApi(`${BACKEND_URL}/api/posts/${id}`, {
    headers: { 'Cache-Control': 'no-cache' },
  });

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-serif">
        <Navbar />
        <div className="flex flex-col justify-center items-center py-32">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-[#1A3329] mb-6"></div>
          <p className="text-gray-600 animate-pulse">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-serif">
        <Navbar />
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
            <p className="text-gray-600 mb-8">The article you're looking for might have been removed or is temporarily unavailable.</p>
            {postError && (
              <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {postError}
                </div>
                <button
                  onClick={() => stableNavigate('/blog')}
                  className="text-red-900 hover:text-red-700"
                >
                  Dismiss
                </button>
              </div>
            )}
            <Button onClick={() => stableNavigate('/blog')}>
              Return to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const postUrl = `${window.location.origin}/blog/${id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-serif relative">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50"
        style={{ 
          background: 'linear-gradient(to right, #1A3329, #2F6844)',
          width: `${readingProgress}%`, 
          transition: 'width 0.2s' 
        }}
      ></div>
      
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Article Header Section */}
          <header className="mb-8">
            {/* Category Badge */}
            {post.category && (
              <div className="mb-3">
                <span className="inline-block bg-[#E6F0EA] text-[#1A3329] px-3 py-1 text-sm font-semibold rounded-lg">
                  {post.category}
                </span>
                {/* Featured Badge */}
                {post.featured && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-semibold rounded-lg ml-2">
                    Featured
                  </span>
                )}
              </div>
            )}
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-gray-600 italic mb-6 leading-relaxed">{post.excerpt}</p>
            )}
            
            {/* Author and Date */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <Avatar name={post.author?.name} image={post.author?.avatar} />
              <div>
                <h3 className="font-medium text-gray-900">{post.author?.name || 'Anonymous'}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative rounded-xl overflow-hidden mb-8 shadow-lg">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = `${BACKEND_URL}/uploads/placeholder.jpg`;
                  e.target.onError = null;
                }}
              />
            </div>
          )}
          
          {/* Article Content */}
          <article>
            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#2F6844] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md prose-hr:border-gray-200 mb-8 prose-headings:mt-8 prose-headings:mb-4 prose-p:leading-relaxed prose-li:ml-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
          
          {/* Share Buttons */}
          <ShareButtons url={postUrl} title={post.title} />
          
          {/* Back to Blog Button */}
          <div className="mt-10 text-center">
            <Button 
              variant="secondary" 
              onClick={() => stableNavigate('/blog')}
              className="mx-auto"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Blog
            </Button>
          </div>
        </div>
      </main>
      
      {/* Scroll to Top Button - Mobile */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-white shadow-lg hover:shadow-xl text-gray-600 hover:text-[#1A3329] transition-all z-10"
        aria-label="Scroll to top"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
      
      <Footer />
    </div>
  );
};

export default BlogPostDetail;