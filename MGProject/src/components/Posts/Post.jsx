import CommentList from '../Comments/CommentList';
import '../../css/Post.css';

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
  }

  const formatDate = (date) => {
    // Logic for formatting the date
    return new Date(date).toLocaleDateString();
  }
  

  //have to make it so the post author is dynamic
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
      <CommentList comments={comments} />
    </div>
  );
};

export default Post;