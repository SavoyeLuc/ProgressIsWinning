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
  const comments = [
    { id: 1, content: 'This is a comment' },
    { id: 2, content: 'This is another comment' },
  ];

  const handleUpvote = () => {
    // Logic for upvoting the post
  };

  const handleShare = () => {
    // Logic for sharing the post
  };

  const handleComment = () => {
    // Logic for commenting on the post
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // Example like data structure (this should ideally come from the backend)
  const likeCounts = post.likeCounts || { FL: 40, L: 2, SL: 79, M: 45, SR: 23, R: 73, FR: 233};

  const totalLikes = Object.values(likeCounts).reduce((sum, count) => sum + count, 0);

  const likeBarSegments = Object.entries(likeCounts)
    .map(([category, count]) => ({
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
        <button onClick={handleUpvote}>Upvote</button>
        <button onClick={handleShare}>Share</button>
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

      <CommentList comments={comments} />
    </div>
  );
};

export default Post;
