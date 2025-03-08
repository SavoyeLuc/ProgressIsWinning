import { notFound } from 'next/navigation';
import Link from 'next/link';
import CommentList from '@/components/posts/CommentList';
import CommentForm from '@/components/posts/CommentForm';

async function getPost(id) {
  // In a real app, you would fetch from your API
  // For now, we'll use mock data
  const posts = [
    { 
      id: '1', 
      title: 'First Post', 
      content: 'This is the first post with more detailed content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.', 
      author: 'user1', 
      votes: 10, 
      createdAt: new Date(),
      comments: [
        { id: '1', content: 'Great post!', author: 'user2', votes: 3, createdAt: new Date() },
        { id: '2', content: 'I agree with this.', author: 'user3', votes: 1, createdAt: new Date() }
      ]
    },
    { 
      id: '2', 
      title: 'Second Post', 
      content: 'This is the second post with more detailed content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.', 
      author: 'user2', 
      votes: 5, 
      createdAt: new Date(),
      comments: []
    },
  ];
  
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return null;
  }
  
  return post;
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  
  if (!post) {
    notFound();
  }
  
  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="space-y-6">
      <Link href="/" className="text-secondary hover:underline">
        ← Back to Home
      </Link>
      
      <div className="bg-accent border border-border rounded-md p-6">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <button className="text-foreground/70 hover:text-primary">▲</button>
            <span className="text-sm font-medium">{post.votes}</span>
            <button className="text-foreground/70 hover:text-primary">▼</button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            
            <p className="text-sm text-foreground/70 mt-1">
              Posted by <Link href={`/profile/${post.author}`} className="hover:underline">{post.author}</Link> on {formattedDate}
            </p>
            
            <div className="mt-4 prose prose-sm max-w-none">
              {post.content}
            </div>
            
            <div className="mt-6 flex items-center gap-4 text-sm text-foreground/70">
              <span className="flex items-center gap-1">
                <span>💬</span> {post.comments.length} comments
              </span>
              <button className="flex items-center gap-1 hover:text-secondary">
                <span>🔗</span> Share
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <CommentForm postId={post.id} />
        <div className="mt-6">
          <CommentList comments={post.comments} />
        </div>
      </div>
    </div>
  );
} 