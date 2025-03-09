import React, { useState, useEffect } from 'react';
import CommentList from '../Comments/CommentList';
import { likePost, addComment, getComments } from '../../utils/api';
import { getUserData, isAuthenticated } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [likeCounts, setLikeCounts] = useState(post.likeCounts || {});
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState('');

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate total likes
  const totalLikes = Object.values(likeCounts).reduce((sum, count) => sum + count, 0);

  const likeBarSegments = Object.entries(likeCounts).map(([category, count]) => ({
    color: LIKE_COLORS[category],
    width: totalLikes > 0 ? `${(count / totalLikes) * 100}%` : '0%'
  }));

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    setShowCommentBox(!showCommentBox);
  };

  const handleLike = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setIsLiking(true);
    setError('');

    try {
      const response = await likePost(post.id);
      console.log('Like response:', response);
      
      // Update like counts with the response from the server
      if (response.success && response.likes) {
        setLikeCounts(response.likes);
      }
    } catch (err) {
      console.error('Error liking post:', err);
      // setError('Failed to like post. ' + err.message);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setIsSubmittingComment(true);
    setError('');
    console.log(commentText);
    
    try {
      const response = await addComment(post.id, commentText);
      console.log('Comment response:', response);

      // Get user data for display
      const userData = getUserData();
      
      // Create new comment with user data
      const newComment = {
        id: response.commentID,
        username: userData?.username || 'Anonymous',
        content: commentText,
        timestamp: new Date().toISOString()
      };

      // Update local comments state
      setComments([...comments, newComment]);
      setCommentText('');
      setShowCommentBox(false);
      
      // Make sure comments are visible after posting
      setShowComments(true);
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment. ' + err.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Fetch comments if they're shown
  useEffect(() => {
    if (showComments && comments.length === 0) {
      const fetchComments = async () => {
        try {
          const response = await getComments(post.id);
          
          if (response.success && response.comments) {
            // Transform API comments to match our format
            const formattedComments = response.comments.map(comment => ({
              id: comment.commentID,
              username: comment.username,
              content: comment.body,
              timestamp: comment.datePosted
            }));
            
            setComments(formattedComments);
          }
        } catch (err) {
          console.error('Error fetching comments:', err);
          setError('Failed to load comments.');
        }
      };
      
      fetchComments();
    }
  }, [showComments, post.id, comments.length]);

  return (
    <div className="post">
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta">
          <span className="post-author">Posted by {post.author}</span>
          <span className="post-date">{formatDate(post.timestamp)}</span>
        </div>
      </div>
      
      <div className="post-content">{post.content}</div>
      
      {post.sources && (
        <div className="post-sources">
          <strong>Sources:</strong> {post.sources}
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="post-footer">
        <div className="post-stats">
          <span className="likes-count">{totalLikes} likes</span>
          <span className="comments-count">{post.commentCount || comments.length || 0} comments</span>
          {post.polarizationScore !== undefined && (
            <span className="polarization-score">
              Polarization: {post.polarizationScore}/10
            </span>
          )}
        </div>
        
        <div className="post-actions">
          <button 
            onClick={handleLike} 
            disabled={isLiking}
            className="like-button"
          >
            {isLiking ? 'Liking...' : 'Like'}
          </button>
          <button onClick={handleCommentClick}>Comment</button>
          <button onClick={handleToggleComments}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
        </div>
      </div>

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

      {/* Comment Input Box */}
      {showCommentBox && (
        <div className="comment-input">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            disabled={isSubmittingComment}
          />
          <button 
            onClick={handleCommentSubmit} 
            disabled={!commentText.trim() || isSubmittingComment}
          >
            {isSubmittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      )}

      {/* Comments Section */}
      {showComments && <CommentList comments={comments} />}
    </div>
  );
};

export default Post;