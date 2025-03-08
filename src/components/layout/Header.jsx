import Link from 'next/link';

export default function Header() {
  // In a real app, you'd check if the user is authenticated
  const isAuthenticated = false;

  return (
    <header className="bg-accent border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          RedditClone
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link href="/posts" className="hover:text-secondary">
            Posts
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link href="/posts/create" className="hover:text-secondary">
                Create Post
              </Link>
              <Link href="/profile" className="hover:text-secondary">
                Profile
              </Link>
              <button className="text-foreground hover:text-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-secondary">
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-full"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 