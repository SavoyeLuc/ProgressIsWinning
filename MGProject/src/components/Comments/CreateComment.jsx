import React, { useState } from 'react';

const CreateComment = ({ postId, onCommentCreated }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: commentText,
        }),
      });

      if (response.ok) {
        setCommentText('');
        if (onCommentCreated) {
          onCommentCreated();
        }
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className="create-comment">
      <form onSubmit={handleSubmit}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
        />
        <button type= "creat"></button>
        <button type="submit" disabled={!commentText.trim()}>
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CreateComment;
