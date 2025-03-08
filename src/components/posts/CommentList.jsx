import Link from 'next/link';

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/70">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function Comment({ comment }) {
  const { content, author, votes, createdAt } = comment;
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="border border-border rounded-md p-4 bg-accent">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <button className="text-foreground/70 hover:text-primary">▲</button>
          <span className="text-sm font-medium">{votes}</span>
          <button className="text-foreground/70 hover:text-primary">▼</button>
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-foreground/70">
            <Link href={`/profile/${author}`} className="font-medium hover:underline">
              {author}
            </Link>{' '}
            • {formattedDate}
          </p>
          
          <p className="mt-2">{content}</p>
          
          <div className="mt-2 flex items-center gap-4 text-xs text-foreground/70">
            <button className="hover:text-secondary">Reply</button>
            <button className="hover:text-secondary">Share</button>
            <button className="hover:text-secondary">Report</button>
          </div>
        </div>
      </div>
    </div>
  );
} 