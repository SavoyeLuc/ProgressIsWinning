import React, { useState } from 'react';
import { apiRequest } from '../../utils/api';
import '../../css/CreatePost.css';

const CreatePost = ({ onClose, onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [sources, setSources] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Prepare post data
            const postData = {
                title,
                body: content,
                sources
            };

            // Send request to API
            const response = await apiRequest('/feed/posts', {
                method: 'POST',
                body: JSON.stringify(postData)
            });

            console.log('Post created:', response);

            // Create a local post object for immediate UI update
            const newPost = {
                id: response.postID,
                title,
                content,
                author: JSON.parse(sessionStorage.getItem('userData'))?.username || 'Anonymous',
                timestamp: new Date().toISOString(),
                likeCounts: { FL: 0, L: 0, SL: 0, M: 0, SR: 0, R: 0, FR: 0 }
            };

            // Notify parent component
            if (onPostCreated) {
                onPostCreated(newPost);
            }
            
            // Close the modal
            onClose();
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err.message || 'Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Create New Post</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your thoughts..."
                        required
                    />
                    <input
                        type="text"
                        value={sources}
                        onChange={(e) => setSources(e.target.value)}
                        placeholder="Sources (comma separated URLs)"
                    />
                    <div className="button-group">
                        <button 
                            type="submit" 
                            className="create-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating...' : 'Create Post'}
                        </button>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="cancel-button"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;