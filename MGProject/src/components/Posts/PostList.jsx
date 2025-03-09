import { useState, useEffect, useRef, useCallback } from 'react';
import Post from './Post';
import { getPosts } from '../../utils/api';
import '../../css/PostList.css';

const PostList = ({ sortBy = 'recent' }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const observer = useRef();

  // Function to fetch posts
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await getPosts(page, 10, sortBy);
      
     // console.log('Fetched posts:', response);
      
      setPosts(prevPosts => {
        // Convert API response to match our Post component format
        const newPosts = response.posts.map(post => ({
          id: post.postID,
          title: post.title,
          content: post.body,
          author: post.username,
          timestamp: post.datePosted,
          likeCounts: post.likes,
          commentCount: post.commentCount,
          sources: post.sources,
          polarizationScore: post.polarizationScore
        }));
        
        // Combine with existing posts, avoiding duplicates
        return [...prevPosts, ...newPosts.filter(
          newPost => !prevPosts.some(p => p.id === newPost.id)
        )];
      });
      
      setTotalPosts(response.totalPosts);
      setHasMore(page < response.totalPages);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, loading, hasMore]);

  // Initial load
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset when sort method changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [sortBy]);

  // Setup intersection observer for infinite scrolling
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, { threshold: 0.5 });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore]);

  // Add this function to PostList
  const updatePostComments = (postId, newComment, totalComments) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          // If totalComments is provided, use it directly
          if (totalComments !== undefined) {
            return {
              ...post,
              commentCount: totalComments
            };
          }
          
          // Otherwise, increment the count for a new comment
          if (newComment) {
            return {
              ...post, 
              commentCount: (post.commentCount || 0) + 1,
              comments: [...(post.comments || []), newComment]
            };
          }
          
          // If neither is provided, don't change anything
          return post;
        }
        return post;
      })
    );
  };

  return (
    <div className="post-list">
      {posts.length === 0 && !loading && !error && (
        <div className="no-posts-message">No posts available.</div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      {posts.map((post, index) => {
        // Add ref to last post for infinite scrolling
        if (posts.length === index + 1) {
          return <div ref={lastPostElementRef} key={post.id}>
            <Post post={post} onCommentAdded={updatePostComments} />
          </div>;
        } else {
          return <Post key={post.id} post={post} onCommentAdded={updatePostComments} />;
        }
      })}
      
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading more posts...</p>
        </div>
      )}
      
      {!hasMore && posts.length > 0 && (
        <div className="end-message">
          You've reached the end! ({posts.length} of {totalPosts} posts)
        </div>
      )}
    </div>
  );
};

export default PostList;