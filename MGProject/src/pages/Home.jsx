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
      { id: 1, title: 'First Post', content: 'The Tyrannosaurus rex, or T-rex, was one of the most fearsome predators to ever walk the Earth. Living during the Late Cretaceous period, around 68–66 million years ago, this massive dinosaur could grow up to 40 feet long and 12 feet tall at the hips. With its powerful jaws filled with serrated teeth, it had one of the strongest bites of any land animal, capable of crushing bones with ease. Despite its short arms, which had only two fingers, the T-rex was a fast and intelligent hunter, likely preying on large herbivores and possibly scavenging when the opportunity arose. Fossil evidence suggests it had keen eyesight and an exceptional sense of smell, making it an apex predator of its time.' },
      { id: 2, title: 'Second Post', content: 'The world’s political landscape is defined by power struggles, alliances, and conflicts. Major nations compete in trade, technology, and military influence, while regional wars and global issues like climate change fuel tensions. Democracy faces threats from rising authoritarianism and misinformation, yet diplomacy through organizations like the UN and NATO seeks to maintain stability amid shifting power dynamics.' }
    ]);
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([...posts, newPost]);
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