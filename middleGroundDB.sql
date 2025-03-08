-- Step 1: Create the database
DROP DATABASE IF EXISTS MiddleGroundDB; -- Ensure the database does not already exist
CREATE DATABASE MiddleGroundDB; -- Create the database
USE MiddleGroundDB; 

-- Step 2: Create the Users table
CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY, -- Unique string identifier for each user
    firstName VARCHAR(50) NOT NULL, -- User's first name
    lastName VARCHAR(50) NOT NULL, -- User's last name
    email VARCHAR(100) UNIQUE NOT NULL, -- User's email address, must be unique
    passHash VARCHAR(255) NOT NULL, -- Hashed password for security
    polLean ENUM('FL', 'L', 'SL', 'M', 'SR', 'R', 'FR') NOT NULL, -- Political leaning of the user
    accVerify BOOLEAN DEFAULT FALSE, -- Account verification status
    dateCreate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create the PostsData table
CREATE TABLE PostsData (
    postID INT AUTO_INCREMENT PRIMARY KEY, -- default Unique identifier for each post
    username VARCHAR(50) NOT NULL, -- Username of the user who created the post
    title VARCHAR(255) NOT NULL, -- Title of the post
    body TEXT NOT NULL, -- Content of the post
    sources TEXT NULL, -- Optional sources for the post
    datePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE -- links the posts username to the Users table
);

-- Step 4: Create the Comments table with Nested Comments Support
CREATE TABLE Comments (
    commentID INT AUTO_INCREMENT PRIMARY KEY, -- default Unique identifier for each comment
    postID INT NULL, -- ID of which post it came from, Nullable because some comments may be replies to comments instead of posts
    username VARCHAR(50) NOT NULL, -- Username of the user who created the comment
    parentCommentID INT NULL, -- ID of which comment it came from, NULL if it's a top-level comment because it has a post, otherwise links to another comment
    body TEXT NOT NULL, -- Content of the comment
    datePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postID) REFERENCES PostsData(postID) ON DELETE CASCADE, -- links the comments postID to the PostsData table
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE, -- links the comments username to the Users table
    FOREIGN KEY (parentCommentID) REFERENCES Comments(commentID) ON DELETE CASCADE -- Enables nesting
);

-- Step 5: Create the Likes table
CREATE TABLE Likes (
    likeID INT AUTO_INCREMENT PRIMARY KEY, -- default Unique identifier for each like
    username VARCHAR(50) NOT NULL, -- Username of the user who liked the post or comment
    entityType ENUM('POST', 'COMMENT') NOT NULL, -- Type of entity being liked (post or comment)
    entityID INT NOT NULL, -- ID of the post or comment being liked *CANNOT GO BASED ON THIS, MUST USE BOTH ENTITY TYPE AND ENTITY ID*
    polLean ENUM('FL', 'L', 'SL', 'M', 'SR', 'R', 'FR') NOT NULL, -- Political leaning of the user who liked the post or comment
    dateLiked TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the like was made
    UNIQUE KEY unique_like (username, entityType, entityID), -- Prevent duplicate likes
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);

-- Step 6: Add Indexes for Performance
CREATE INDEX idx_datePosted ON PostsData(datePosted); -- Index for faster retrieval of posts by date
CREATE INDEX idx_datePosted_comments ON Comments(datePosted); -- Index for faster retrieval of comments by date
CREATE INDEX idx_likes_entity ON Likes(entityType, entityID); -- Index for faster retrieval of likes by entity type and ID
CREATE INDEX idx_likes_user ON Likes(username); -- Index for faster retrieval of likes by user


-- PROCEDURES:

-- PROCEDURE: Insert a new user
-- Example: CALL insertUser('johndoe', 'John', 'Doe', 'johndoe@example.com', 'hashedpassword123', 'M');
DELIMITER $$

CREATE PROCEDURE insertUser(
    IN p_username VARCHAR(50),
    IN p_firstName VARCHAR(50),
    IN p_lastName VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_passHash VARCHAR(255),
    IN p_polLean ENUM('FL', 'L', 'SL', 'M', 'SR', 'R', 'FR')
)
BEGIN
    -- Check if the username already exists
    IF EXISTS (SELECT 1 FROM Users WHERE username = p_username) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Username in Use';
    -- Check if the email already exists
    ELSEIF EXISTS (SELECT 1 FROM Users WHERE email = p_email) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email in Use';
    ELSE    -- Insert new user
        INSERT INTO Users (username, firstName, lastName, email, passHash, polLean, accVerify)
        VALUES (p_username, p_firstName, p_lastName, p_email, p_passHash, p_polLean, FALSE);
        
        -- Return success message
        SELECT 'User Created' AS message;
    END IF;
END $$

DELIMITER ;


-- PROCEDURE: Insert a new post
-- Example: CALL insertPost('johndoe', 'Abortion', 'Law: if we make a law in which abortion is...', 'https://ai-news.com');
DELIMITER $$

CREATE PROCEDURE insertPost(
    IN p_username VARCHAR(50),
    IN p_title VARCHAR(255),
    IN p_body TEXT,
    IN p_sources TEXT NULL
)
BEGIN
    -- Insert new post
    INSERT INTO PostsData (username, title, body, sources)
    VALUES (p_username, p_title, p_body, p_sources);

    -- Return success message
    SELECT 'Post Created' AS message;
END $$

DELIMITER ;


-- PROCEDURE: Insert a new comment
-- Example for a top-level comment: CALL insertComment(postID, 'JohnDoe', NULL, 'This is a great post!');
-- Example for replying to another comment: CALL insertComment(NULL, 'JaneDoe', parentCommentID, 'I agree with JohnDoe!');
DELIMITER $$

CREATE PROCEDURE insertComment(
    IN p_postID INT NULL,          -- NULL if it's a reply to another comment
    IN p_username VARCHAR(50),     -- Username instead of userID
    IN p_parentCommentID INT NULL, -- NULL if it's a top-level comment
    IN p_body TEXT
)
BEGIN
    -- Insert new comment
    INSERT INTO Comments (postID, username, parentCommentID, body)
    VALUES (p_postID, p_username, p_parentCommentID, p_body);

    -- Return success message
    SELECT 'Comment Created' AS message;
END $$

DELIMITER ;


-- PROCEDURE: Insert a like (NEW)
-- Example: CALL insertLike('johndoe', 'POST', 5, 'M'); -- JohnDoe likes post with ID 5
DELIMITER $$

CREATE PROCEDURE insertLike(
    IN p_username VARCHAR(50),
    IN p_entityType ENUM('POST', 'COMMENT'),
    IN p_entityID INT,
    IN p_polLean ENUM('FL', 'L', 'SL', 'M', 'SR', 'R', 'FR')
)
BEGIN
    -- Check if the like already exists
    IF EXISTS (
        SELECT 1 FROM Likes 
        WHERE username = p_username 
        AND entityType = p_entityType 
        AND entityID = p_entityID
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Like Already Exists';
    ELSE
        -- Insert new like
        INSERT INTO Likes (username, entityType, entityID, polLean)
        VALUES (p_username, p_entityType, p_entityID, p_polLean);

        -- Return success message
        SELECT 'Like Added' AS message;
    END IF;
END $$

DELIMITER ;
