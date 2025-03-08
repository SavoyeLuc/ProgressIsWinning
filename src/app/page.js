import PostCard from '@/components/posts/PostCard';

export default function Home() {
  // In a real app, you'd fetch posts from an API
  const posts = [
    { id: 1, title: 'First Post', content: 'This is the first post', author: 'user1', votes: 10, commentCount: 5, createdAt: new Date() },
    { id: 2, title: 'Second Post', content: 'This is the second post', author: 'user2', votes: 5, commentCount: 2, createdAt: new Date() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Recent Posts</h1>
      <div className="space-y-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
          
        ))}
      </div>
    </div>
  );
} 