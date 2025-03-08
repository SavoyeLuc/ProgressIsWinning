"use client";

import { useState } from 'react';

export default function CommentForm({ postId }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would call your API to submit the comment
      console.log('Submitting comment:', { postId, content });
      
      // Reset form after successful submission
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-md p-4 bg-accent">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What are your thoughts?"
        className="w-full p-3 border border-border rounded bg-background min-h-24 focus:outline-none focus:ring-1 focus:ring-secondary"
        required
      />
      
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
} 