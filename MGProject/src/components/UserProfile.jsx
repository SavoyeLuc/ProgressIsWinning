import React, { useState, useEffect } from 'react';
import { getUserData } from '../utils/auth';
import '../css/UserProfile.css';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user data from session storage
        const user = getUserData();
        setUserData(user);
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="user-profile">Loading...</div>;
    }

    return (
        <div className="user-profile">
            <h2 className="welcome-message">
                Welcome, {userData?.username || 'Guest'}!
            </h2>
        
        </div>
    );
};

export default UserProfile;