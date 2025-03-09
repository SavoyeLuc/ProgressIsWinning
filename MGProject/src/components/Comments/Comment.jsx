const Comment = ({ comment }) => {
    return (
      <div className="comment">
        <p>{comment.content}</p>
      </div>
    );
  };
  
  export default Comment;