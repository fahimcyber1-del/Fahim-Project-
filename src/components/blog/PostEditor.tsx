import React, { useState, useRef } from 'react';
import { ArrowLeft, Send, Save, Image as ImageIcon, Link as LinkIcon, List, Bold, Italic, Heading1, Heading2, Heading3, Quote, Code, Strikethrough, Underline, CheckSquare } from 'lucide-react';

export function PostEditor({ onBack, onSave }: { onBack: () => void, onSave: (post: any) => void }) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSave({
        id: Date.now(),
        title,
        excerpt: excerpt || content.substring(0, 100) + '...',
        content: content,
        category,
        author: 'Current User',
        date: 'Just now',
        readTime: '1 min read',
        likes: 0,
        tags: []
      });
      setIsSubmitting(false);
    }, 800);
  };

  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    
    const newContent = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newContent);
    
    // Set focus back and adjust selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleBold = () => insertFormatting('**', '**', 'bold text');
  const handleItalic = () => insertFormatting('*', '*', 'italic text');
  const handleStrikethrough = () => insertFormatting('~~', '~~', 'strikethrough text');
  const handleUnderline = () => insertFormatting('<u>', '</u>', 'underline text');
  const handleH1 = () => insertFormatting('# ', '', 'Heading 1');
  const handleH2 = () => insertFormatting('## ', '', 'Heading 2');
  const handleH3 = () => insertFormatting('### ', '', 'Heading 3');
  const handleQuote = () => insertFormatting('> ', '', 'quoted text');
  const handleCode = () => insertFormatting('`', '`', 'code');
  const handleList = () => insertFormatting('- ', '', 'list item');
  const handleTaskList = () => insertFormatting('- [ ] ', '', 'task item');
  const handleLink = () => insertFormatting('[', '](https://example.com)', 'link text');
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      insertFormatting('![', `](${url})`, file.name);
    }
  };

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
            disabled={!title || !content || isSubmitting}
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
              <div className="border border-slate-300 rounded-lg flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 shadow-sm bg-white">
                <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center flex-wrap gap-1 sticky top-0 z-10">
                  <button type="button" onClick={handleBold} title="Bold" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Bold className="w-4 h-4" /></button>
                  <button type="button" onClick={handleItalic} title="Italic" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Italic className="w-4 h-4" /></button>
                  <button type="button" onClick={handleUnderline} title="Underline" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Underline className="w-4 h-4" /></button>
                  <button type="button" onClick={handleStrikethrough} title="Strikethrough" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Strikethrough className="w-4 h-4" /></button>
                  <div className="w-px h-5 bg-slate-300 mx-1"></div>
                  <button type="button" onClick={handleH1} title="Heading 1" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Heading1 className="w-4 h-4" /></button>
                  <button type="button" onClick={handleH2} title="Heading 2" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Heading2 className="w-4 h-4" /></button>
                  <button type="button" onClick={handleH3} title="Heading 3" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Heading3 className="w-4 h-4" /></button>
                  <div className="w-px h-5 bg-slate-300 mx-1"></div>
                  <button type="button" onClick={handleList} title="List" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><List className="w-4 h-4" /></button>
                  <button type="button" onClick={handleTaskList} title="Task List" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><CheckSquare className="w-4 h-4" /></button>
                  <button type="button" onClick={handleQuote} title="Blockquote" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Quote className="w-4 h-4" /></button>
                  <button type="button" onClick={handleCode} title="Code" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><Code className="w-4 h-4" /></button>
                  <div className="w-px h-5 bg-slate-300 mx-1"></div>
                  <button type="button" onClick={handleLink} title="Link" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><LinkIcon className="w-4 h-4" /></button>
                  <button type="button" onClick={handleImageClick} title="Upload Image" className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"><ImageIcon className="w-4 h-4" /></button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <textarea 
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your article here... (Markdown supported)"
                  className="w-full p-4 min-h-[400px] border-none focus:outline-none text-slate-700 resize-y leading-relaxed"
                ></textarea>
              </div>
            </div>
            
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg">
              <p className="text-sm text-sky-800 font-medium">
                💡 Tip: You can use Markdown formatting like **bold**, *italic*, and # headings in your content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
