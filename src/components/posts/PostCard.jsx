import Link from 'next/link';

export default function PostCard({ post }) {
  const { id, title, content, author, votes, commentCount, createdAt } = post;
  
  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-accent border border-border rounded-md p-4 hover:border-secondary transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <button className="text-foreground/70 hover:text-primary">▲</button>
          <span className="text-sm font-medium">{votes}</span>
          <button className="text-foreground/70 hover:text-primary">▼</button>
        </div>
        
        <div className="flex-1">
          <Link href={`/posts/${id}`}>
            <h2 className="text-xl font-semibold hover:text-secondary">{title}</h2>
          </Link>
          
          <p className="text-sm text-foreground/70 mt-1">
            Posted by <Link href={`/profile/${author}`} className="hover:underline">{author}</Link> on {formattedDate}
          </p>
          
          <p className="mt-2 line-clamp-3">{content}</p>
          
          <div className="mt-3 flex items-center gap-4 text-sm text-foreground/70">
            <Link href={`/posts/${id}`} className="flex items-center gap-1 hover:text-secondary">
              <span>💬</span> {commentCount} comments
            </Link>
            <button className="flex items-center gap-1 hover:text-secondary">
              <span>🔗</span> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 