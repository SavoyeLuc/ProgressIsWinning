import React, { useState } from 'react';
import '../../css/CreatePost.css';

const CreatePost = ({ onClose, onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            id: Date.now(),
            title,
            content,
            author: 'Anonymous',
            timestamp: new Date().toISOString(),
            likeCounts: { FL: 0, L: 0, SL: 0, M: 0, SR: 0, R: 0, FR: 0 }
        };

        // Save to localStorage
        const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
        localStorage.setItem('posts', JSON.stringify([newPost, ...existingPosts]));

        onPostCreated(newPost);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Create New Post</h2>
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
                    <div className="button-group">
                        <button type="submit" className="create-button">Create Post</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;