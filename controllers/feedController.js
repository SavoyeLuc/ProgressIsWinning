const db = require('../config/db');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, body, sources } = req.body;
        const username = req.user.username;

        // Validate required fields
        if (!title || !body) {
            return res.status(400).json({
                success: false,
                message: 'Title and body are required'
            });
        }

        // Call the stored procedure to insert post
        const [result] = await db.query(
            'CALL insertPost(?, ?, ?, ?)',
            [username, title, body, sources || null]
        );

        // Check if post was created successfully
        if (result[0][0].message === 'Post Created') {
            // Get the newly created post ID
            const [postResult] = await db.query(
                'SELECT LAST_INSERT_ID() as postID'
            );
            
            const postID = postResult[0].postID;

            return res.status(201).json({
                success: true,
                message: 'Post created successfully',
                postID
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to create post'
            });
        }
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating post'
        });
    }
};

// Get all posts (with pagination and sorting options)
exports.getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'recent'; // Default sort by recency
        const offset = (page - 1) * limit;

        // First, get the posts with basic information
        const [posts] = await db.query(`
            SELECT 
                p.postID, 
                p.title, 
                p.body, 
                p.sources, 
                p.datePosted,
                u.username,
                u.firstName,
                u.lastName,
                u.polLean,
                (SELECT COUNT(*) FROM Comments WHERE postID = p.postID) AS commentCount
            FROM PostsData p
            JOIN Users u ON p.username = u.username
            ORDER BY p.datePosted DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        // Get like counts for each post
        for (const post of posts) {
            const [likeCounts] = await db.query(`
                SELECT 
                    polLean,
                    COUNT(*) as count
                FROM Likes
                WHERE entityType = 'POST' AND entityID = ?
                GROUP BY polLean
            `, [post.postID]);
            
            // Initialize likes object with zeros
            post.likes = {
                'FL': 0, 'L': 0, 'SL': 0, 'M': 0, 'SR': 0, 'R': 0, 'FR': 0
            };
            
            // Fill in actual counts
            likeCounts.forEach(like => {
                post.likes[like.polLean] = like.count;
            });
            
            // Calculate additional metrics
            post.totalLikes = Object.values(post.likes).reduce((sum, count) => sum + count, 0);
            post.rightLikes = post.likes['FR'] + post.likes['R'] + post.likes['SR'];
            post.leftLikes = post.likes['FL'] + post.likes['L'] + post.likes['SL'];
            post.moderateLikes = post.likes['M'];
            post.polarizationScore = Math.abs(post.rightLikes - post.leftLikes);
        }

        // Sort posts based on the requested criteria
        switch (sortBy) {
            case 'balanced':
                // Sort by how balanced the post is (closest to zero difference between right and left leaning likes)
                posts.sort((a, b) => a.polarizationScore - b.polarizationScore);
                break;
            case 'controversial':
                // Sort by total likes (most engagement)
                posts.sort((a, b) => b.totalLikes - a.totalLikes);
                break;
            case 'right':
                // Sort by right-leaning likes
                posts.sort((a, b) => b.rightLikes - a.rightLikes);
                break;
            case 'left':
                // Sort by left-leaning likes
                posts.sort((a, b) => b.leftLikes - a.leftLikes);
                break;
            case 'moderate':
                // Sort by moderate likes
                posts.sort((a, b) => b.moderateLikes - a.moderateLikes);
                break;
            case 'recent':
            default:
                // Already sorted by datePosted DESC in the SQL query
                break;
        }

        // Get total count of posts
        const [countResult] = await db.query('SELECT COUNT(*) as total FROM PostsData');
        const totalPosts = countResult[0].total;
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            success: true,
            currentPage: page,
            totalPages,
            totalPosts,
            postsPerPage: limit,
            sortBy,
            posts
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching posts'
        });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const postID = req.params.id;

        // Get post with user information
        const [posts] = await db.query(`
            SELECT 
                p.postID, 
                p.title, 
                p.body, 
                p.sources, 
                p.datePosted,
                u.username,
                u.firstName,
                u.lastName,
                u.polLean
            FROM PostsData p
            JOIN Users u ON p.username = u.username
            WHERE p.postID = ?
        `, [postID]);

        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const post = posts[0];

        // Get like counts for the post
        const [likeCounts] = await db.query(`
            SELECT 
                polLean,
                COUNT(*) as count
            FROM Likes
            WHERE entityType = 'POST' AND entityID = ?
            GROUP BY polLean
        `, [postID]);
        
        // Initialize likes object with zeros
        post.likes = {
            'FL': 0, 'L': 0, 'SL': 0, 'M': 0, 'SR': 0, 'R': 0, 'FR': 0
        };
        
        // Fill in actual counts
        likeCounts.forEach(like => {
            post.likes[like.polLean] = like.count;
        });

        // Get comments for the post
        const [comments] = await db.query(`
            SELECT 
                c.commentID, 
                c.body, 
                c.datePosted,
                c.parentCommentID,
                u.username,
                u.firstName,
                u.lastName,
                u.polLean
            FROM Comments c
            JOIN Users u ON c.username = u.username
            WHERE c.postID = ?
            ORDER BY c.datePosted ASC
        `, [postID]);

        // Get like counts for each comment
        for (const comment of comments) {
            const [commentLikeCounts] = await db.query(`
                SELECT 
                    polLean,
                    COUNT(*) as count
                FROM Likes
                WHERE entityType = 'COMMENT' AND entityID = ?
                GROUP BY polLean
            `, [comment.commentID]);
            
            // Initialize likes object with zeros
            comment.likes = {
                'FL': 0, 'L': 0, 'SL': 0, 'M': 0, 'SR': 0, 'R': 0, 'FR': 0
            };
            
            // Fill in actual counts
            commentLikeCounts.forEach(like => {
                comment.likes[like.polLean] = like.count;
            });
        }

        // Add comments to post
        post.comments = comments;

        res.json({
            success: true,
            post
        });
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching post'
        });
    }
};

// Get posts by a specific user
exports.getUserPosts = async (req, res) => {
    try {
        const username = req.params.username;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Check if user exists
        const [users] = await db.query('SELECT username FROM Users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get posts by user
        const [posts] = await db.query(`
            SELECT 
                p.postID, 
                p.title, 
                p.body, 
                p.sources, 
                p.datePosted,
                p.likes,
                u.username,
                u.firstName,
                u.lastName,
                u.polLean
            FROM PostsData p
            JOIN Users u ON p.username = u.username
            WHERE p.username = ?
            ORDER BY p.datePosted DESC
            LIMIT ? OFFSET ?
        `, [username, limit, offset]);

        // Get total count of user's posts
        const [countResult] = await db.query(
            'SELECT COUNT(*) as total FROM PostsData WHERE username = ?', 
            [username]
        );
        
        const totalPosts = countResult[0].total;
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            success: true,
            currentPage: page,
            totalPages,
            totalPosts,
            postsPerPage: limit,
            posts
        });
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user posts'
        });
    }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
    try {
        const { postID, body, parentCommentID } = req.body;
        const username = req.user.username;

        // Validate required fields
        if (!postID || !body) {
            return res.status(400).json({
                success: false,
                message: 'Post ID and comment body are required'
            });
        }

        // Check if post exists
        const [posts] = await db.query('SELECT postID FROM PostsData WHERE postID = ?', [postID]);
        
        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // If parentCommentID is provided, check if it exists
        if (parentCommentID) {
            const [comments] = await db.query(
                'SELECT commentID FROM Comments WHERE commentID = ?', 
                [parentCommentID]
            );
            
            if (comments.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Parent comment not found'
                });
            }
        }

        // Insert comment
        const [result] = await db.query(`
            INSERT INTO Comments (postID, username, parentCommentID, body, likes)
            VALUES (?, ?, ?, ?, JSON_OBJECT('FR', 0, 'R', 0, 'SR', 0, 'M', 0, 'SL', 0, 'L', 0, 'FL', 0))
        `, [postID, username, parentCommentID || null, body]);

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            commentID: result.insertId
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding comment'
        });
    }
};

// Like a post or comment
exports.addLike = async (req, res) => {
    try {
        const { entityType, entityID } = req.body;
        const username = req.user.username;
        
        // Get user's political leaning
        const [users] = await db.query(
            'SELECT polLean FROM Users WHERE username = ?',
            [username]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const userPolLean = users[0].polLean;
        
        // Validate entity type
        if (!['POST', 'COMMENT'].includes(entityType)) {
            return res.status(400).json({
                success: false,
                message: 'Entity type must be either POST or COMMENT'
            });
        }
        
        // Check if the entity exists
        let entityExists = false;
        if (entityType === 'POST') {
            const [posts] = await db.query(
                'SELECT postID FROM PostsData WHERE postID = ?',
                [entityID]
            );
            entityExists = posts.length > 0;
        } else {
            const [comments] = await db.query(
                'SELECT commentID FROM Comments WHERE commentID = ?',
                [entityID]
            );
            entityExists = comments.length > 0;
        }
        
        if (!entityExists) {
            return res.status(404).json({
                success: false,
                message: `${entityType.toLowerCase()} not found`
            });
        }
        
        // Call the stored procedure to insert like
        try {
            const [result] = await db.query(
                'CALL insertLike(?, ?, ?, ?)',
                [username, entityType, entityID, userPolLean]
            );
            
            if (result[0][0].message === 'Like Added') {
                // Get updated like counts
                const [likeCounts] = await db.query(`
                    SELECT 
                        polLean,
                        COUNT(*) as count
                    FROM Likes
                    WHERE entityType = ? AND entityID = ?
                    GROUP BY polLean
                `, [entityType, entityID]);
                
                // Format like counts into an object
                const likes = {
                    'FL': 0, 'L': 0, 'SL': 0, 'M': 0, 'SR': 0, 'R': 0, 'FR': 0
                };
                
                likeCounts.forEach(like => {
                    likes[like.polLean] = like.count;
                });
                
                return res.status(201).json({
                    success: true,
                    message: 'Like added successfully',
                    likes
                });
            }
        } catch (error) {
            // Handle duplicate like error
            if (error.message.includes('Like Already Exists')) {
                return res.status(409).json({
                    success: false,
                    message: 'You have already liked this item'
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Add like error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding like'
        });
    }
};

// Remove a like
exports.removeLike = async (req, res) => {
    try {
        const { entityType, entityID } = req.body;
        const username = req.user.username;
        
        // Validate entity type
        if (!['POST', 'COMMENT'].includes(entityType)) {
            return res.status(400).json({
                success: false,
                message: 'Entity type must be either POST or COMMENT'
            });
        }
        
        // Delete the like
        const [result] = await db.query(
            'DELETE FROM Likes WHERE username = ? AND entityType = ? AND entityID = ?',
            [username, entityType, entityID]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Like not found'
            });
        }
        
        // Get updated like counts
        const [likeCounts] = await db.query(`
            SELECT 
                polLean,
                COUNT(*) as count
            FROM Likes
            WHERE entityType = ? AND entityID = ?
            GROUP BY polLean
        `, [entityType, entityID]);
        
        // Format like counts into an object
        const likes = {
            'FL': 0, 'L': 0, 'SL': 0, 'M': 0, 'SR': 0, 'R': 0, 'FR': 0
        };
        
        likeCounts.forEach(like => {
            likes[like.polLean] = like.count;
        });
        
        res.json({
            success: true,
            message: 'Like removed successfully',
            likes
        });
    } catch (error) {
        console.error('Remove like error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing like'
        });
    }
};

// Get comments for a post (with pagination and sorting)
exports.getComments = async (req, res) => {
    try {
        const postID = req.params.postID;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const sortBy = req.query.sortBy || 'recent'; // Default sort by recency
        const parentCommentID = req.query.parentID || null; // For nested comments
        const offset = (page - 1) * limit;

        // Check if post exists
        const [posts] = await db.query('SELECT postID FROM PostsData WHERE postID = ?', [postID]);
        
        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        let orderClause = '';
        
        // Determine the sorting method
        switch (sortBy) {
            case 'controversial':
                // Sort by total likes (most engagement)
                orderClause = `
                    (
                        JSON_EXTRACT(c.likes, '$.FR') + 
                        JSON_EXTRACT(c.likes, '$.R') + 
                        JSON_EXTRACT(c.likes, '$.SR') + 
                        JSON_EXTRACT(c.likes, '$.M') + 
                        JSON_EXTRACT(c.likes, '$.SL') + 
                        JSON_EXTRACT(c.likes, '$.L') + 
                        JSON_EXTRACT(c.likes, '$.FL')
                    ) DESC, 
                    c.datePosted DESC
                `;
                break;
            case 'balanced':
                // Sort by how balanced the comment is
                orderClause = `
                    ABS(
                        (JSON_EXTRACT(c.likes, '$.FR') + JSON_EXTRACT(c.likes, '$.R') + JSON_EXTRACT(c.likes, '$.SR')) - 
                        (JSON_EXTRACT(c.likes, '$.FL') + JSON_EXTRACT(c.likes, '$.L') + JSON_EXTRACT(c.likes, '$.SL'))
                    ) ASC, 
                    c.datePosted DESC
                `;
                break;
            case 'oldest':
                // Sort by oldest first
                orderClause = 'c.datePosted ASC';
                break;
            case 'recent':
            default:
                // Sort by most recent
                orderClause = 'c.datePosted DESC';
                break;
        }

        // Build the query based on whether we're getting top-level or nested comments
        let whereClause = 'c.postID = ?';
        let queryParams = [postID];
        
        if (parentCommentID === null) {
            // Get top-level comments (no parent)
            whereClause += ' AND c.parentCommentID IS NULL';
        } else {
            // Get replies to a specific comment
            whereClause += ' AND c.parentCommentID = ?';
            queryParams.push(parentCommentID);
        }

        // Get comments
        const [comments] = await db.query(`
            SELECT 
                c.commentID, 
                c.postID,
                c.body, 
                c.datePosted,
                c.likes,
                c.parentCommentID,
                u.username,
                u.firstName,
                u.lastName,
                u.polLean,
                (
                    JSON_EXTRACT(c.likes, '$.FR') + 
                    JSON_EXTRACT(c.likes, '$.R') + 
                    JSON_EXTRACT(c.likes, '$.SR') + 
                    JSON_EXTRACT(c.likes, '$.M') + 
                    JSON_EXTRACT(c.likes, '$.SL') + 
                    JSON_EXTRACT(c.likes, '$.L') + 
                    JSON_EXTRACT(c.likes, '$.FL')
                ) AS totalLikes,
                (SELECT COUNT(*) FROM Comments WHERE parentCommentID = c.commentID) AS replyCount
            FROM Comments c
            JOIN Users u ON c.username = u.username
            WHERE ${whereClause}
            ORDER BY ${orderClause}
            LIMIT ? OFFSET ?
        `, [...queryParams, limit, offset]);

        // Get total count of comments for this query
        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM Comments WHERE ${whereClause}`, 
            queryParams
        );
        
        const totalComments = countResult[0].total;
        const totalPages = Math.ceil(totalComments / limit);

        res.json({
            success: true,
            currentPage: page,
            totalPages,
            totalComments,
            commentsPerPage: limit,
            sortBy,
            parentCommentID,
            comments
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching comments'
        });
    }
};

module.exports = exports;
