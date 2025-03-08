-- Step 1: Create the database
DROP DATABASE IF EXISTS MiddleGroundDB;
CREATE DATABASE MiddleGroundDB;
USE MiddleGroundDB;

-- Step 2: Create the Users table
CREATE TABLE Users (
    username VARCHAR(50) PRIMARY KEY,
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
    username INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sources TEXT NULL,
    datePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes JSON NOT NULL DEFAULT ('{
        "FR": 0, 
        "R": 0, 
        "SR": 0, 
        "M": 0, 
        "SL": 0, 
        "L": 0, 
        "FL": 0
    }'), -- Stores the count of each type of like
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);

-- Step 4: Create the Comments table with Nested Comments Support
CREATE TABLE Comments (
    commentID INT AUTO_INCREMENT PRIMARY KEY,
    postID INT NULL, -- Nullable because some comments may be replies to comments instead of posts
    username INT NOT NULL,
    parentCommentID INT NULL, -- NULL if it's a top-level comment, otherwise links to another comment
    body TEXT NOT NULL,
    datePosted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes JSON NOT NULL DEFAULT ('{
        "FR": 0, 
        "R": 0, 
        "SR": 0, 
        "M": 0, 
        "SL": 0, 
        "L": 0, 
        "FL": 0
    }'), -- Stores the count of each type of like
    FOREIGN KEY (postID) REFERENCES PostsData(postID) ON DELETE CASCADE,
    FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE,
    FOREIGN KEY (parentCommentID) REFERENCES Comments(commentID) ON DELETE CASCADE -- Enables nesting
);



-- PRODECURES:


-- prodecure to insert a new user
-- expects: CALL insertUser('johndoe', 'John', 'Doe', 'johndoe@example.com', 'hashedpassword123', 'M');
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


-- Procedure to insert a new post
--CALL insertPost(username, 'Abortion', 'Law: if we make a law in which abortion is...', 'https://ai-news.com');
DELIMITER $$

CREATE PROCEDURE insertPost(
    IN p_username INT,
    IN p_title VARCHAR(255),
    IN p_body TEXT,
    IN p_sources TEXT NULL
)
BEGIN
    -- Insert new post
    INSERT INTO PostsData (username, title, body, sources, likes)
    VALUES (p_username, p_title, p_body, p_sources, 
        JSON_OBJECT('FR', 0, 'R', 0, 'SR', 0, 'M', 0, 'SL', 0, 'L', 0, 'FL', 0));

    -- Return success message
    SELECT 'Post Created' AS message;
END $$

DELIMITER ;