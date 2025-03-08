import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PostList from '../components/Posts/PostList';
import SearchBar from '../components/Search/SearchBar';
import CreatePost from '../components/Posts/CreatePost';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(savedPosts.length > 0 ? savedPosts : [
      {
        id: 1,
        title: 'First Post',
        content: 'The Tyrannosaurus rex, or T-rex, was one of the most fearsome predators to ever walk the Earth...',
        author: 'System',
        timestamp: new Date('2024-01-01').toISOString(),
        likeCounts: { FL: 40, L: 30, SL: 20, M: 45, SR: 25, R: 15, FR: 10 }
      },
      {
        id: 2,
        title: 'Second Post',
        content: 'The worlds political landscape is defined by power struggles...',
        author: 'System',
        timestamp: new Date('2024-01-02').toISOString(),
        likeCounts: { FL: 20, L: 35, SL: 40, M: 50, SR: 40, R: 35, FR: 20 }
      }
    ]);
  }, []);

  const handlePostCreated = (newPost) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setIsCreateModalOpen(false);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <header>
        <h1>MiddleGround</h1>
        <div className="header-buttons">
          <button onClick={() => setIsCreateModalOpen(true)} className="create-button">Create Post</button>
          <button onClick={() => navigate('/login')}>Logout</button>
        </div>
      </header>
      <div className="main-content">
       <Sidebar />
        <main>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <h2>Feed</h2>
          <PostList posts={filteredPosts} />
        </main>
      </div>
      {isCreateModalOpen && (
        <CreatePost 
          onClose={() => setIsCreateModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default Home;