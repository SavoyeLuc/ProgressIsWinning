-- Step 1: Create the database
DROP DATABASE MiddleGroundDB;
CREATE DATABASE MiddleGroundDB;
USE MiddleGroundDB;

-- Step 2: Create the Users table
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    passHash VARCHAR(255) NOT NULL,
    polLean ENUM('FL', 'L', 'SL', 'M', 'SR', 'R', 'FR') NOT NULL,
    accVerify BOOLEAN DEFAULT FALSE,
    dateCreate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create the PostsData table
CREATE TABLE PostsData (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sources TEXT NULL,
    datePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes ENUM('FR', 'R', 'SR', 'M', 'SL', 'L', 'FL') NOT NULL DEFAULT 'M', -- Tracks political lean of most engagement
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);

-- Step 4: Create the Comments table with Nested Comments Support
CREATE TABLE Comments (
    commentID INT AUTO_INCREMENT PRIMARY KEY,
    postID INT NULL, -- Nullable because some comments may be replies to comments instead of posts
    userID INT NOT NULL,
    parentCommentID INT NULL, -- NULL if it's a top-level comment, otherwise links to another comment
    body TEXT NOT NULL,
    datePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes ENUM('FR', 'R', 'SR', 'M', 'SL', 'L', 'FL') NOT NULL DEFAULT 'M', -- Tracks political lean of most engagement
    FOREIGN KEY (postID) REFERENCES PostsData(postID) ON DELETE CASCADE,
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (parentCommentID) REFERENCES Comments(commentID) ON DELETE CASCADE -- Enables nesting
);
