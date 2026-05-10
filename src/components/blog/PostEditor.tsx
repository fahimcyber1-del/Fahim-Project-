import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Save } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { apiStorage } from '../../utils/apiStorage';

export function PostEditor({ onBack, onSave }: { onBack: () => void, onSave: (post: any) => void }) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('Current User');

  useEffect(() => {
    try {
      const userStr = apiStorage.getItem('userProfile');
      if (userStr) {
        const profile = JSON.parse(userStr);
        setAuthorName(profile.name || 'Current User');
      }
    } catch(e) {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || content === '<p><br></p>') return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSave({
        id: Date.now(),
        title,
        excerpt: excerpt || title,
        content: content,
        category,
        author: authorName,
        date: 'Just now',
        readTime: '1 min read',
        likes: 0,
        tags: []
      });
      setIsSubmitting(false);
    }, 800);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-none p-4 lg:p-6 border-b border-slate-200 bg-white sticky top-0 z-10 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!title || !content || content === '<p><br></p>' || isSubmitting}
            className="px-6 py-2 bg-sky-600 text-white text-sm font-bold rounded-lg hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full p-4 lg:p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 lg:p-4 sm:p-6 lg:p-8 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Post Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your article a catchy title..."
                className="w-full px-4 py-3 text-xl font-bold border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                >
                  <option>General</option>
                  <option>Quality Standards</option>
                  <option>Best Practices</option>
                  <option>Tutorials</option>
                  <option>Policy Updates</option>
                  <option>Company News</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Short Excerpt (Optional)</label>
                <input 
                  type="text" 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A brief summary of what this post is about"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Article Content</label>
              <div className="border border-slate-300 rounded-lg flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 shadow-sm bg-white min-h-[400px]">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  modules={modules}
                  formats={formats}
                  className="h-[350px] mb-12"
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
