import { useState } from 'react';
import CommentList from '../Comments/CommentList';
import '../../css/Post.css';

const LIKE_COLORS = {
  FL: '#030bfc',  // Dark Blue
  L: '#0352fc',   // Blue
  SL: '#0390fc',  // Light Blue
  M: '#d36bff',   // Light Purple
  SR: '#ff5757',  // Light Red
  R: '#d91818',   // Red
  FR: '#ad0000'   // Dark Red
};

const Post = ({ post }) => {
  const [showComments, setShowComments] = useState(false); // ✅ Toggle comments visibility
  const [showCommentBox, setShowCommentBox] = useState(false); // ✅ Toggle input box
  const [commentText, setCommentText] = useState(''); // ✅ Store comment text
  const [comments, setComments] = useState(post.comments || []); // ✅ Store comments dynamically

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return; // Ignore empty comments

    // Create new comment with "User" as the placeholder username
    const newComment = {
      id: Date.now(),
      username: 'User', // ✅ Hardcoded username
      content: commentText
    };

    // Update local comments state
    setComments([...comments, newComment]);
    setCommentText('');
    setShowCommentBox(false); // Hide input after posting
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const likeCounts = post.likeCounts || { FL: 40, L: 2, SL: 79, M: 45, SR: 23, R: 73, FR: 233 };
  const totalLikes = Object.values(likeCounts).reduce((sum, count) => sum + count, 0);

  const likeBarSegments = Object.entries(likeCounts).map(([category, count]) => ({
    color: LIKE_COLORS[category],
    width: totalLikes > 0 ? `${(count / totalLikes) * 100}%` : '0%'
  }));

  return (
    <div className="post">
      <header>
        <h2>{post.title}</h2>
        <p>Posted by {post.author} on {formatDate(post.timestamp)}</p>
      </header>
      <div className="post-body">
        <p>{post.content}</p>
      </div>
      <div className="post-actions">
        <button onClick={() => alert('Upvote logic not implemented yet')}>Upvote</button>
        <button onClick={() => alert('Share logic not implemented yet')}>Share</button>
        <button onClick={handleCommentClick}>Comment</button>
        <button onClick={handleToggleComments}>
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {/* Comment Input Box (Only shows when comment button is clicked) */}
      {showCommentBox && (
        <div className="comment-input">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
          />
          <button onClick={handleCommentSubmit} disabled={!commentText.trim()}>
            Post Comment
          </button>
        </div>
      )}

      {/* Like bar */}
      <div className="like-bar-container">
        <span className="total-likes">{totalLikes} Likes</span>
        <div className="like-bar">
          {likeBarSegments.map((segment, index) => (
            <div
              key={index}
              style={{
                backgroundColor: segment.color,
                width: segment.width,
                height: '100%'
              }}
            />
          ))}
        </div>
      </div>

      {/* Comments Section (Shown when toggled) */}
      {showComments && <CommentList comments={comments} />}
    </div>
  );
};

export default Post;