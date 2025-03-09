import React, { useState } from 'react';

const CreateComment = ({ postId, onCommentCreated }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      postId,
      content: commentText,
      username: 'Anonymous'
    };

    if (onCommentCreated) {
      onCommentCreated(newComment);
    }
    setCommentText('');
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
        <button type="submit" disabled={!commentText.trim()}>
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CreateComment;
