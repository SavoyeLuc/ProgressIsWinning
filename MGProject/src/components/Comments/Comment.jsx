// Comment.jsx
const Comment = ({ comment }) => {
    return (
      <div className="comment">
         <p><strong>{comment.username}:</strong> {comment.content}</p> {/* ✅ Show username */}
      </div>
    );
  };
  
  export default Comment;