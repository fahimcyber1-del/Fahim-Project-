import React from 'react';
import { ArrowLeft, Clock, User, Share2, Bookmark, ThumbsUp, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export function PostReader({ post, onBack }: { post: any, onBack: () => void }) {
  // Mock content for the article to simulate a full blog post
  const mockContent = `
## Introduction

In today's fast-paced manufacturing environment, adherence to quality standards is more than just a compliance requirement—it's a fundamental driver of business excellence. The latest iteration of the standard emphasizes a proactive approach to risk management and organizational continuous improvement over mere corrective actions.

### The Shift in Paradigm

Previously, organizations often treated audits as a checklist exercise. We have observed a meaningful shift where teams integrate quality assurance into their daily operations. By utilizing tools like the 5-Whys methodology and fishbone diagrams during root cause analysis, teams can isolate issues earlier.

Key strategies include:
- Establishing regular cross-functional review meetings.
- Implementing real-time monitoring of defect rates.
- Conducting supplier capability assessments before finalizing contracts.

### Conclusion

Our continued focus should reside on building a resilient supply chain and robust internal processes. By adopting these methods, we not only pass audits but also deliver superior products to our customers.
  `;

  const contentToRender = post.content || mockContent;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      <div className="flex-none p-4 lg:p-6 border-b border-slate-200 bg-white sticky top-0 z-10 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-3xl mx-auto p-4 lg:p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider rounded-sm mb-4 inline-block">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 sm:p-6 text-sm font-medium text-slate-500 border-b border-slate-200 pb-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                  {post.author.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-slate-900 font-bold">{post.author}</p>
                  <p className="text-xs">Quality Team</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 ml-auto">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
              </div>
            </div>
            
            <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8">
              {post.excerpt}
            </p>
            
            <div className="prose prose-slate prose-lg max-w-none prose-img:rounded-xl prose-img:shadow-md prose-headings:text-slate-900 prose-a:text-sky-600 hover:prose-a:text-sky-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {contentToRender}
              </ReactMarkdown>
            </div>
            
            <div className="mt-12 flex items-center gap-4">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between">
              <button className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors">
                <ThumbsUp className="w-5 h-5" />
                Helpful Article ({post.likes})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
