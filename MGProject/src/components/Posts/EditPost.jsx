import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditPost = ({ post, onPostUpdate }) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`/api/posts/${post.id}`);
                navigate('/');
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    };

    return (
        <div className="edit-post">
            <button 
                onClick={handleDelete}
                className="delete-button"
                style={{ 
                    backgroundColor: '#ff4444',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    marginTop: '10px',
                    cursor: 'pointer'
                }}
            >
                Delete Post
            </button>
            {/* ...existing code... */}
        </div>
    );
};

export default EditPost;
