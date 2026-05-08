import React, { useState } from 'react';
import { Newspaper, Search, Plus, Bookmark, Clock, User, ArrowRight, TrendingUp } from 'lucide-react';
import { PostReader } from './PostReader';
import { PostEditor } from './PostEditor';

const INITIAL_MOCK_POSTS = [
  { id: 1, title: 'Understanding ISO 9001:2015 Continuous Improvement', excerpt: 'A deep dive into how the latest ISO 9001 standard drives continuous improvement across manufacturing departments.', category: 'Quality Standards', author: 'Dr. Alan Smith', date: 'Oct 24, 2023', readTime: '5 min read', likes: 24, tags: ['ISO', 'QMS'] },
  { id: 2, title: 'Top 5 Defect Prevention Strategies for 2026', excerpt: 'Discover the most effective methods to prevent and mitigate critical defects before they reach the assembly line.', category: 'Best Practices', author: 'Sarah Chen', date: 'Oct 20, 2023', readTime: '8 min read', likes: 56, tags: ['Defects', 'Assurance'] },
  { id: 3, title: 'How to Conduct Effective Root Cause Analysis', excerpt: 'Learn the 5-Whys methodology and Ishikawa diagrams to find the real source of manufacturing issues.', category: 'Tutorials', author: 'Marcus Johnson', date: 'Oct 15, 2023', readTime: '12 min read', likes: 112, tags: ['RCA', 'Training'] },
  { id: 4, title: 'Navigating New Supplier Auditing Guidelines', excerpt: 'Recent updates to our supply chain auditing policies and what it means for your next inspection.', category: 'Policy Updates', author: 'David Wilson', date: 'Oct 10, 2023', readTime: '4 min read', likes: 18, tags: ['Audit', 'Suppliers'] },
];

export function BlogModule() {
  const [posts, setPosts] = useState(INITIAL_MOCK_POSTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState<'list' | 'read' | 'write'>('list');
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(post => 
    (activeCategory === 'All' || post.category === activeCategory) &&
    (post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleReadPost = (post: any) => {
    setSelectedPost(post);
    setView('read');
  };

  const handleCreatePost = (newPost: any) => {
    setPosts([newPost, ...posts]);
    setView('list');
  };

  if (view === 'read' && selectedPost) {
    return <PostReader post={selectedPost} onBack={() => setView('list')} />;
  }

  if (view === 'write') {
    return <PostEditor onBack={() => setView('list')} onSave={handleCreatePost} />;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex-none p-4 lg:p-6 pb-0 border-b border-slate-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-sky-600" />
              Company Blog & Insights
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Read articles, tutorials, and updates from the Quality Team</p>
          </div>
          <button 
            onClick={() => setView('write')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Write Post
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-sky-100 text-sky-800 border-2 border-sky-200' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
        {/* Featured Post (first post) */}
        {filteredPosts.length > 0 && searchTerm === '' && activeCategory === 'All' && (
          <div 
            onClick={() => handleReadPost(filteredPosts[0])}
            className="mb-8 bg-black rounded-2xl overflow-hidden shadow-lg relative group cursor-pointer h-64 sm:h-80 lg:h-96"
          >
            {/* Abstract gradient placeholder for image */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-sky-800 to-slate-900 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-sky-500 text-white text-xs font-bold uppercase tracking-wider rounded-sm">Featured</span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-sm">{filteredPosts[0].category}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 leading-tight max-w-4xl group-hover:underline decoration-sky-400 decoration-4 underline-offset-4">
                {filteredPosts[0].title}
              </h2>
              <p className="text-slate-200 text-sm sm:text-base max-w-2xl hidden sm:block mb-6 line-clamp-2">
                {filteredPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {filteredPosts[0].author}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {filteredPosts[0].readTime}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:p-6">
          {filteredPosts.map((post, index) => {
            // Skip the first post if we are showing it as featured
            if (index === 0 && searchTerm === '' && activeCategory === 'All') return null;
            
            return (
              <div 
                key={post.id} 
                onClick={() => handleReadPost(post)}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer"
              >
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${
                    index % 3 === 0 ? 'from-amber-100 to-rose-100' :
                    index % 3 === 1 ? 'from-emerald-100 to-teal-100' :
                    'from-blue-100 to-indigo-100'
                  } opacity-80 group-hover:scale-105 transition-transform duration-500`}></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                    <span>&bull;</span>
                    <span>{post.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-sky-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{post.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1 text-xs font-medium hover:text-sky-600 transition-colors">
                        <TrendingUp className="w-3.5 h-3.5" /> {post.likes}
                      </span>
                      <button className="hover:text-amber-500 transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <p className="text-lg font-semibold text-slate-900">No matching articles</p>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              Try adjusting your search terms or category filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
